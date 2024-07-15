import dotenv from 'dotenv'
import { DataSource } from 'typeorm'
import { User } from '../entities/user.entity'
import { Gang } from '../entities/gang.entity'

dotenv.config()


const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USER,
    database: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    synchronize: true,
    logging: true,
    entities: [User, Gang],
    subscribers: [],
    migrations: []

})


export default AppDataSource