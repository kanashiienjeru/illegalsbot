import { ContextDefaultState, MessageContext } from "vk-io"
import AppDataSource from "../configs/database"
import { User } from "../entities/user.entity"
import { NO_ACCESS_MESSAGE } from "../configs/messages"
import { Commands } from "../models/index"

class Middlewares {
  private userRepository = AppDataSource.getRepository(User)

  public commandParser(context: MessageContext<ContextDefaultState> & object, next: Function, commands: Commands) {
    if (!context.text) return false
    const commandArray = context.text.split(' ')

    const command = commandArray[0]
    if (!command.startsWith('/')) return false
    if (!Object.keys(commands).includes(command)) return false

    const args = commandArray.slice(1, commandArray.length)

    context.command = commands[command]
    context.arguments = args
    next()

  }

  public checkAccess = async(context: MessageContext<ContextDefaultState> & object, next: Function) => {
    const user = await this.userRepository.findOne({ where: { vk: context.senderId }, relations: { gang: true }})
    if (!user) return false

    context.user = user as User

    const isApproved = user.level >= context.command.access

    if (!isApproved) throw Error('Нет доступа')

    return isApproved
    
  }

  public checkDeputy = async (context: MessageContext<ContextDefaultState> & object, next: Function) => {
    const user = await this.userRepository.findOne({ where: { vk: context.senderId}, relations: { gang: true }})
    if (!user) return false

    context.user = user as User

    if (!user.isDeputy) await context.send(NO_ACCESS_MESSAGE)

    return user.isDeputy
  }

  public checkLeader = async (context: MessageContext<ContextDefaultState> & object, next: Function) => {
    const user = await this.userRepository.findOne({where: { vk: context.senderId }, relations: { gang: true }})
    if (!user) return false

    context.user = user as User

    if (!user.isLeader) await context.send(NO_ACCESS_MESSAGE)

    return user.isLeader
  }
}

export default new Middlewares()