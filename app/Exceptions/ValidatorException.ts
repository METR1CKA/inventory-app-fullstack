import Env from '@ioc:Adonis/Core/Env'

export function ValidatorException(error: any) {
    const BAD_REQUEST = 400
    const NOT_FOUND = 404
    const RULE_EXIST = 'exists'

    // Destructuring
    const {
        messages: {
            errors: [{ message, field, rule }],
        },
    } = error

    if (Env.get('NODE_ENV') == 'development') {
        console.log('Err', error.messages)
    }

    return {
        code: rule.includes(RULE_EXIST) ? NOT_FOUND : BAD_REQUEST,
        json: {
            status: 'Error',
            message,
            data: {
                field,
                rule,
            },
        },
    }
}
