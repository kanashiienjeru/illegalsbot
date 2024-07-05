import { ContextDefaultState, MessageContext } from "vk-io";

export type UserHandlerFunction = (context: MessageContext<ContextDefaultState> & object, args: string[], commandObject: CommandObject) => void;

export interface OrganizationTags {
  [tag: string]: Chat[]
}

export interface Chat {
  id: number
  peerId: number
  title: string
}

export interface CommandObject {
  description: string
  access: number
  midd: any[]
}
export interface Commands {
  [command: string]: CommandObject
}