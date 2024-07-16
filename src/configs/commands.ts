import { ContextDefaultState, MessageContext } from "vk-io";
import { Commands, UserHandlerFunction } from "../models/index";
import userController from "../modules/user/user.controller";
import leaderController from "../modules/leader/leader.controller";
import middlewares from "../middlewares/middlewares";


export const commands: Commands = {
    "/invite": { description: 'Добавление пользователя в конференции \n ✗ Общая форма: /invite link tag', access: 3, midd: [middlewares.checkAccess, userController.invite] },
    "/kick": { description: 'Кик пользователя из конференций \n ✗ Общая форма: /kick ling tag', access: 3, midd: [middlewares.checkAccess, userController.kick] },
    "/test": { description: '', access: 10, midd: [middlewares.checkAccess, userController.test] },
    "/access": { description: 'Изменение доступа пользователя \n ✗ Общая форма: /access link level', access: 8, midd: [middlewares.checkAccess, userController.access] },
    "/setleader": { description: 'Назначение пользователя на пост лидера \n ✗ Общая форма: /setleader link organization', access: 3, midd: [middlewares.checkAccess, userController.setLeader] },
    "/removeleader": { description: 'Снятие пользователя с поста лидера \n ✗ Общая форма: /removeleader link ', access: 3, midd: [middlewares.checkAccess, userController.removeLeader] },
    "/setzam": { description: 'Назначить пользователя на пост заместителя в свою организацию \n ✗ Общая форма: /setzam link', access: 0, midd: [middlewares.checkLeader, leaderController.setZam] }, 
    "/delzam": { description: 'Снять пользователя с поста заместителя в своей организации \n ✗ Общая форма: /delzam link', access: 0, midd: [middlewares.checkLeader, leaderController.delZam] },
    "/zams": { description: 'Просмотр списка заместителей своей организации', access: 0, midd: [middlewares.checkLeader, leaderController.zams] },
    "/leaders": { description: 'Просмотр списка лидеров всех нелегальных организаций', access: 0, midd: [userController.leaders] },
    "/help": { description: 'Список всех доступных команд', access: 0, midd: [middlewares.checkAccess, userController.help]}

}
