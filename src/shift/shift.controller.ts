import {
    Body,
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Query,
    NotFoundException,
    Session,
    UseGuards,
} from "@nestjs/common"
import { CreateShiftDto } from "./dtos/create-shift.dto"
import { ShiftService } from "./shift.service"

@Controller("shift")
export class ShiftController {
    constructor(private shiftService: ShiftService) {}

    @Post()
    async createShift(@Body() body: CreateShiftDto) {
        const shift = await this.shiftService.create(body)
        return shift
    }

    @Get()
    findAllShifts(@Query("email") email: string) {
        return this.shiftService.find()
    }
}
