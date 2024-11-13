import Env from '@ioc:Adonis/Core/Env'

export function ValidatorException(error: any) {
    if (!error || !error.messages) return

    const { messages } = error

    const errors: { [key: string]: string } = {}

    for (const field in messages) {
        if (messages[field].length > 0) errors[field] = messages[field][0]
    }

    if (Env.get('NODE_ENV') === 'development') {
        console.error('Errors: ', errors)
    }

    return errors
}
