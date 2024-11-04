import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ToastsController {
    public async forgetToast({
        params,
        session,
        response,
    }: HttpContextContract) {
        if (params.key && session.has(params.key)) {
            session.forget(params.key)
        }

        return response.noContent()
    }
}
