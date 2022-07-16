import {
    Body,
    Controller,
    Post,
    Get,
    Query,
    Param,
    Put,
    Delete,
    Patch,
} from "@nestjs/common"
import { CreateShiftDto, QueryGetShiftDto } from "./dtos/create-shift.dto"
import { ShiftService } from "./shift.service"

@Controller("shift")
export class ShiftController {
    constructor(private shiftService: ShiftService) {}

    @Get()
    async findAllShifts(@Query() query: QueryGetShiftDto) {
        return await this.shiftService.find(query)
    }

    @Get("/:id")
    async findOneShifts(@Param("id") id: string) {
        return {
            message: "data found",
            data: await this.shiftService.findOne(+id),
        }
    }

    @Post()
    async createShift(@Body() body: CreateShiftDto) {
        const data = await this.shiftService.create(body)
        return { message: "shift created succesfully", data }
    }

    @Put("/:id")
    async updateShift(
        @Param("id") id: string,
        @Body() body: Partial<CreateShiftDto>,
    ) {
        const data = await this.shiftService.update(+id, body)
        return { message: `shift with id ${id} has been updated`, data }
    }

    @Patch("/publish/:id")
    async publishShift(@Param("id") id: string) {
        const data = await this.shiftService.update(+id, { is_published: 1 })
        return { message: `shift with id ${id} has been published`, data }
    }

    @Patch("/publish")
    async publishWeekShift(@Query("date") date: string) {
        const data = await this.shiftService.weekPublish(date)
        return { message: `publish a week successful`, data }
    }

    @Delete("/:id")
    async deleteShift(@Param("id") id: string) {
        const shift = await this.shiftService.remove(+id)
        return shift
    }
}
