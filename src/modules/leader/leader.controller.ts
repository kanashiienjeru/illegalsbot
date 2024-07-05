import { organizationTags } from "../../configs/chats.js"
import { UserHandlerFunction } from "../../models/index.js"
import { checkLink, errorHandler, tagByOrg } from "../../utils/index.js"
import userService from "../user/user.service.js"
import leaderService from "./leader.service.js"

class LeaderController {
  setZam: UserHandlerFunction = async (context, args) => {
    const isLeader = await userService.checkLeader(context.senderId)
    if (!isLeader) return await context.send('❌ Вы не являетесь лидером')
    if (args.length < 1) return await context.send('❌ Неверно указаны аргументы ( /setzam link )')
    const link = args[0]

    const USER_INPUT = checkLink(link)

    if (!USER_INPUT) return await context.send('❌ Неверно указана ссылка на пользователя ( https://vk.com/ )')

    try {
      const result = await userService.invite(USER_INPUT, organizationTags[tagByOrg(isLeader.name)])
      await leaderService.setZam(USER_INPUT, isLeader)
      let message = 'Статусы приглашений в чаты: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      await context.send(message)
      return await context.send('✅ Пользователь был назначен на пост заместителя')

    } catch (error) {
      return error ? await context.send('❌ ' + error) : await context.send('❌ Произошла ошибка при назначении заместителя')
    }

  }

  delZam: UserHandlerFunction = async (context, args) => {
    const isLeader = await userService.checkLeader(context.senderId)
    if (!isLeader) return await context.send('❌ Вы не являетесь лидером')
    if (args.length < 1) return await context.send('❌ Неверно указаны аргументы ( /setzam link )')
    const link = args[0]

    const USER_INPUT = checkLink(link)

    if (!USER_INPUT) return await context.send('❌ Неверно указана ссылка на пользователя ( https://vk.com/ )')

    try {
      const result = await userService.kick(USER_INPUT, organizationTags[tagByOrg(isLeader.name)])
      await leaderService.delZam(USER_INPUT, isLeader)
      let message = 'Статусы исключений из чатов: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      await context.send(message)
      return await context.send('✅ Пользователь был снят с поста заместителя')
    } catch (error) {
      return error ? await context.send('❌ ' + error) : await context.send('❌ Произошла ошибка при снятии заместителя')
    }

  }

  myZams: UserHandlerFunction = async (context, args) => {
    const isLeader = await userService.checkLeader(context.senderId)
    if (!isLeader) return await context.send('❌ Вы не являетесь лидером')

    try {
      const [users, count] = await leaderService.myZams(isLeader)

      let message = ''

      users.forEach(deputy => message += `ツ @id${deputy.vk} (${deputy.name}) \n`)
      message += `Всего заместителей: ${count}`
      return await context.send(message)
    } catch (error) {
      return error ? await context.send('❌ ' + error) : await context.send('❌ Произошла ошибка при получении списка заместителей')
    }
  }
}

export default new LeaderController