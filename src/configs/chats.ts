import { OrganizationTags } from "../models/index.js"

export const chats = [
  {
      id: 2000000001,
      title: 'Kingman | Лидеры Гетто'
  },
  {
      id: 2000000039,
      title: 'Kingman | Лидеры Мафий'
  },
  {
      id: 2000000002,
      title: 'Kingman | Забивы/отбивы гетто'
  },
  {
      id: 2000000004,
      title: 'Kingman | Забивы/отбивы мафий'
  },
  {
      id: 2000000003,
      title: 'Kingman | Конференция лидеров и заместителей нелегальных организаций'
  },
  {
      id: 2000000001,
      title: 'Kingman | Illegals organizations'
  }
]

export const userChats = {
  leadersGhetto: {
      id: 1,
      peerId: 2000000001,
      title: 'Лидеры гетто'
  },
  leadersMafia: {
      id: 39,
      peerId: 2000000039,
      title: 'Лидеры мафий'
  },
  captures: {
      id: 2,
      peerId: 2000000002,
      title: 'Забивы гетто'
  },
  bizwars: {
      id: 4,
      peerId: 2000000004,
      title: 'Забивы мафий'
  },
  smoking: {
      id: 3,
      peerId: 2000000003,
      title: 'Курилка'
  },
  admins: {
      id: 5,
      peerId: 2000000005,
      title: 'Админская'
  },
  test: {
      id: 49,
      peerId: 2000000049
  }
}

export const groupChats = {
  admins: {
      peerId: 2000000001
  },
  test: {
      peerId: 2000000002
  }
}

export const organizationTags: OrganizationTags = {
  LG: [userChats.leadersGhetto, userChats.smoking, userChats.captures],
  LM: [userChats.leadersMafia, userChats.smoking, userChats.bizwars],
  G: [userChats.smoking, userChats.captures],
  M: [userChats.smoking, userChats.bizwars],
  T: [userChats.admins]
}
