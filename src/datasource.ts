import "reflect-metadata"
import { DataSource } from "typeorm"
import { Product } from "./entities/Product"
import { Company } from "./entities/Company"


export const datasource = new DataSource({
    type: 'postgres',
    host:'localhost',
    port:8080,
    username:'postgres',
    password:'pavani',
    database:'migrations',
    logging: true,
    synchronize: false,
    entities : [Product, Company],
    migrations:['src/migrations/*.ts']
})
