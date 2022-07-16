import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Shift } from "./shift.entity"
import { ShiftController } from "./shift.controller"
import { ShiftService } from "./shift.service"

@Module({
    imports: [TypeOrmModule.forFeature([Shift])],
    controllers: [ShiftController],
    providers: [ShiftService],
})
export class ShiftModule {}
