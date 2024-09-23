// import { getDataFromCsv } from 'App/Services/Functions'
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
        // const usos_cfdis = fn.getDataFromCsv(
        //     {
        //         folder: 'CatalogosSAT',
        //         filename: 'UsoCfdi.csv',
        //     },
        //     (data, toStr) => {
        //         return data.map(([uso_cfdi, descripcion]: any) => {
        //             return {
        //                 uso_cfdi: toStr(uso_cfdi),
        //                 descripcion: toStr(descripcion),
        //                 active: true,
        //             }
        //         })
        //     },
        // )
        // const elements = getDataFromCsv(
        //     {
        //         folder: 'csv',
        //         filename: 'INVENTARIO_CHARLY.csv',
        //     },
        //     (data, toStr) => {
        //         return data.map(
        //             ([
        //                 categoria,
        //                 nombre,
        //                 presentacion,
        //                 cantidad,
        //                 unidad,
        //                 caja_bolsa_etc,
        //                 cantidad_en_paquete,
        //                 unidad_de_paquete,
        //                 cantidad_de_paquetes_por_caja,
        //                 cantida_de_paquetes_total,
        //                 cantidad_total_final_del_producto,
        //             ]: any) => {
        //                 return {
        //                     categoria: toStr(categoria),
        //                     nombre: toStr(nombre),
        //                     presentacion: toStr(presentacion),
        //                     cantidad: toStr(cantidad),
        //                     unidad: toStr(unidad),
        //                     caja_bolsa_etc: toStr(caja_bolsa_etc),
        //                     cantidad_en_paquete: toStr(cantidad_en_paquete),
        //                     unidad_de_paquete: toStr(unidad_de_paquete),
        //                     cantidad_de_paquetes_por_caja: toStr(
        //                         cantidad_de_paquetes_por_caja,
        //                     ),
        //                     cantida_de_paquetes_total: toStr(
        //                         cantida_de_paquetes_total,
        //                     ),
        //                     cantidad_total_final_del_producto: toStr(
        //                         cantidad_total_final_del_producto,
        //                     ),
        //                 }
        //             },
        //         )
        //     },
        // )
        // const [caja] = await PackagingType.createMany([
        //     { name: 'Caja' },
        //     { name: 'Bolsa' },
        //     { name: 'CajaH' },
        // ])
    }
}
