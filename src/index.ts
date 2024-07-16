import { CommentContext, ContextDefaultState, Keyboard, MessageContext, VK } from 'vk-io'
// @ts-ignore
import cron from 'node-cron'
import dotenv from 'dotenv'
import { executeMiddlewares } from './utils/executeMiddleware'
import AppDataSource from './configs/database'
import { imap } from './configs/mail'
import { findClosestAdmin, processNewMail } from './utils/mail'

dotenv.config()

console.clear()
console.log(`Бот запущен. Время на сервере: ${new Date(Date.now())}`)


export const userInstance = new VK({
    token: process.env.USER_TOKEN || 'no token'
})

export const groupInstance = new VK({
    token: process.env.GROUP_TOKEN || 'no token'
})

groupInstance.updates.on('message_new', executeMiddlewares)

// userInstance.updates.on('chat_kick_user', async (context) => {
//     console.log(context)
// })

userInstance.updates.start().catch(console.error)
groupInstance.updates.start().catch(console.error)




AppDataSource.initialize()
    .then(() => {
        console.log('connection is good')
    })
    .catch(error => console.log(error))


imap.once('ready', async function () {
    imap.openBox('ARIZONA', false, async (err,box) => {
        if (err) throw err;
        console.log('ARIZONA folder opened');
        processNewMail()
    })
});

imap.connect()



