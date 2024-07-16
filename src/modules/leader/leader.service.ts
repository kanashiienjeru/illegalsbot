import AppDataSource from "../../configs/database";
import { Gang } from "../../entities/gang.entity";
import { User } from "../../entities/user.entity";
import { groupInstance } from "../../index";

class LeaderService {
  private userRepository = AppDataSource.getRepository(User)
  private gangRepository = AppDataSource.getRepository(Gang)

  public async setZam(link: string, gang: Gang) {
    const vkUser = await groupInstance.api.users.get({ user_ids: [link]})
    if (!vkUser[0]) throw Error('Не удалось найти указанного пользователя');
    const [currentDeputies, count] = await this.zams(gang)
    if (count >= 3) throw Error('У вас уже назначено три или более заместителей')

    const user = await this.userRepository.findOneBy({ vk: vkUser[0].id })
    if (!user) {
      const newUser = this.userRepository.create({ 
        name: `${vkUser[0].first_name} ${vkUser[0].last_name}`, 
        vk: vkUser[0].id, 
        isDeputy: true,
        gang: gang

      })

      await this.userRepository.save(newUser)
      return true
    }

    if (user.isLeader) throw new Error('Пользователь является лидером')

    user.isDeputy = true;
    user.gang = gang;

    await this.userRepository.save(user)
    return true
  }

  public async delZam(link: string, gang: Gang) {
    const vkUser = await groupInstance.api.users.get({ user_ids: [link]})

    if (!vkUser[0]) throw Error('Не удалось найти указанного пользователя');

    const user = await this.userRepository.findOne({ where: { vk: vkUser[0].id }, relations: {gang: true}})

    if (!user || !user.isDeputy) throw new Error('Не удалось найти указанного пользователя или пользователь не является заместителем')
    if (user.gang.id !== gang.id) throw new Error('Пользователь не является заместителем вашей банды')

    user.isDeputy = false;
    // @ts-ignore
    user.gang = null;

    await this.userRepository.save(user)

    return true

    
  }


  public async zams(gang: Gang | string) {

    if (typeof(gang) === 'string') {
      const gangResult = await this.gangRepository.findOneBy({ name: gang })


      if (!gangResult) throw Error('Не удалось найти указанную организацию')

      const result = await this.userRepository.findAndCountBy({ isDeputy: true, gang: gangResult })
      
      return result
    }
    const result = await this.userRepository.findAndCountBy({ isDeputy: true, gang: gang })
    return result
  }
}

export default new LeaderService