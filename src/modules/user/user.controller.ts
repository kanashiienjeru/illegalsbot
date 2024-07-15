import { Keyboard } from "vk-io";
import { organizationTags, userChats } from "../../configs/chats"
import { UserHandlerFunction } from "../../models/index"
import { checkLink, errorHandler, tagByOrg } from "../../utils/index"
import userService from "./user.service"
import { commands } from "../../configs/commands";
import { User } from "../../entities/user.entity";



class UserController {
  public invite: UserHandlerFunction = async (context) => {
    try {
      if (context.arguments.length < 2) throw Error('Неверно указаны аргументы ( /invite link tag )')

      const link = context.arguments[0]
      const tag = context.arguments[1]

      const USER_INPUT = checkLink(link)

      if (!USER_INPUT) throw Error('Неверно указана ссылка на пользователя ( https://vk.com/ )')
      if (!Object.keys(organizationTags).includes(tag)) throw Error('Неверно указан тэг ( LG, LM, G, M )')

      const result = await userService.invite(USER_INPUT, organizationTags[tag])
      let message = 'Статусы приглашений в чаты: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      return await context.send(message)

    } catch (error: any) {
      return error ? await context.send('❌ ' + error.message) : await context.send('❌ Произошла ошибка при добавлении в чаты')
    }
  }

  public kick: UserHandlerFunction = async (context) => {
    try {
      if (context.arguments.length < 2) throw Error('Неверно указаны аргументы ( /kick link tag )')

      const [link, tag] = context.arguments

      const USER_INPUT = checkLink(link)

      if (!USER_INPUT) throw Error('Неверно указана ссылка на пользователя ( https://vk.com/ )')
      if (!Object.keys(organizationTags).includes(tag)) throw Error('Неверно указан тэг ( LG, LM, G, M )')

      const result = await userService.kick(USER_INPUT, organizationTags[tag])
      let message = 'Статусы исключений из чатов: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      return await context.send(message)

    } catch (error: any) {
      return error ? await context.send('❌ ' + error.message) : await context.send('❌ Произошла ошибка при кика из чатов')
    }
  }

  public access: UserHandlerFunction = async (context) => {
    try {
      if (context.arguments.length < 2) throw Error('Неверно указаны аргументы ( /access link level )');
      const [link, level] = context.arguments

      const USER_INPUT = checkLink(link);
      if (!USER_INPUT) throw Error('Неверно указана ссылка на пользователя ( https://vk.com/ )')

      if (+level >= context.user.level || +level < 0) throw Error('Уровень доступа не может превышать ваш или быть ниже 0');

      await userService.access(context, USER_INPUT, +level)

    } catch (error: any) {
      return error ? await context.send('❌ ' + error.message) : await context.send('❌ Произошла ошибка при кика из чатов')
    }

  }

  public setLeader: UserHandlerFunction = async (context) => {
    try {
      if (context.arguments.length < 2) throw Error('Неверно указаны аргументы ( /setleader link gang )')
      const [link, gang] = context.arguments

      const USER_INPUT = checkLink(link)
      if (!USER_INPUT) throw Error('Неверно указана ссылка на пользователя ( https://vk.com/ )')

      const result = await userService.invite(USER_INPUT, organizationTags['L' + tagByOrg(gang)])
      await userService.setLeader(USER_INPUT, gang)

      let message = 'Статусы приглашений в чаты: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      await context.send(message)

      return await context.send('✅ Пользователь был успешно назначен на пост лидера')

    } catch (error:any) {
      return error ? await context.send('❌ ' + error.message) : await context.send('❌ Произошла ошибка при назначении лидера')
    }
  }

  public removeLeader: UserHandlerFunction = async (context) => {
    try {
      if (context.arguments.length < 1) throw Error('Неверно указаны аргументы ( /removeleader link )')
      const [link] = context.arguments

      const USER_INPUT = checkLink(link)
      if (!USER_INPUT) throw Error('Неверно указана ссылка на пользователя ( https://vk.com/ )')

      const result = await userService.removeLeader(USER_INPUT)

      let message = 'Статусы исключений из чатов: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      await context.send(message)

      return await context.send('✅ Пользователь был успешно снят с поста лидера')

    } catch (error: any) {
      return error ? await context.send('❌ ' + error.message) : await context.send('❌ Произошла ошибка при снятии лидера')
    }
  }



  test: UserHandlerFunction = async (context) => {
    const builder = Keyboard.builder()
    await context.send('123', { keyboard: builder})
  }

  leaders: UserHandlerFunction = async (context) => {
    try {
      const [type] = context.arguments

      const [leaders, count] = await userService.leaders(type)

      let message = '✌ Список лидеров нелегальных организаций ✌ \n'
      leaders.forEach(leader => message += `ツ ${leader.gang.name.toUpperCase()} - @id${leader.vk} (${leader.name}) \n`)
      message += `Всего лидеров: ${count}`

      await context.send(message)
    } catch (error: any) {
      return error ? await context.send('❌ ' + error.message) : await context.send('❌ Произошла ошибка при получении списка лидеров')
    }
  }

  
  public help: UserHandlerFunction = async (context) => {
    try {
      const user = context.user as User
      let message = `✌ Список всех доступных команд ✌ \n \n`
      Object.keys(commands).forEach(command => {
        if (commands[command].access <= user.level)
           message += `ツ ${command}: ${commands[command].description} \n \n`
      })

      await context.send(message)
      
    } catch (error: any) {
      return error ? await context.send('❌ ' + error.message) : await context.send('❌ Произошла ошибка при получении списка лидеров')
    }
  }
}

export default new UserController