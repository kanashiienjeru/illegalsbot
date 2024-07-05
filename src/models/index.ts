import { ContextDefaultState, MessageContext } from "vk-io";

export type UserHandlerFunction = (context: MessageContext<ContextDefaultState> & object, args: string[] ) => void;

export interface OrganizationTags {
  [tag: string]: Chat[]
}

export interface Chat {
  id: number
  peerId: number
  title: string
}