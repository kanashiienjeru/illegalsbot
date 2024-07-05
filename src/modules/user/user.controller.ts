import { Keyboard } from "vk-io";
import { organizationTags } from "../../configs/chats.js"
import { UserHandlerFunction } from "../../models/index.js"
import { checkLink, errorHandler, tagByOrg } from "../../utils/index.js"
import userService from "./user.service.js"



class UserController {
  public invite: UserHandlerFunction = async (context, args) => {
    const access = await userService.checkAccess(context.senderId)
    if (access < 2) return await context.send('❌ Нет доступа')
    if (args.length !== 2) return await context.send('❌ Неверно указаны аргументы ( /invite link tag )')
    const link = args[0]
    const tag = args[1]

    const USER_INPUT = checkLink(link)

    if (!USER_INPUT) return await context.send('❌ Неверно указана ссылка на пользователя ( https://vk.com/ )')
    if (!Object.keys(organizationTags).includes(tag)) return await context.send('❌ Неверно указан тэг ( LG, LM, G, M )')

    try {
      const result = await userService.invite(USER_INPUT, organizationTags[tag])
      let message = 'Статусы приглашений в чаты: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      return await context.send(message)
    } catch (error) {
      return error ? await context.send('❌ ' + error) : await context.send('❌ Произошла ошибка при добавлении в чаты')
    }
  }

  public kick: UserHandlerFunction = async (context, args) => {
    const access = await userService.checkAccess(context.senderId)
    if (access < 2) return await context.send('❌ Нет доступа')
    if (args.length !== 2) return await context.send('❌ Неверно указаны аргументы ( /kick link tag )')
    const link = args[0]
    const tag = args[1]

    const USER_INPUT = checkLink(link)

    if (!USER_INPUT) return await context.send('❌ Неверно указана ссылка на пользователя ( https://vk.com/ )')
    if (!Object.keys(organizationTags).includes(tag)) return await context.send('❌ Неверно указан тэг ( LG, LM, G, M )')


    try {
      const result = await userService.kick(USER_INPUT, organizationTags[tag])
      let message = 'Статусы исключений из чатов: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
    } catch (error) {
      return error ? await context.send('❌ ' + error) : await context.send('❌ Произошла ошибка при кика из чатов')
    }
  }

  public access: UserHandlerFunction = async (context, args) => {
    const access = await userService.checkAccess(context.senderId)
    if (access < 8) return await context.send('❌ Нет доступа')
    if (args.length < 2) return await context.send('❌ Неверно указаны аргументы ( /access link level )');
    const link = args[0];
    const level = args[1];

    const USER_INPUT = checkLink(link);

    if (!USER_INPUT) return await context.send('❌ Неверно указана ссылка на пользователя ( https://vk.com/ )')
    if (+level >= access || +level < 0) return await context.send('❌ Уровень доступа не может превышать ваш или быть ниже 0');

    await userService.access(context, USER_INPUT, +level)
  }

  public setLeader: UserHandlerFunction = async (context, args) => {
    const access = await userService.checkAccess(context.senderId)
    if (access < 4) return await context.send('❌ Нет доступа')
    if (args.length !== 2) return await context.send('❌ Неверно указаны аргументы ( /setleader link gang )')
    const link = args[0]
    const gang = args[1]

    const USER_INPUT = checkLink(link)

    if (!USER_INPUT) return await context.send('❌ Неверно указана ссылка на пользователя ( https://vk.com/ )')

    try {
      const result = await userService.invite(USER_INPUT, organizationTags['L' + tagByOrg(gang)])
      await userService.setLeader(USER_INPUT, gang)
      let message = 'Статусы приглашений в чаты: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      await context.send(message)
      return await context.send('✅ Пользователь был успешно назначен на пост лидера')
      
    } catch (error) {
      return error ? await context.send('❌ ' + error) : await context.send('❌ Произошла ошибка при назначении лидера')
    }
  }

  public removeLeader: UserHandlerFunction = async (context, args) => {
    const access = await userService.checkAccess(context.senderId)
    if (access < 4) return await context.send('❌ Нет доступа')
    if (args.length !== 1) return await context.send('❌ Неверно указаны аргументы ( /removeleader link )')
    const link = args[0]

    const USER_INPUT = checkLink(link)

    if (!USER_INPUT) return await context.send('❌ Неверно указана ссылка на пользователя ( https://vk.com/ )')

    try {
      const result = await userService.removeLeader(USER_INPUT)
      let message = 'Статусы исключений из чатов: \n'
      result.forEach(result => message += `${result.success ? `✅ ${result.chat.title}` : `❌ ${result.chat.title}: ${errorHandler(result.error)}`} \n`)
      await context.send(message)
      return await context.send('✅ Пользователь был успешно снят с поста лидера')
    } catch (error) {
      return error ? await context.send('❌ ' + error) : await context.send('❌ Произошла ошибка при снятии лидера')
    }
  }



  test: UserHandlerFunction = async (context, args) => {
    await context.send('123')
  }

  leaders:UserHandlerFunction = async (context, args) => {

    const type = args[0]

    try {
      const [leaders, count] = await userService.leaders(type)
      let message = ''
      leaders.forEach(leader => message += `ツ ${leader.gang.name.toUpperCase()} - @id${leader.vk} (${leader.name}) \n`)
      message += `Всего лидеров: ${count}`
      
      await context.send(message)
    } catch (error) {
      return error ? await context.send('❌ ' + error) : await context.send('❌ Произошла ошибка при получении списка лидеров')
    }
  }
}

export default new UserController