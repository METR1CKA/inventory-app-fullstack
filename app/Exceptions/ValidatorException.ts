import Env from '@ioc:Adonis/Core/Env'

type ValidatorException = {
    messages: { [key: string]: string }
}

type ValidatorError = {
    [key: string]: string
}

export function ValidatorException(error: ValidatorException): {
    errors: ValidatorError
} {
    const { messages } = error

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

    return {
        errors,
    }
}
