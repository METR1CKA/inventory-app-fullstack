import Factory from '@ioc:Adonis/Lucid/Factory'
import Category from 'App/Models/Category'
import Product from 'App/Models/Product'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export const UserFactory = Factory.define(User, ({ faker }) => {
    return {
        email: faker.internet.email(),
        password: Env.get('PASSWORD', 'user.pass.123'),
        username: faker.internet.userName(),
        // active: true,
    }
}).build()

export const CategoryFactory = Factory.define(Category, ({ faker }) => {
    return {
        name: faker.commerce.department(),
        description: faker.commerce.productDescription(),
        // active: true,
    }
}).build()

export const ProductFactory = Factory.define(Product, ({ faker }) => {
    return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        stock: faker.number.int({ min: 0, max: 10000 }),
        // sku: faker.string.numeric({ length: { min: 10, max: 10 } }),
        // active: true,
    }
}).build()
