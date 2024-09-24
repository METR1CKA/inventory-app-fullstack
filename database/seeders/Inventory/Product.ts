import {
    getRandomNumberInRange,
    getNumberWithZero,
} from 'App/Services/Functions'
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

        const [
            bebidas,
            alimentos,
            lacteos,
            snacks,
            conservas,
            limpieza,
            cuidad_personal,
            hogar,
        ] = await Category.createMany([
            { name: 'Bebidas' },
            { name: 'Alimentos' },
            { name: 'Lácteos' },
            { name: 'Snacks' },
            { name: 'Conservas' },
            { name: 'Limpieza' },
            { name: 'Cuidado personal' },
            { name: 'Hogar' },
        ])

        const [, especias] = await Category.createMany([
            { name: 'Refrescos', main_category_id: bebidas.id },
            { name: 'Especias', main_category_id: alimentos.id },
            { name: 'Yogur', main_category_id: lacteos.id },
            { name: 'Galletas', main_category_id: snacks.id },
            { name: 'Atún', main_category_id: conservas.id },
            { name: 'Detergente', main_category_id: limpieza.id },
            { name: 'Shampoo', main_category_id: cuidad_personal.id },
            { name: 'Platos', main_category_id: hogar.id },
        ])

        const category_code = getNumberWithZero({ number: especias.id })
        const subcategory_code = getNumberWithZero({ number: alimentos.id })
        const random = getRandomNumberInRange({
            min: 1,
            max: 100,
            isDecimal: false,
        })
        const random_code = getNumberWithZero({ number: random })

        const products = await Product.createMany([
            {
                name: 'Pimienta',
                category_id: especias.id,
                description: 'Pimienta negra en grano',
                stock: 100,
                sku: `${category_code}${subcategory_code}01${random_code}`,
            },
            {
                name: 'Canela',
                category_id: especias.id,
                description: 'Aceite de oliva virgen extra',
                stock: 50,
                sku: `${category_code}${subcategory_code}02${random_code}`,
            },
            {
                name: 'Oregano',
                category_id: especias.id,
                description: 'Oregano seco',
                stock: 20,
                sku: `${category_code}${subcategory_code}03${random_code}`,
            },
            {
                name: 'Tomillo',
                category_id: especias.id,
                description: 'Tomillo seco',
                stock: 30,
                sku: `${category_code}${subcategory_code}04${random_code}`,
            },
            {
                name: 'Clavo',
                category_id: especias.id,
                description: 'Clavo en polvo',
                stock: 40,
                sku: `${category_code}${subcategory_code}05${random_code}`,
            },
            {
                name: 'Cassia',
                category_id: especias.id,
                description: 'Cassia en polvo',
                stock: 10,
                sku: `${category_code}${subcategory_code}06${random_code}`,
            },
            {
                name: 'Comino',
                category_id: especias.id,
                description: 'Comino en polvo',
                stock: 60,
                sku: `${category_code}${subcategory_code}07${random_code}`,
            },
            {
                name: 'Sal',
                category_id: especias.id,
                description: 'Sal marina',
                stock: 80,
                sku: `${category_code}${subcategory_code}08${random_code}`,
            },
            {
                name: 'Curcuma',
                category_id: especias.id,
                description: 'Curcuma en polvo',
                stock: 70,
                sku: `${category_code}${subcategory_code}09${random_code}`,
            },
            {
                name: 'Curry',
                category_id: especias.id,
                description: 'Curry en polvo',
                stock: 90,
                sku: `${category_code}${subcategory_code}10${random_code}`,
            },
            {
                name: 'Eneldo',
                category_id: especias.id,
                description: 'Eneldo semillas',
                stock: 120,
                sku: `${category_code}${subcategory_code}11${random_code}`,
            },
            {
                name: 'Laurel',
                category_id: especias.id,
                description: 'Hoja de laurel',
                stock: 110,
                sku: `${category_code}${subcategory_code}12${random_code}`,
            },
            {
                name: 'Nuez',
                category_id: especias.id,
                description: 'Nuez moscada',
                stock: 140,
                sku: `${category_code}${subcategory_code}13${random_code}`,
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
