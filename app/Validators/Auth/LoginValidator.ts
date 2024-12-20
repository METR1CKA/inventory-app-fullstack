import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        email: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(80),
            rules.email(),
        ]),
        password: schema.string({ trim: true }, [
            rules.required(),
            rules.minLength(8),
            rules.maxLength(15),
        ]),
    })

    public messages: CustomMessages = {
        required: `El campo '{{ field }}' es requerido`,
        email: `El formato del campo '{{ field }}' no es valido`,
        maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
        minLength: `El campo '{{ field }}' debe de contener como minimo {{ options.minLength }} caracteres`,
        '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
    }
}
