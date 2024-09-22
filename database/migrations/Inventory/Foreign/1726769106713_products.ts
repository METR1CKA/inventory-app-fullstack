import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'products'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table
                .integer('category_id')
                .unsigned()
                .references('id')
                .inTable('categories')
                .onDelete('CASCADE')
            table.string('name', 200).notNullable()
            table.text('description', 'longtext').nullable()
            table.integer('stock').notNullable()
            table.boolean('active').defaultTo(true).notNullable()
            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
