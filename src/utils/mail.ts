
import { ParsedMail, simpleParser, Source } from "mailparser";
import { checkLink, extractLink } from ".";
import { userInstance } from "..";
import { imap } from "../configs/mail";
import { mailUsers } from "../configs/users";



export function processNewMail() {
  imap.on('mail', function(numNewMsgs: number) {
    console.log('New mail arrived:', numNewMsgs);

    // Fetch the new email(s) in the ARIZONA folder
    // @ts-ignore
    const f = imap.seq.fetch(`${imap._box.messages.total - numNewMsgs + 1}:*`, {
      bodies: '',
      struct: true
    });

    f.on('message', function(msg, seqno) {
      console.log('Message #%d', seqno);

      msg.on('body', function(stream: Source) {
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

            const adminProfile = mailUsers.find(user => user.name.toLowerCase() === admin.toLowerCase())

            if (!adminProfile) return

            await sendReportLinkToAdmin(adminProfile.vk, correctLink)

          }          
        });
      });
    });

    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
  });
}


async function sendReportLinkToAdmin(vk: string, reportLink: string) {
  const id = checkLink(vk)
  const users = await userInstance.api.users.get({
    user_ids: [id],

  })

  if (!users.length) return 

  await userInstance.api.messages.send({
    user_id: users[0].id,
    random_id: 0,
    message: `Привет, на тебя написали жалобу. Вот ссылка - ${reportLink}`
  })
}