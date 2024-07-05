import { VK } from 'vk-io'
import { commands } from './configs/commands.js';
// @ts-ignore
import cron from 'node-cron'
import { updateActive } from './utils/index.js';
import dotenv from 'dotenv'
import AppDataSource from './configs/database.js';

dotenv.config()

console.clear()
console.log(`Бот запущен. Время на сервере: ${new Date(Date.now())}`)

export const userInstance = new VK({ 
    token: process.env.USER_TOKEN || 'no token'
})


export const groupInstance = new VK({
    token: process.env.GROUP_TOKEN || 'no token'
})

groupInstance.updates.on('message_new', async (context) => {
    if (!context.text) return
    const commandArray = context.text.split(' ')
    const command = commandArray[0]
    if (!command.startsWith('/')) return
    const args = commandArray.slice(1, commandArray.length)

    if (!commands[command]) return await context.send('нет такой команды')

    commands[command](context, args)
});

userInstance.updates.on('chat_kick_user', async (context) => {
    console.log(context)
})

cron.schedule('0 0 23 * * *', async () => {
    await updateActive()
    console.log(`Активность обновлена ${Date()}`)
})


userInstance.updates.start().catch(console.error)
groupInstance.updates.start().catch(console.error)


AppDataSource.initialize()
    .then(() => {
        console.log('qq')
    })
    .catch(error => console.log(error)) 