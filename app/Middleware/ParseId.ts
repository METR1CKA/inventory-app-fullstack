import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ParseId {
    public async handle(
        { params, session, response }: HttpContextContract,
        next: () => Promise<void>,
    ) {
        // code for middleware goes here. ABOVE THE NEXT CALL
        if ('id' in params) {
            const id = parseInt(params.id)

            if (isNaN(id)) {
                session.flash(
                    'error-toast',
                    'Parametro id no válido, debe ser un número',
                )

                return response.redirect().back()
            }

            params.id = id
        }

        await next()
    }
}
