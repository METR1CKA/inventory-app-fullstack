import { ProductFactory, CategoryFactory } from 'Database/factories'
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'

export default class extends BaseSeeder {
    public async run() {
        const categories = await CategoryFactory.createMany(10)

        for (let category of categories) {
            await ProductFactory.merge({
                category_id: category.id,
            }).createMany(10)
        }
    }
}
