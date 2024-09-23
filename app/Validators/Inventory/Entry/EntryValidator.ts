import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EntryValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        // Packaging details
        unit_quantity: schema.number([rules.required(), rules.unsigned()]),
        packaging_type_id: schema.number([
            rules.required(),
            rules.exists({ table: 'packaging_types', column: 'id' }),
        ]),
        unit_id: schema.number([
            rules.required(),
            rules.exists({ table: 'units', column: 'id' }),
        ]),

        // Foreing keys
        unit_package_id: schema.number([
            rules.required(),
            rules.exists({ table: 'units', column: 'id' }),
        ]),
        product_id: schema.number([
            rules.required(),
            rules.exists({ table: 'products', column: 'id' }),
        ]),

        // Entry details
        quantity_packages: schema.number([rules.required(), rules.unsigned()]),
        weight_packages: schema.number([rules.required(), rules.unsigned()]),
    })

    public messages: CustomMessages = {
        required: `El campo '{{ field }}' es requerido`,
        maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
        exists: `El campo '{{ field }}' no existe en la base de datos`,
        unsigned: `El campo '{{ field }}' debe ser un número positivo`,
        '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
    }
}
