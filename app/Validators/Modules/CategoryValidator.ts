import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        name: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(200),
        ]),
        description: schema.string.nullableAndOptional({ trim: true }),
    })

    public messages: CustomMessages = {
        required: `El campo '{{ field }}' es requerido`,
        maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
        '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
    }
}
