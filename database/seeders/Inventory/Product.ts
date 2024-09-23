import { getRandomNumberInRange } from 'App/Services/Functions'
import PackagingDetail from 'App/Models/PackagingDetail'
import PackagingType from 'App/Models/PackagingType'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Category from 'App/Models/Category'
import Product from 'App/Models/Product'
import Entry from 'App/Models/Entry'
import Unit from 'App/Models/Unit'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        const [caja] = await PackagingType.createMany([
            { name: 'Caja' },
            { name: 'Bolsa' },
            { name: 'CajaH' },
        ])

        const [kg] = await Unit.createMany([
            { name: 'KG' },
            { name: 'PZA' },
            { name: 'LT' },
            { name: 'GR' },
        ])

        const [especias] = await Category.createMany([
            { name: 'Especias' },
            { name: 'Aceites' },
            { name: 'Carnes' },
            { name: 'Pescados' },
            { name: 'Frutas' },
            { name: 'Verduras' },
            { name: 'Lácteos' },
            { name: 'Cereales' },
            { name: 'Legumbres' },
            { name: 'Frutos secos' },
            { name: 'Bebidas' },
            { name: 'Conservas' },
            { name: 'Dulces' },
            { name: 'Snacks' },
            { name: 'Congelados' },
            { name: 'Otros' },
        ])

        const products = await Product.createMany([
            {
                name: 'Pimienta',
                category_id: especias.id,
                description: 'Pimienta negra en grano',
                stock: 100,
            },
            {
                name: 'Aceite de oliva',
                category_id: especias.id,
                description: 'Aceite de oliva virgen extra',
                stock: 50,
            },
            {
                name: 'Solomillo de cerdo',
                category_id: especias.id,
                description: 'Solomillo de cerdo ibérico',
                stock: 20,
            },
            {
                name: 'Salmón',
                category_id: especias.id,
                description: 'Salmón fresco',
                stock: 30,
            },
            {
                name: 'Manzanas',
                category_id: especias.id,
                description: 'Manzanas rojas',
                stock: 40,
            },
            {
                name: 'Lechuga',
                category_id: especias.id,
                description: 'Lechuga iceberg',
                stock: 10,
            },
            {
                name: 'Leche',
                category_id: especias.id,
                description: 'Leche entera',
                stock: 60,
            },
            {
                name: 'Arroz',
                category_id: especias.id,
                description: 'Arroz basmati',
                stock: 80,
            },
            {
                name: 'Lentejas',
                category_id: especias.id,
                description: 'Lentejas pardinas',
                stock: 70,
            },
            {
                name: 'Almendras',
                category_id: especias.id,
                description: 'Almendras crudas',
                stock: 90,
            },
            {
                name: 'Vino tinto',
                category_id: especias.id,
                description: 'Vino tinto crianza',
                stock: 120,
            },
            {
                name: 'Tomate frito',
                category_id: especias.id,
                description: 'Tomate frito casero',
                stock: 110,
            },
            {
                name: 'Galletas',
                category_id: especias.id,
                description: 'Galletas de chocolate',
                stock: 140,
            },
        ])

        for (let product of products) {
            let packaging_detail = await PackagingDetail.create({
                packaging_type_id: caja.id,
                unit_id: kg.id,
                unit_quantity: getRandomNumberInRange({
                    min: 1,
                    max: 10,
                    isDecimal: false,
                }),
            })

            let qp = getRandomNumberInRange({
                min: 1,
                max: 10,
                isDecimal: false,
            })

            let wp = getRandomNumberInRange({
                min: 0,
                max: 1,
                isDecimal: true,
            })

            let qw = parseFloat(
                (packaging_detail.unit_quantity / wp).toFixed(1),
            )

            let pat = parseFloat((qw * qp).toFixed(1))

            let prt = parseFloat(
                (qp * packaging_detail.unit_quantity).toFixed(1),
            )

            await Entry.create({
                product_id: product.id,
                packaging_detail_id: packaging_detail.id,
                user_id: 1,
                unit_package_id: kg.id,
                quantity_packages: qp,
                weight_packages: wp,
                quantity_weight: qw,
                packages_total: pat,
                product_total: prt,
            })
        }
    }
}
