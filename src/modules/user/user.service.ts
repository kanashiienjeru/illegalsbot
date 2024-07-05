import { ContextDefaultState, MessageContext } from "vk-io";
import AppDataSource from "../../configs/database.js";
import { User } from "../../entities/user.entity.js";
import { groupInstance, userInstance } from "../../index.js";
import { Chat } from "../../models/index.js";
import { errorHandler, tagByOrg } from "../../utils/index.js";
import { Gang } from "../../entities/gang.entity.js";
import { organizationTags } from "../../configs/chats.js";
import { LessThan, LessThanOrEqual, MoreThan } from "typeorm";

class UserService {
  private userRepository = AppDataSource.getRepository(User)
  private gangRepository = AppDataSource.getRepository(Gang)

  async invite(vk: string, chajs: Chat[]) {

    const users = await groupInstance.api.users.get({
      user_ids: [vk]
    })

    if (!users.length) throw new Error('Не удалось найти пользователя по указанной ссылке')

    const isFriend = await userInstance.api.friends.areFriends({
      user_ids: users[0].id
    })

    if (!isFriend[0].friend_status) throw new Error('Пользователь не добавил меня в друзья')

    if (isFriend[0].friend_status == 2) {
      await userInstance.api.friends.add({
        user_id: users[0].id
      })
    }
  
    const resuljs = await Promise.all(chajs.map(async (chat) => {
      try {
        await userInstance.api.messages.addChatUser({
          chat_id: chat.id,
          user_id: users[0].id
        });

        return { chat, success: true };

      } catch (error) {
        return { chat, success: false, error };
      }
    }));

    return resuljs
  }

  async kick(vk: string, chajs: Chat[]) {

    const users = await groupInstance.api.users.get({
      user_ids: [vk]
    })

    if (!users.length) throw new Error('Не удалось найти пользователя по указанной ссылке')

    const resuljs = await Promise.all(chajs.map(async chat => {
      try {
        await userInstance.api.messages.removeChatUser({
          chat_id: chat.id,
          user_id: users[0].id
        })

        return { chat, success: true }
      } catch (error) {
        return { chat, success: false, error}
      }
    }))

    return resuljs
  }


  async access(context: MessageContext<ContextDefaultState> & object, vk: string, level: number) {
    const vkUser = await groupInstance.api.users.get({ user_ids: [vk] })
    const user = await this.userRepository.findOneBy({ vk: vkUser[0].id })

    if (!user) {
      const newUser = this.userRepository.create({ 
          name: `${vkUser[0].first_name} ${vkUser[0].last_name}`,
          vk: vkUser[0].id,
          active: 0,
          level: level
        })

        await this.userRepository.save(newUser)

        return await context.send('✅ Пользователь был успешно добавлен')
    }

    user.level = level

    await this.userRepository.save(user)

    return await context.send('✅ Уровень доступа был успешно обновлён')


  }

  async checkAccess(vkId: number) {
    const user = await this.userRepository.findOne({ where: { vk: vkId }})
    if (!user) return 0
    return user.level
  }

  async checkLeader(vkId: number) {
    const user = await this.userRepository.findOne({ where: { vk: vkId }, relations: { gang: true }})
    if (!user) return false
    if (user.isLeader && user.gang) return user.gang
    return false
  }

  async setLeader( link: string, gangName: string) {
    const vkUser = await groupInstance.api.users.get({ user_ids: [link]})
    if (!vkUser[0]) throw Error('Не удалось найти указанного пользователя');

    const user = await this.userRepository.findOneBy({ vk: vkUser[0].id })
    if (!user) throw Error('Не удалось найти указанного пользователя');

    const gang = await this.gangRepository.findOneBy({ name: gangName })
    if (!gang) throw Error('Не удалось найти указанную банду')

    const duplicates = await this.userRepository.findBy({ gang: gang })

    if (duplicates.length > 0) throw Error('У данной фракции уже есть лидер')

    user.isLeader = true;
    user.isDeputy = false;
    user.gang = gang;

    await this.userRepository.save(user)

    return true
  }

  async removeLeader(link: string) {
    const vkUser = await groupInstance.api.users.get({ user_ids: [link]})
    if (!vkUser[0]) throw Error('Не удалось найти указанного пользователя');

    const user = await this.userRepository.findOneBy({ vk: vkUser[0].id })
    if (!user) throw Error('Не удалось найти указанного пользователя');
    
    
    user.isLeader = false;
    //@ts-ignore
    user.gang = null;
    
    this.userRepository.save(user)
    
    const resuljs = await this.kick(link, organizationTags['L' + tagByOrg(user.gang.name)])
    return resuljs

  }

  async leaders(type?: string) {
    if (type === 'mafia') {
      const result = await this.userRepository.findAndCount({ where: { isLeader: true, gang: { id: MoreThan(6) } }, relations: { gang: true }})

      return result
    } 
    if (type === 'ghetto') {
      const result = await this.userRepository.findAndCount({ where: { isLeader: true, gang: { id: LessThanOrEqual(6) } }, relations: { gang: true }})

      return result
    }

    const result = await this.userRepository.findAndCount({ where: { isLeader: true }, relations: { gang: true }})
    return result
  }
}

export default new UserService