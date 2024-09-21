import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'entries'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id').primary()
            table
                .integer('product_id')
                .unsigned()
                .references('id')
                .inTable('products')
                .onDelete('CASCADE')
            table
                .integer('packaging_detail_id')
                .unsigned()
                .references('id')
                .inTable('packaging_details')
                .onDelete('CASCADE')
            table
                .integer('user_id')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')
            table
                .integer('unit_package_id')
                .unsigned()
                .references('id')
                .inTable('units')
                .onDelete('CASCADE')
            table.float('quantity_packages').notNullable()
            table.float('weight_packages').notNullable()
            table.float('quantity_weight').notNullable()
            table.float('packages_total').notNullable()
            table.float('product_total').notNullable()
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
