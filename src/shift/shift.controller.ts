import {
    Body,
    Controller,
    Post,
    Get,
    Query,
} from "@nestjs/common"
import { CreateShiftDto, QueryGetShiftDto } from "./dtos/create-shift.dto"
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
    findAllShifts(@Query() query: QueryGetShiftDto) {
        return this.shiftService.find(query)
    }
}
