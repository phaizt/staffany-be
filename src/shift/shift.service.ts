import { Injectable } from "@nestjs/common"
import { Repository } from "typeorm"
import { InjectRepository } from "@nestjs/typeorm"
import { Shift } from "./shift.entity"
import { CreateShiftDto } from "./dtos/create-shift.dto"

@Injectable()
export class ShiftService {
    constructor(@InjectRepository(Shift) private repo: Repository<Shift>) {}

    create(body: CreateShiftDto) {
        const user = this.repo.create(body)

        return this.repo.save(user)
    }

    find() {
        return this.repo.find()
    }
}
