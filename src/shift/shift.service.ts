import { Injectable } from "@nestjs/common"
import { Repository, MoreThanOrEqual, LessThanOrEqual, Between } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Shift } from "./shift.entity"
import { CreateShiftDto, QueryGetShiftDto } from "./dtos/create-shift.dto"
import * as moment from "moment"

@Injectable()
export class ShiftService {
    constructor(@InjectRepository(Shift) private repo: Repository<Shift>) {}

    create(body: CreateShiftDto) {
        const user = this.repo.create(body)

        return this.repo.save(user)
    }

    async find(query: QueryGetShiftDto) {
        const take = +query.per_page || 5
        const skip = +query.page || 1
        const valid = moment(query.date, "yyyy-MM-DD").isValid()
        const date = valid ? moment(query.date) : moment()
        const start_date = date.clone().subtract(1, "day")
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
}
