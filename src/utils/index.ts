import { userInstance } from "../index.js";

export const checkLink = (link: string) => {
  if (link.includes('vk.com/')) {
      const idRegex = /vk\.com\/id(\d+)/;
      const idMatch = link.match(idRegex);
      return idMatch ? idMatch[1] : link.split('vk.com/')[1]

  }
  if (link.includes('@')) return link.split('@')[1].split(']')[0]
  if (link.includes('[') && link.includes(']')) {
      return link.split('|')[0].split('[')[1].split('id')[1]
  }


  return false
}

// @ts-ignore
export const errorHandler = (error) => {
  return error.message.split('- ')[1]
}


export const updateActive = async () => {
  const messages = await userInstance.api.messages.getHistory({
      peer_id: 2000000002,
      count: 100,
      extended: 1
  })

  const msgListPerCurrentDay = messages.items.filter(msg => {
      const msgDate = new Date(msg.date * 1000).getDate()
      const currentDate = new Date().getDate()
      return currentDate === msgDate
  })


  msgListPerCurrentDay.forEach(async msg => {
      if (!msg.reactions) return; // проверка на наличие реакций

      const test = await userInstance.api.messages.getReactedPeers({
          peer_id: 2000000002,
          cmid: msg.conversation_message_id, 
      })

      if (test.reactions.find(reac => reac.reaction_id === 4 && reac.user_id === 814171113)) return; // проверка на уже проверенное сообщение
      if (!test.reactions.find(reac => reac.reaction_id === 2)) return; // проверка на нужную реакцию
      
      
      const user_ids = test.reactions.filter(reac => reac.reaction_id === 2).map(e => e.user_id )

      // user_ids.forEach(async user_id => {
      //     await connection.query(`UPDATE users SET active = active + 1  WHERE vk = ?`, [user_id])
      // })

      await userInstance.api.messages.sendReaction({
          peer_id: 2000000002,
          cmid: msg.conversation_message_id,
          reaction_id: 4
      })


  })
}

export const tagByOrg = (organization: string) => {
  const ghetto = ['ballas', 'rifa', 'aztec', 'nw', 'vagos', 'grove']
  const mafia = ['trb', 'lcn', 'yakuza', 'rm', 'warlock']

  if (ghetto.includes(organization)) return 'G'
  if (mafia.includes(organization)) return 'M'

  return ''
}