// import { getDataFromCsv, getRandomNumberInRange } from 'App/Services/Functions'
// import PackagingDetail from 'App/Models/PackagingDetail'
// import PackagingType from 'App/Models/PackagingType'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
// import Category from 'App/Models/Category'
// import Product from 'App/Models/Product'
// import Entry from 'App/Models/Entry'
// import Unit from 'App/Models/Unit'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        // const entries = getDataFromCsv(
        //     {
        //         folder: 'csv',
        //         filename: 'INVENTARIO_CHARLY.csv',
        //         separator: ',',
        //     },
        //     (data, toStr, toNum) => {
        //         return data.map(
        //             ([
        //                 category_name,
        //                 product_name,
        //                 packaging_type,
        //                 unit_quantity,
        //                 unit_name,
        //                 quantity_packages,
        //                 weight_packages,
        //                 unit_package,
        //                 quantity_weight,
        //                 packages_total,
        //                 product_total,
        //             ]) => ({
        //                 category_name: toStr(category_name),
        //                 product_name: toStr(product_name),
        //                 packaging_type: toStr(packaging_type),
        //                 unit_quantity: toNum(unit_quantity),
        //                 unit_name: toStr(unit_name),
        //                 quantity_packages: toNum(quantity_packages),
        //                 weight_packages: toNum(weight_packages),
        //                 unit_package: toStr(unit_package),
        //                 quantity_weight: toNum(quantity_weight),
        //                 packages_total: toNum(packages_total),
        //                 product_total: toNum(product_total),
        //             }),
        //         )
        //     },
        // )
        // for (let {
        //     category_name,
        //     product_name,
        //     packaging_type,
        //     unit_quantity,
        //     unit_name,
        //     quantity_packages,
        //     weight_packages,
        //     unit_package,
        //     quantity_weight,
        //     packages_total,
        //     product_total,
        // } of entries) {
        //     const category = await Category.firstOrCreate({
        //         name: category_name,
        //     })
        //     const packagingType = await PackagingType.firstOrCreate({
        //         name: packaging_type,
        //     })
        //     const unit = await Unit.firstOrCreate({
        //         name: unit_name,
        //     })
        //     const product = await Product.firstOrCreate({
        //         name: product_name,
        //         category_id: category.id,
        //         description: 'N/A',
        //         stock: getRandomNumberInRange({
        //             min: 10,
        //             max: 500,
        //             isDecimal: false,
        //         }),
        //     })
        //     const packagingDetail = await PackagingDetail.create({
        //         packaging_type_id: packagingType.id,
        //         unit_id: unit.id,
        //         unit_quantity,
        //     })
        //     await Entry.create({})
        // }
        // console.log(entries)
    }
}
