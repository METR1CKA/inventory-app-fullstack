import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Guest {
    public async handle(
        { auth, response }: HttpContextContract,
        next: () => Promise<void>,
    ) {
        // code for middleware goes here. ABOVE THE NEXT CALL
        const auth_web = auth.use('web')

        await auth_web.check()

        if (!auth_web.isGuest) {
            return response.redirect('/')
        }

        await next()
    }
}
