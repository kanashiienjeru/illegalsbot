import { organizationTags } from "../../configs/chats"
import { User } from "../../entities/user.entity"
import { UserHandlerFunction } from "../../models/index"
import { checkLink, errorHandler, tagByOrg } from "../../utils/index"
import userService from "../user/user.service"
import leaderService from "./leader.service"

class LeaderController {
  setZam: UserHandlerFunction = async (context) => {
    try {
      if (context.arguments.length < 1) throw Error('Неверно указаны аргументы ( /setzam link )')
      const [link] = context.arguments
      const user = context.user as User

      const USER_INPUT = checkLink(link)
      if (!USER_INPUT) throw Error('Неверно указана ссылка на пользователя ( https://vk.com/ )')

      const result = await userService.invite(USER_INPUT, organizationTags[tagByOrg(user.gang.name)])
      await leaderService.setZam(USER_INPUT, context.user.gang)

      let message = 'Статусы приглашений в чаты: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      await context.send(message)

      return await context.send('✅ Пользователь был назначен на пост заместителя')

    } catch (error: any) {
      return error ? await context.send('❌ ' + error.message) : await context.send('❌ Произошла ошибка при назначении заместителя')
    }

  }

  delZam: UserHandlerFunction = async (context) => {
    try {

    if (context.arguments.length < 1) throw Error('Неверно указаны аргументы ( /setzam link )')
    const [link] = context.arguments

    const user = context.user as User

    const USER_INPUT = checkLink(link)
    if (!USER_INPUT) throw Error('Неверно указана ссылка на пользователя ( https://vk.com/ )')

      await leaderService.delZam(USER_INPUT, user.gang)
      const result = await userService.kick(USER_INPUT, organizationTags[tagByOrg(user.gang.name)])

      let message = 'Статусы исключений из чатов: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      await context.send(message)

      return await context.send('✅ Пользователь был снят с поста заместителя')
    } catch (error: any) {
      return error ? await context.send('❌ ' + error.message) : await context.send('❌ Произошла ошибка при снятии заместителя')
    }

  }

  zams: UserHandlerFunction = async (context) => {
    try {
      const user = context.user as User

      if (user.gang) {
        const [users, count] = await leaderService.zams(user.gang)

        let message = `✌ Список заместителей организации ${user.gang.name} ✌ \n`
        users.forEach(deputy => message += `ツ @id${deputy.vk} (${deputy.name}) \n`)
        message += `Всего заместителей: ${count}`

        return await context.send(message)

      }

      if (context.arguments[0] && user.level >= 3) {
        const [users, count] = await leaderService.zams(context.arguments[0])

        let message = `✌ Список заместителей организации ${context.arguments[0]} ✌ \n`
        users.forEach(deputy => message += `ツ @id${deputy.vk} (${deputy.name}) \n`)
        message += `Всего заместителей: ${count}`
        return await context.send(message)
      }

    } catch (error: any) {
      return error ? await context.send('❌ ' + error.message) : await context.send('❌ Произошла ошибка при получении списка заместителей')
    }
  }
}

export default new LeaderController