import type { Region } from '../users/userTypes'

export type { Region } from '../users/userTypes'

export interface Clan {
  id: string
  name: string
  tag: string
  emblem: string
  description: string
  motto: string
  region: Region
  founderId: string
  founderUsername: string
  members: ClanMember[]
  pendingApplications: ClanApplication[]
  score: number
  arbitrageVolume: number
  rank: number
  activity: ClanActivity
  createdAt: number
  updatedAt: number
}

export interface ClanMember {
  userId: string
  username: string
  avatar: string
  role: ClanRole
  score: number
  arbitrageVolume: number
  joinedAt: number
}

export type ClanRole = 'founder' | 'leader' | 'officer' | 'member'

export const CLAN_ROLES: ClanRole[] = ['founder', 'leader', 'officer', 'member']

export const CLAN_ROLE_NAMES: Record<ClanRole, string> = {
  founder: 'Founder',
  leader: 'Leader',
  officer: 'Officer',
  member: 'Member',
}

export interface ClanApplication {
  id: string
  userId: string
  username: string
  avatar: string
  message: string
  appliedAt: number
  status: 'pending' | 'approved' | 'rejected'
}

export type ClanActivity = 'very-active' | 'active' | 'moderate' | 'low'

export const CLAN_ACTIVITIES: ClanActivity[] = ['very-active', 'active', 'moderate', 'low']

export const CLAN_ACTIVITY_NAMES: Record<ClanActivity, string> = {
  'very-active': 'Very Active',
  'active': 'Active',
  'moderate': 'Moderate',
  'low': 'Low Activity',
}

export interface ClanCreateData {
  name: string
  tag: string
  description: string
  motto: string
  region: Region
}

export interface ClanChatMessage {
  id: string
  clanId: string
  userId: string
  username: string
  avatar: string
  channel: ClanChatChannel
  message: string
  timestamp: number
}

export type ClanChatChannel = 'general' | 'strategy' | 'intel-feed' | 'trades' | 'warz-planning' | 'off-topic' | 'council'

export const CLAN_CHAT_CHANNELS: ClanChatChannel[] = ['general', 'strategy', 'intel-feed', 'trades', 'warz-planning', 'off-topic', 'council']

export const CLAN_CHAT_CHANNEL_NAMES: Record<ClanChatChannel, string> = {
  general: '# General',
  strategy: '# Strategy',
  'intel-feed': '# Intel Feed',
  trades: '# Trades',
  'warz-planning': '# Warz Planning',
  'off-topic': '# Off Topic',
  council: '# Council',
}

export const CLAN_CHAT_CHANNEL_DESCRIPTIONS: Record<ClanChatChannel, string> = {
  general: 'General clan discussion',
  strategy: 'Trading strategies and coordination',
  'intel-feed': 'Market intelligence and alerts',
  trades: 'Share trades and results',
  'warz-planning': 'Clan Warz tactics and planning',
  'off-topic': 'Casual conversation',
  council: 'Leadership discussions (officers+)',
}

export interface ClanStats {
  totalScore: number
  totalArbitrageVolume: number
  averageScorePerMember: number
  memberCount: number
  rank: number
  activity: ClanActivity
}
