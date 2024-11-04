import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        name: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(200),
        ]),
        description: schema.string.nullableAndOptional({ trim: true }),
        category_id: schema.number([
            rules.required(),
            rules.exists({ table: 'categories', column: 'id' }),
        ]),
        stock: schema.number([rules.required(), rules.unsigned()]),
    })

    public messages: CustomMessages = {
        required: `El campo '{{ field }}' es requerido`,
        maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
        exists: `El campo '{{ field }}' no existe en la base de datos`,
        unsigned: `El campo '{{ field }}' debe ser un número positivo`,
        '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
    }
}
