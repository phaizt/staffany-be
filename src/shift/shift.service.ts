import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common"
import { Repository, Between, Not } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Shift } from "./shift.entity"
import { CreateShiftDto, QueryGetShiftDto } from "./dtos/create-shift.dto"
import * as moment from "moment-timezone"

const tz = "Asia/Singapore"

@Injectable()
export class ShiftService {
    constructor(@InjectRepository(Shift) private repo: Repository<Shift>) {}


    db() {
        return this.repo
    }

    async find(query: QueryGetShiftDto) {
        const take = +query.per_page || 5
        const skip = +query.page || 1
        const valid = moment(query.date, "yyyy-MM-DD").tz(tz).isValid()
        const date = valid ? moment(query.date).tz(tz) : moment().tz(tz)
        const start_date = date.clone()
        const end_date = date.clone().add(1, "day")

        const [data, count] = await this.repo.findAndCount({
            where: {
                date: Between(start_date.toDate(), end_date.toDate()),
            },
            take: take,
            skip: skip - 1,
        })
        return {
            count,
            page: skip,
            per_page: take,
            data,
        }
    }

    async findOne(id: number) {
        if (!id) {
            throw new NotFoundException("data not found")
        }
        const data = await this.repo.findOneBy({ id })
        if (!data) {
            throw new NotFoundException("data not found")
        }
        return data
    }

    async findByDatetime(body: Partial<CreateShiftDto>) {
        const date = moment(body.date, "yyyy-MM-DD")
        const start_date = date.clone()
        const end_date = date.clone().add(1, "day")

        const data = await this.repo.find({
            where: {
                date: Between(start_date.toDate(), end_date.toDate()),
            },
        })
        let valid = true
        if (data) {
            data.forEach((el) => {
                const start_time = moment(el.start_time, "HH:mm").tz(tz).subtract(
                    "2",
                    "minutes",
                )
                const end_time = moment(el.end_time, "HH:mm").tz(tz).add(
                    "2",
                    "minutes",
                )
                const m_start = moment(body.start_time, "HH:mm").tz(tz)
                const m_end = moment(body.end_time, "HH:mm").tz(tz)
                if (
                    m_start.isBetween(start_time, end_time) ||
                    m_end.isBetween(start_time, end_time)
                ) {
                    valid = false
                }
            })
        }
        return valid
    }

    async create(body: CreateShiftDto) {
        const check = await this.findByDatetime(body)
        if (!check) {
            throw new BadRequestException(
                "Create Error, the date and time are clashing each other",
            )
        }
        const data = this.repo.create({ ...body, is_published: 0 })
        return this.repo.save(data)
    }

    async update(id: number, body: Partial<CreateShiftDto>) {
        const data = await this.findOne(id)
        if (body.start_time || body.end_time) {
            if (
                data.start_time !== body.start_time ||
                data.end_time !== body.end_time
            ) {
                const check = await this.findByDatetime(body)
                if (!check) {
                    throw new BadRequestException(
                        "Create Error, the date and time are clashing each other",
                    )
                }
            }
        }
        if (data.is_published) {
            throw new BadRequestException(
                "update error, data has been published",
            )
        }
        Object.assign(data, body)
        return this.repo.save(data)
    }

    async weekPublish(date: string) {
        const valid = moment(date, "yyyy-MM-DD").tz(tz).isValid()
        const dateOfWeek = valid ? moment(date).tz(tz) : moment().tz(tz)
        const start = dateOfWeek.clone().startOf("week")
        const end = dateOfWeek.clone().endOf("week").add(1, "day")
        const data = await this.repo.find({
            where: [
                {
                    date: Between(start.toDate(), end.toDate()),
                    is_published: Not(1),
                },
            ],
        })
        data.forEach((el) => {
            Object.assign(el, { is_published: 1 })
        })
        return this.repo.save(data)
    }

    async remove(id: number) {
        const data = await this.findOne(id)
        if (data.is_published) {
            throw new BadRequestException(
                "delete error, data has been published",
            )
        }
        return this.repo.remove(data)
    }
}
