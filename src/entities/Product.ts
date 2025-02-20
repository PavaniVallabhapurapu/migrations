import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm"
import { Company } from "./Company"


@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column()
    price: number

    @Column({nullable : true})
    description: string

    @Column()
    value: number

    @Column({nullable : true})
    review : number

    @ManyToOne(()=> Company, (company)=> company.products)
    company : Company

}