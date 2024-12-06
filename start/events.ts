/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/
import Database from '@ioc:Adonis/Lucid/Database'
import Logger from '@ioc:Adonis/Core/Logger'
import Event from '@ioc:Adonis/Core/Event'
import Env from '@ioc:Adonis/Core/Env'

if (Env.get('DB_DEBUG')) {
    Event.on('db:query', Database.prettyPrint)
}

Event.onError((event, error, data) => {
    Logger.fatal('Event failed: %s', event)
    Logger.error(error)
    Logger.error(data)
})
