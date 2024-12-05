import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'logs'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table.string('level', 100).notNullable()
            table.text('message').notNullable()
            table.json('meta').nullable()
            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table
                .timestamp('created_at', { useTz: false })
                .defaultTo(this.now())
            table
                .timestamp('updated_at', { useTz: false })
                .defaultTo(this.now())
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
