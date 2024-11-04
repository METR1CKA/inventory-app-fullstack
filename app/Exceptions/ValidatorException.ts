import Env from '@ioc:Adonis/Core/Env'

export function ValidatorException(error: any) {
    const { messages } = error

    let errors: any[] = []

    for (let _error in messages) {
        errors.push(...messages[_error])
    }

    errors = [...new Set(errors)]

    if (Env.get('NODE_ENV') == 'development') {
        console.error('Errors: ', errors)
    }

    return errors
}
