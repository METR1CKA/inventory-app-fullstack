/**
 * Config source: https://git.io/JesV9
 *
 * Feel free to let us know via PR, if you find something broken in this config
 * file.
 */

import Env from '@ioc:Adonis/Core/Env'
import type { DatabaseConfig } from '@ioc:Adonis/Lucid/Database'
import fs from 'fs'

const cert = Env.get('DB_CERT')

let connection: any = {
  host: Env.get('PG_HOST'),
  port: Env.get('PG_PORT'),
  user: Env.get('PG_USER'),
  password: Env.get('PG_PASSWORD', ''),
  database: Env.get('PG_DB_NAME'),
}

if (cert) {
  connection.ssl = {
    rejectUnauthorized: Env.get('NODE_ENV') == 'production' ? true : false,
    ca: fs.readFileSync(cert),
  }
}

const databaseConfig: DatabaseConfig = {
  /*
  |--------------------------------------------------------------------------
  | Connection
  |--------------------------------------------------------------------------
  |
  | The primary connection for making database queries across the application
  | You can use any key from the `connections` object defined in this same
  | file.
  |
  */
  connection: Env.get('DB_CONNECTION'),

  connections: {
    /*
    |--------------------------------------------------------------------------
    | MySQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for MySQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i mysql2
    |
    */
    mysql: {
      client: 'mysql2',
      connection: {
        host: Env.get('MYSQL_HOST'),
        port: Env.get('MYSQL_PORT'),
        user: Env.get('MYSQL_USER'),
        password: Env.get('MYSQL_PASSWORD', ''),
        database: Env.get('MYSQL_DB_NAME'),
      },
      migrations: {
        naturalSort: true,
      },
      healthCheck: false,
      debug: false,
    },

    /*
    |--------------------------------------------------------------------------
    | PostgreSQL config
    |--------------------------------------------------------------------------
    |
    | Configuration for PostgreSQL database. Make sure to install the driver
    | from npm when using this connection
    |
    | npm i pg
    |
    */
    pg: {
      client: 'pg',
      connection,
      migrations: {
        naturalSort: true,
        paths: [
          // Without Foreign Relation
          './database/migrations/Administrative/NoForeign',
          './database/migrations/Operative/NoForeign',
          // With Foreign Relation
          './database/migrations/Administrative/Foreign',
          './database/migrations/Operative/Foreign',
        ],
      },
      seeders: {
        paths: [
          './database/seeders/Administrative',
          './database/seeders/Operative',
        ],
      },
      healthCheck: true,
      debug: Env.get('DB_DEBUG', false),
    },
    alters: {
      client: 'pg',
      connection,
      migrations: {
        naturalSort: true,
        paths: [
          // Aleter tables
          './database/migrations/Alters',
        ],
      },
      healthCheck: true,
      debug: Env.get('DB_DEBUG', false),
    },
  },
}

export default databaseConfig
