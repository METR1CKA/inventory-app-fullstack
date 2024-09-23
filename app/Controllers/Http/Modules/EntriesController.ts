import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PackagingType from 'App/Models/PackagingType'
import FormatDates from 'App/Services/FormatDates'
import Product from 'App/Models/Product'
import Entry from 'App/Models/Entry'
import Unit from 'App/Models/Unit'
import EntryValidator from 'App/Validators/Inventory/Entry/EntryValidator'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import PackagingDetail from 'App/Models/PackagingDetail'
import Database from '@ioc:Adonis/Lucid/Database'

export default class EntriesController {
    private entries = Entry.query()
        .preload('packaging_detail')
        .preload('product')
        .preload('unit_package')
        .preload('user')
        .orderBy('id', 'desc')

    public async index({ view }: HttpContextContract) {
        const entries = await this.entries

        const units = await Unit.all()

        const products = await Product.query().where({ active: true })

        const packaging_types = await PackagingType.all()

        return await view.render('inventory/entry', {
            entries,
            units,
            products,
            packaging_types,
            unit_packages: units,
            format: FormatDates.serializeDates().serialize,
        })
    }

    public async store({
        auth,
        session,
        request,
        response,
    }: HttpContextContract) {
        const { user } = auth.use('web')

        try {
            await request.validate(EntryValidator)
        } catch (error) {
            const { code, json } = ValidatorException(error)
            return response.status(code).json(json)
        }

        const {
            unit_package_id,
            packaging_type_id,
            unit_id,
            unit_quantity,
            product_id,
            quantity_packages,
            weight_packages,
        } = request.only([
            // Packaging details
            'unit_quantity',
            'packaging_type_id',
            'unit_id',
            // Foreing keys
            'unit_package_id',
            'product_id',
            // Entry details
            'quantity_packages',
            'weight_packages',
        ])

        const trx = await Database.transaction()

        try {
            const packaging_detail = await PackagingDetail.create(
                {
                    unit_quantity,
                    packaging_type_id,
                    unit_id,
                },
                trx,
            )

            const quantity_weight = parseFloat(
                (unit_quantity / weight_packages).toFixed(1),
            )

            const packages_total = parseFloat(
                (quantity_weight * quantity_packages).toFixed(1),
            )

            const product_total = parseFloat(
                (quantity_packages * unit_quantity).toFixed(1),
            )

            await Entry.create({
                unit_package_id,
                product_id,
                user_id: user?.id,
                packaging_detail_id: packaging_detail.id,
                quantity_packages,
                weight_packages,
                quantity_weight,
                packages_total,
                product_total,
            })
        } catch (error) {
            console.error(error)

            await trx.rollback()

            return response.internalServerError({
                status: 'Error',
                message: 'Error al crear la entrada',
                data: null,
            })
        }

        session.flash('success-toast', 'Producto creado')

        return response.created({
            status: 'Success',
            message: 'Entrada creada',
            data: null,
        })
    }

    public async update({}: HttpContextContract) {}
}
