import { IsString, IsDateString, IsOptional, IsBoolean } from "class-validator"

export class CreateShiftDto {
    @IsString()
    name: string

    @IsDateString()
    date: Date

    @IsString()
    start_time: string

    @IsString()
    end_time: string

    @IsBoolean()
    @IsOptional()
    is_published: number | null
}

export type QueryGetShiftDto = {
    per_page: string
    page: string
    date: string
}
