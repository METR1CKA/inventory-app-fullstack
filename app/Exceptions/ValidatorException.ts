import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'
import Env from '@ioc:Adonis/Core/Env'

type ValidatorException = {
    messages: { [key: string]: string }
}

export function ValidatorException({
    catchError,
    session,
}: {
    catchError: ValidatorException
    session: HttpContextContract['session']
}): void {
    const { messages } = catchError

    for (const field in messages) {
        const message = messages[field]

        if (message.length > 0) {
            const [err] = message

            session.flash(`error-${field}`, err)

            if (Env.get('NODE_ENV') === 'development') {
                console.error('Error validation:', err)
            }
        }
    }

    session.put('error-toast', 'Campos requeridos no completados')
}

export async function DatabaseException({
    catchError,
    session,
    trx,
}: {
    catchError: any
    session: HttpContextContract['session']
    trx: TransactionClientContract
}): Promise<void> {
    console.error(catchError)

    await trx.rollback()

    session.put('error-toast', 'Error en la base de datos')
}
