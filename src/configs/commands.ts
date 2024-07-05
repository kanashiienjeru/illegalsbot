import { ContextDefaultState, MessageContext } from "vk-io";
import { UserHandlerFunction } from "../models/index.js";
import userController from "../modules/user/user.controller.js";
import leaderController from "../modules/leader/leader.controller.js";


interface Commands {
  [command: string]: UserHandlerFunction
}

export const commands: Commands = {
    "/invite": userController.invite,
    "/kick": userController.kick,
    "/test": userController.test,
    "/access": userController.access,
    "/setleader": userController.setLeader,
    "/removeleader": userController.removeLeader,
    "/setzam": leaderController.setZam,
    "/delzam": leaderController.delZam,
    "/myzams": leaderController.myZams,
    "/leaders": userController.leaders

}
