"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.datasource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Product_1 = require("./entities/Product");
const Company_1 = require("./entities/Company");
exports.datasource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 8080,
    username: 'postgres',
    password: 'pavani',
    database: 'migrations',
    logging: true,
    synchronize: false,
    entities: [Product_1.Product, Company_1.Company],
    migrations: ['src/migrations/*.ts']
});
