import express, {Request, Response} from "express"
import "reflect-metadata"
import { datasource } from "./datasource"
import { Product } from "./entities/Product"
import { Company } from "./entities/Company"


const app = express()
app.use(express.json())
const port = 8000


// app.get('/',async function(req,res) {
//     // insert
//  const companyRepo = datasource.getRepository(Company)

//     let products : Product[] = []

//     let car1 = new Product()
//     car1.name = 'Tesla Superior S'
//     car1.price = 2500000
//     car1.description = 'Style and fast'
//     car1.value = 1000
    

//     let car2 = new Product()
//     car2.name = 'Tesla Power'
//     car2.price = 4500000
//     car2.description = 'Fast and dashing'
//     car2.value = 900


//     let car3 = new Product()
//     car3.name = 'Tesla ranger'
//     car3.price = 5000000
//     car3.description = 'Style and Smooth'
//     car3.value = 800

//     products.push(car1, car2, car3)


//     let company : Company = new Company()
//     company.name = 'Tesla'
//     company.description = 'An electric car Company'
    
//     company.products = products

//     const dataInserted = await companyRepo.save(company)
//     res.json(dataInserted)
    
// })

const companyRepo = datasource.getRepository(Company);
app.post('/company', async (req: Request, res: Response) => {
    try {
        const { name, description, products } = req.body;

        let company = new Company()
        company.name = name
        company.description = description
        company.products = products.map((p: any) => {
            let product = new Product()
            product.name = p.name
            product.price = p.price
            product.description = p.description
            product.value = p.value
            return product
        })

        const savedCompany = await companyRepo.save(company);
        res.status(201).json(savedCompany);
    } catch (error) {
        res.status(500).json({ message: 'Error creating company', error });
    }
})


app.get('/company', async (req: Request, res: Response) => {
    try {
        const companies = await companyRepo.find({ relations: ['products'] })
        res.json(companies)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching companies', error })
    }
})

app.get('/company/:id', async (req: Request, res: Response):Promise<void> => {
    try {
        const company = await companyRepo.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['products'],
        })

        if (!company) {
            res.status(404).json({ message: 'Company not found' })
            return
        }
        res.json(company)
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company', error })
    }
})


app.put('/company/:id', async (req: Request, res: Response):Promise<void> => {
    try {
        const { name, description, products } = req.body
        let company = await companyRepo.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['products'],
        });

        if (!company) {
            res.status(404).json({ message: 'Company not found' })
            return
        }

        company.name = name || company.name
        company.description = description || company.description

        if (products) {
            company.products = products.map((p: any) => {
                let product = new Product()
                product.name = p.name
                product.price = p.price
                product.description = p.description
                product.value = p.value
                return product
            })
        }

        const updatedCompany = await companyRepo.save(company)
        res.json(updatedCompany)
    } catch (error) {
        res.status(500).json({ message: 'Error updating company', error })
    }
})


app.delete('/company/:id', async (req: Request, res: Response) : Promise<void> => {
    try {
        const company = await companyRepo.findOne({ where: { id: parseInt(req.params.id) } })

        if (!company) {
            res.status(404).json({ message: 'Company not found' })
            return
        }

        await companyRepo.remove(company)
        res.json({ message: 'Company deleted successfully' })
    } catch (error) {
        res.status(500).json({ message: 'Error deleting company', error })
    }
})

datasource.initialize().then(()=>{
    console.log("DataSource sucessfully connected with the database!")
}).catch((err) =>{
    console.log("DataSource connection failed", err)
})


app.listen(port , ()=>{
    console.log(`server running on ${port}`)
})