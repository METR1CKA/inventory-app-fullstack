import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserValidator {
    constructor(protected ctx: HttpContextContract) {}

    public schema = schema.create({
        email: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(150),
            rules.email(),
        ]),
        username: schema.string({ trim: true }, [
            rules.required(),
            rules.maxLength(100),
        ]),
    })

    public messages: CustomMessages = {
        required: `El campo '{{ field }}' es requerido`,
        maxLength: `El campo '{{ field }}' debe de contener como maximo {{ options.maxLength }} caracteres`,
        email: `El campo '{{ field }}' debe ser un correo válido`,
        unique: `Email ya registrado`,
        '*': (field, rule) => `El campo '${field}' debe ser de tipo '${rule}'`,
    }
}
