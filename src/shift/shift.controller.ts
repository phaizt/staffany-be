import {
    Body,
    Controller,
    Post,
    Get,
    Query,
    Param,
    Put,
    Delete,
} from "@nestjs/common"
import { CreateShiftDto, QueryGetShiftDto } from "./dtos/create-shift.dto"
import { ShiftService } from "./shift.service"

@Controller("shift")
export class ShiftController {
    constructor(private shiftService: ShiftService) {}

    @Get()
    findAllShifts(@Query() query: QueryGetShiftDto) {
        return this.shiftService.find(query)
    }

    @Get("/:id")
    findOneShifts(@Param("id") id: string) {
        return this.shiftService.findOne(+id)
    }

    @Post()
    async createShift(@Body() body: CreateShiftDto) {
        const shift = await this.shiftService.create(body)
        return shift
    }

    @Put("/:id")
    async updateShift(
        @Param("id") id: string,
        @Body() body: Partial<CreateShiftDto>,
    ) {
        const shift = await this.shiftService.update(+id, body)
        return shift
    }

    @Delete("/:id")
    async deleteShift(@Param("id") id: string) {
        const shift = await this.shiftService.remove(+id)
        return shift
    }
}
