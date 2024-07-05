import { groupInstance } from "..";
import { commands } from "../configs/commands.js";
import middlewares from "../middlewares/middlewares.js";

export async function executeMiddlewares(context: any, next: any) {
  middlewares.commandParser(context, next, commands)

  if (context.command && context.arguments) {
    for (const middleware of context.command.midd) {
      const result = await middleware(context, next)

      if (!result) return 
    }
  } else {
    console.log('не команда')
    next()
  }

}