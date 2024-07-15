import Imap from 'imap'
import dotenv from 'dotenv'

dotenv.config()


export const imap = new Imap({
  user: process.env.MAIL_USER || "",
  password: process.env.MAIL_PASSWORD || "",
  host: 'imap.mail.ru',
  port: 993,
  tls: true,
});