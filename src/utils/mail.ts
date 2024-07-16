
import { ParsedMail, simpleParser, Source } from "mailparser";
import { checkLink, extractLink } from ".";
import { userInstance } from "..";
import { imap } from "../configs/mail";
import { MailUser, mailUsers } from "../configs/users";

//@ts-ignore
import levenshtein from 'js-levenshtein'

export async function findClosestAdmin(nickname: string): Promise<any | null> {
  let closestAdmin: MailUser | null = null;
  let closestDistance = Infinity;

  const admins = await fetch('https://admin.sethp.xyz/api/users?info=1', { headers: { Token: '6b2a6704dd5841f3873d41114c8df33b'}}).then(res => res.json())


  for (const admin of admins.users) {
    const distance = levenshtein(nickname, admin.name);
    const maxAllowedDistance = Math.floor(admin.name.length / 2);

    if (distance <= maxAllowedDistance && distance < closestDistance) {
      closestDistance = distance;
      closestAdmin = admin;
    }
  }

  return closestAdmin;
}

export function processNewMail() {
try {
    imap.on('mail', function(numNewMsgs: number) {
  
      // Fetch the new email(s) in the ARIZONA folder
      // @ts-ignore
      const f = imap.seq.fetch(`${imap._box.messages.total - numNewMsgs + 1}:*`, {
        bodies: '',
        struct: true
      });
  
      f.on('message', function(msg, seqno) {
        msg.on('body', async function(stream: Source) {
          simpleParser(stream, async (err, mail: ParsedMail) => {
            if (err) throw err;
            if (!mail) throw err
  
            const stringWithLink = mail.text?.split('\n').filter(el => el !== '')[1]
            if (!stringWithLink) return
  
            const link = extractLink(stringWithLink)
            const correctLink = link?.slice(0, link.length -1)
  
            if (correctLink) {
              const admin = mail.subject?.split('на администратора ')[1].split(' |')[0]
              
              if (!admin) return
  
              const adminProfile = await findClosestAdmin(admin)
  
              if (!adminProfile) return console.log('не нашел админа' + admin)
  
              await sendReportLinkToAdmin(adminProfile.vk.id, correctLink)
  
            }          
          });
        });
      });
  
      f.once('error', function(err) {
        console.log('Fetch error: ' + err);
      });
    });
} catch (error) {
  console.log(error)
}
}


async function sendReportLinkToAdmin(id: number, reportLink: string) {
  const users = await userInstance.api.users.get({
    user_ids: [id],

  })

  if (!users.length) return console.log('не удалось найти админа в Вк')

  await userInstance.api.messages.send({
    user_id: users[0].id,
    random_id: 0,
    message: `Привет, на тебя написали жалобу. Вот ссылка - ${reportLink}`
  })

}