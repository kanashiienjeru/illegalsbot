import { ContextDefaultState, MessageContext } from "vk-io";
import { Commands, UserHandlerFunction } from "../models/index.js";
import userController from "../modules/user/user.controller.js";
import leaderController from "../modules/leader/leader.controller.js";
import middlewares from "../middlewares/middlewares.js";


export const commands: Commands = {
    "/invite": { description: '', access: 3, midd: [middlewares.checkAccess, userController.invite] },
    "/kick": { description: '', access: 3, midd: [middlewares.checkAccess, userController.kick] },
    "/test": { description: '', access: 10, midd: [middlewares.checkAccess, userController.test] },
    "/access": { description: '', access: 8, midd: [middlewares.checkAccess, userController.access] },
    "/setleader": { description: '', access: 3, midd: [middlewares.checkAccess, userController.setLeader] },
    "/removeleader": { description: '', access: 3, midd: [middlewares.checkAccess, userController.removeLeader] },
    "/setzam": { description: '', access: 0, midd: [middlewares.checkLeader, leaderController.setZam] }, 
    "/delzam": { description: '', access: 0, midd: [middlewares.checkLeader, leaderController.delZam] },
    "/zams": { description: '', access: 0, midd: [middlewares.checkLeader, leaderController.myZams] },
    "/leaders": { description: '', access: 0, midd: [userController.leaders] },

}
