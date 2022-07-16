import { join } from "path"
import { Test, TestingModule } from "@nestjs/testing"
import { ShiftService } from "./shift.service"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Shift } from "./shift.entity"
import { BadRequestException, NotFoundException } from "@nestjs/common"

describe("ShiftService", () => {
    const shift: Shift[] = []
    let service: ShiftService

    const fakeData = {
        id: 1,
        name: "shift 3",
        date: new Date(),
        start_time: "16:00",
        end_time: "17:00",
        is_published: 0,
    }

    const fakeData2 = {
        name: "update data",
        date: new Date(),
        start_time: "11:00",
        end_time: "12:00",
        is_published: 0,
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                TypeOrmModule.forRoot({
                    type: "sqlite",
                    database: "test.sqlite",
                    synchronize: true,
                    entities: [join(__dirname, "**", "*.entity.{ts,js}")],
                }),
                TypeOrmModule.forFeature([Shift]),
            ],
            providers: [ShiftService],
        }).compile()

        service = module.get<ShiftService>(ShiftService)
    })

    afterEach(() => {
        service.db().query(`DELETE FROM "shift";`)
    })

    it("should be defined", () => {
        expect(service).toBeDefined()
    })

    it("should be create a shift the data is correct", async () => {
        const shift = await service.create(fakeData)
        expect(shift.name).toEqual("shift 3")
    })

    it("should throw if time clashing each other", async () => {
        try {
            await service.create(fakeData)
            await service.create(fakeData)
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)
        }
    })

    it("should return true if time NOT clashing each other", async () => {
        await service.create(fakeData)
        const result = await service.findByDatetime(fakeData2)
        expect(result).toBeTruthy()
    })

    it("should return false if time clashing each other", async () => {
        await service.create(fakeData)
        const result = await service.findByDatetime(fakeData)
        expect(result).toBeFalsy()
    })

    it("should return data if exist", async () => {
        await service.create(fakeData)
        const result = await service.findOne(1)
        expect(result.name).toEqual(fakeData.name)
    })

    it("should throw if data not exist", async () => {
        try {
            await service.create(fakeData)
             await service.findOne(7)
        } catch (error) {
            expect(error).toBeInstanceOf(NotFoundException)
        }
    })

    it("should throw if time clashing each other on Update", async () => {
        try {
            await service.create(fakeData)
            await service.update(1, fakeData)
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)
        }
    })

    it("should throw if update data that has been published", async () => {
        try {
            await service.create({ ...fakeData, is_published: 1 })
            await service.update(1, fakeData2)
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)
        }
    })

    it("should update if data is correct", async () => {
        await service.create(fakeData)
        const shift = await service.update(1, fakeData2)
        expect(shift.name).toEqual(fakeData2.name)
    })

    it("should throw if remove data that has been published", async () => {
        try {
            await service.create({ ...fakeData, is_published: 1 })
            await service.remove(1)
        } catch (error) {
            expect(error).toBeInstanceOf(BadRequestException)
        }
    })

    it("should remove data", async () => {
      await service.create(fakeData)
      const shift = await service.remove(1)
      expect(shift.name).toEqual(fakeData.name)
  })
})
