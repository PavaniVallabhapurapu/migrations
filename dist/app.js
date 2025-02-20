"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("reflect-metadata");
const datasource_1 = require("./datasource");
const Product_1 = require("./entities/Product");
const Company_1 = require("./entities/Company");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = 4000;
app.post('/companies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyRepo = datasource_1.datasource.getRepository(Company_1.Company);
    const productRepo = datasource_1.datasource.getRepository(Product_1.Product);
    const { name, description, products } = req.body;
    const company = companyRepo.create({ name, description });
    const savedCompany = yield companyRepo.save(company);
    if (Array.isArray(products) && products.length > 0) {
        const productEntities = products.map((prod) => {
            return productRepo.create({
                name: prod.name,
                description: prod.description,
                price: prod.price,
                value: prod.value,
                owner: prod.owner,
                company: savedCompany
            });
        });
        yield productRepo.save(productEntities);
    }
    res.json(yield companyRepo.findOne({ where: { id: savedCompany.id }, relations: ["products"] }));
}));
// Create Multiple Products and Link to an Existing Company
app.post('/products', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productRepo = datasource_1.datasource.getRepository(Product_1.Product);
    const companyRepo = datasource_1.datasource.getRepository(Company_1.Company);
    const { companyId, products } = req.body;
    const company = yield companyRepo.findOne({ where: { id: companyId } });
    if (!company) {
        res.status(404).json({ error: "Company not found" });
        return;
    }
    if (!Array.isArray(products) || products.length === 0) {
        res.status(400).json({ error: "Products must be a non-empty array" });
        return;
    }
    const productEntities = products.map(prod => productRepo.create({
        name: prod.name,
        description: prod.description,
        price: prod.price,
        value: prod.value,
        owner: prod.owner,
        company: company
    }));
    const savedProducts = yield productRepo.save(productEntities);
    res.json(savedProducts);
}));
app.get('/companies', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const companyRepo = datasource_1.datasource.getRepository(Company_1.Company);
    const companies = yield companyRepo.find({ relations: ["products"] });
    res.json(companies);
}));
app.get('/products', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productRepo = datasource_1.datasource.getRepository(Product_1.Product);
    const products = yield productRepo.find({ relations: ["company"] });
    res.json(products);
}));
datasource_1.datasource.initialize().then(() => {
    console.log("DataSource sucessfully connected with the database!");
}).catch((err) => {
    console.log("DataSource connection failed", err);
});
app.listen(port, () => {
    console.log(`server running on ${port}`);
});
