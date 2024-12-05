import { createLogger, format, transports, config } from 'winston'
// import DailyRotateFile from 'winston-daily-rotate-file'
import Application from '@ioc:Adonis/Core/Application'
import FormatDates from 'App/Services/FormatDates'
import Log from 'App/Models/Log'

export const logger = createLogger({
    levels: config.syslog.levels,
    format: format.combine(
        format.timestamp(),
        format.json(),
        format.prettyPrint(),
        format.printf(({ level, message, timestamp, ...meta }) => {
            const datetime = FormatDates.convertISOToDateTime({
                date: timestamp as string,
            })

            const metaString = meta ? JSON.stringify(meta, null, 2) : ''

            return `[ ${datetime} ] - { ${level?.toUpperCase()} }: ${message} = ${metaString}\n`
        }),
    ),
    transports: [
        new transports.File({
            dirname: Application.tmpPath('logs'),
            filename: Application.tmpPath('logs/app.log'),
        }),
        // new DailyRotateFile({
        //     filename: 'tmp/logs/app-%DATE%.log',
        //     maxFiles: 1,
        //     datePattern: FormatDates.getFullFormat(),
        //     level: 'error',
        // }),
    ],
})

logger.on('data', async ({ level, message, label, timestamp, ...meta }) => {
    await Log.create({
        level: level?.toUpperCase() ?? '-',
        message: message ?? '-',
        meta,
    })
})

export default logger
