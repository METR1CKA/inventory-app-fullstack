import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'packaging_details'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table
                .integer('packaging_type_id')
                .unsigned()
                .references('id')
                .inTable('packaging_types')
                .onDelete('CASCADE')
            table
                .integer('unit_id')
                .unsigned()
                .references('id')
                .inTable('units')
                .onDelete('CASCADE')
            table.integer('unit_quantity')
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
