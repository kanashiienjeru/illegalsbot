import { groupInstance } from "..";
import { commands } from "../configs/commands";
import middlewares from "../middlewares/middlewares";

export async function executeMiddlewares(context: any, next: any) {
  middlewares.commandParser(context, next, commands)

  if (context.command && context.arguments) {
    for (const middleware of context.command.midd) {
      const result = await middleware(context, next)

      if (!result) return 
    }
  } else {
    next()
  }

}