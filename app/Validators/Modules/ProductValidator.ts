import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        category_id: schema.number([
            rules.required(),
            rules.exists({ table: 'categories', column: 'id' }),
        ]),
        name: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(200),
        ]),
        stock: schema.number([rules.required(), rules.unsigned()]),
        description: schema.string.nullableAndOptional({ trim: true }),
        sku: schema.string.nullableAndOptional({ trim: true }, [
            rules.maxLength(50),
        ]),
    })

    public messages: CustomMessages = {
        required: `El campo '{{ field }}' es requerido`,
        maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
        exists: `El campo '{{ field }}' no existe en la base de datos`,
        unsigned: `El campo '{{ field }}' debe ser un número positivo`,
        '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
    }
}
