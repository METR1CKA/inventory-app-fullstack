import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Toast {
    public async handle(
        { session }: HttpContextContract,
        next: () => Promise<void>,
    ) {
        // code for middleware goes here. ABOVE THE NEXT CALL

        const keys_array = ['success-toast', 'error-toast']

        for (const key of keys_array) {
            if (session.has(key)) {
                session.forget(key)
            }
        }

        await next()
    }
}
