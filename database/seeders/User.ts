import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { UserFactory } from 'Database/factories'
import Env from '@ioc:Adonis/Core/Env'
import User from 'App/Models/User'

export default class extends BaseSeeder {
    public async run() {
        // Write your database queries inside the run method
        await User.create({
            email: Env.get('EMAIL', 'user@example.com'),
            password: Env.get('PASSWORD', 'user.pass.123'),
            username: Env.get('USERNAME', 'user'),
            active: true,
        })

        await UserFactory.createMany(49)
    }
}
