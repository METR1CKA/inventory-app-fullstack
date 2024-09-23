import EntryValidator from 'App/Validators/Inventory/Entry/EntryValidator'
import { ValidatorException } from 'App/Exceptions/ValidatorException'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PackagingDetail from 'App/Models/PackagingDetail'
import PackagingType from 'App/Models/PackagingType'
import FormatDates from 'App/Services/FormatDates'
import Database from '@ioc:Adonis/Lucid/Database'
import Product from 'App/Models/Product'
import Entry from 'App/Models/Entry'
import Unit from 'App/Models/Unit'

export default class EntriesController {
    private entries = Entry.query()
        .preload('packaging_detail')
        .preload('product')
        .preload('unit_package')
        .preload('user')
        .orderBy('id', 'desc')

    public async index({ session, view }: HttpContextContract) {
        const entries = await this.entries

        const units = await Unit.all()

        const products = await Product.query()
            .where({ active: true })
            .orderBy('id', 'desc')

        const packaging_types = await PackagingType.all()

        session.put(
            'success-toast',
            'Entradas de productos obtenidas con éxito',
        )

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

        session.put('success-toast', 'Entrada de producto creado')

        return response.created({
            status: 'Success',
            message: 'Entrada creada',
            data: null,
        })
    }

    public async update({
        auth,
        session,
        params,
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

        const entry = await this.entries.where({ id: params.id }).first()

        if (!entry) {
            return response.notFound({
                status: 'Error',
                message: 'Entrada no encontrada',
                data: null,
            })
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
            await PackagingDetail.query(trx)
                .where({ id: entry.packaging_detail_id })
                .update({
                    unit_quantity,
                    packaging_type_id,
                    unit_id,
                })

            const quantity_weight = parseFloat(
                (unit_quantity / weight_packages).toFixed(1),
            )

            const packages_total = parseFloat(
                (quantity_weight * quantity_packages).toFixed(1),
            )

            const product_total = parseFloat(
                (quantity_packages * unit_quantity).toFixed(1),
            )

            await Entry.query(trx).where({ id: entry.id }).update({
                unit_package_id,
                product_id,
                user_id: user?.id,
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
                message: 'Error al actualizar la entrada',
                data: null,
            })
        }

        session.put('success-toast', 'Entrada de producto actualizado')

        return response.created({
            status: 'Success',
            message: 'Entrada actualizada',
            data: null,
        })
    }
}
