import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

type ValidatorException = {
    messages: { [key: string]: string }
}

type ValidatorError = {
    [key: string]: string
}

export function ValidatorException({
    catchError,
    session,
}: {
    catchError: ValidatorException
    session: HttpContextContract['session']
}): void {
    const { messages } = catchError

    const errors: ValidatorError = {}

    for (const field in messages) {
        const message = messages[field]

        if (message.length > 0) {
            const [err] = message

            errors[`error-${field}`] = err
        }
    }

    if (Env.get('NODE_ENV') === 'development') {
        console.error('Errors: ', errors)
    }

    for (let keyError in errors) {
        session.flash(keyError, errors[keyError])
    }
}
