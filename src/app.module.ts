import { join } from "path"
import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { ShiftModule } from "./shift/shift.module"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type: "sqlite",
            database: "shift.sqlite",
            entities: [join(__dirname, "**", "*.entity.{ts,js}")],
            synchronize: true,
        }),
        ShiftModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
