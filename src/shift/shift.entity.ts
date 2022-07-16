import { Entity, Column, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Shift {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ nullable: true })
    name: string

    @Column({ nullable: true })
    date: Date

    @Column({ nullable: true })
    start_time: string

    @Column({ nullable: true })
    end_time: string

    @Column({ default: 0 })
    is_published: number
}
