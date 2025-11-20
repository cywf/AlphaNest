import type { Clan, ClanCreateData, ClanMember, ClanApplication, ClanChatMessage, ClanChatChannel, ClanActivity } from './clanTypes'
import { authEngine } from '../users/authEngine'

const CLANS_KEY = 'crypto_arbitrage_clans'
const CLAN_CHAT_KEY = 'crypto_arbitrage_clan_chat'

const CLAN_EMBLEMS = ['⚔️', '🛡️', '👑', '⚡', '🔥', '🐉', '🦅', '🌟', '💎', '🎯', '🏆', '⭐', '🌙', '☄️', '🔱', '🗡️']

export class ClanEngine {
  private static instance: ClanEngine

  private constructor() {}

  static getInstance(): ClanEngine {
    if (!ClanEngine.instance) {
      ClanEngine.instance = new ClanEngine()
    }
    return ClanEngine.instance
  }

  private getClans(): Clan[] {
    const stored = localStorage.getItem(CLANS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  private saveClans(clans: Clan[]): void {
    localStorage.setItem(CLANS_KEY, JSON.stringify(clans))
  }

  private getClanMessages(): ClanChatMessage[] {
    const stored = localStorage.getItem(CLAN_CHAT_KEY)
    return stored ? JSON.parse(stored) : []
  }

  private saveClanMessages(messages: ClanChatMessage[]): void {
    localStorage.setItem(CLAN_CHAT_KEY, JSON.stringify(messages))
  }

  private generateEmblem(): string {
    return CLAN_EMBLEMS[Math.floor(Math.random() * CLAN_EMBLEMS.length)]
  }

  private calculateActivity(clan: Clan): ClanActivity {
    const now = Date.now()
    const hoursSinceUpdate = (now - clan.updatedAt) / (1000 * 60 * 60)
    const memberCount = clan.members.length
    const scorePerMember = clan.score / Math.max(1, memberCount)

    if (hoursSinceUpdate < 1 && scorePerMember > 1000) return 'very-active'
    if (hoursSinceUpdate < 6 && scorePerMember > 500) return 'active'
    if (hoursSinceUpdate < 24) return 'moderate'
    return 'low'
  }

  private updateRankings(): void {
    const clans = this.getClans()
    const sorted = [...clans].sort((a, b) => b.score - a.score)
    
    sorted.forEach((clan, index) => {
      clan.rank = index + 1
    })

    this.saveClans(clans)
  }

  createClan(data: ClanCreateData): { success: boolean; clan?: Clan; error?: string } {
    const user = authEngine.getCurrentUser()
    if (!user) {
      return { success: false, error: 'Must be logged in to create a clan' }
    }

    if (user.clanId) {
      return { success: false, error: 'You are already in a clan' }
    }

    const clans = this.getClans()

    if (clans.some((c) => c.tag.toLowerCase() === data.tag.toLowerCase())) {
      return { success: false, error: 'Clan tag already taken' }
    }

    if (clans.some((c) => c.name.toLowerCase() === data.name.toLowerCase())) {
      return { success: false, error: 'Clan name already taken' }
    }

    const founderMember: ClanMember = {
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      role: 'founder',
      score: user.score,
      arbitrageVolume: user.arbitrageVolume,
      joinedAt: Date.now(),
    }

    const clan: Clan = {
      id: `clan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: data.name,
      tag: data.tag,
      emblem: this.generateEmblem(),
      description: data.description,
      motto: data.motto,
      region: data.region,
      founderId: user.id,
      founderUsername: user.username,
      members: [founderMember],
      pendingApplications: [],
      score: user.score,
      arbitrageVolume: user.arbitrageVolume,
      rank: 0,
      activity: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    clans.push(clan)
    this.saveClans(clans)

    authEngine.updateUser(user.id, {
      clanId: clan.id,
      clanTag: clan.tag,
    })

    this.updateRankings()

    return { success: true, clan }
  }

  getClan(clanId: string): Clan | null {
    const clans = this.getClans()
    const clan = clans.find((c) => c.id === clanId)
    if (clan) {
      clan.activity = this.calculateActivity(clan)
    }
    return clan || null
  }

  getAllClans(): Clan[] {
    const clans = this.getClans()
    return clans.map((clan) => ({
      ...clan,
      activity: this.calculateActivity(clan),
    }))
  }

  applyToClan(clanId: string, message: string): { success: boolean; error?: string } {
    const user = authEngine.getCurrentUser()
    if (!user) {
      return { success: false, error: 'Must be logged in to apply' }
    }

    if (user.clanId) {
      return { success: false, error: 'You are already in a clan' }
    }

    const clans = this.getClans()
    const clan = clans.find((c) => c.id === clanId)

    if (!clan) {
      return { success: false, error: 'Clan not found' }
    }

    if (clan.pendingApplications.some((app) => app.userId === user.id)) {
      return { success: false, error: 'You have already applied to this clan' }
    }

    const application: ClanApplication = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      message,
      appliedAt: Date.now(),
      status: 'pending',
    }

    clan.pendingApplications.push(application)
    this.saveClans(clans)

    return { success: true }
  }

  acceptApplication(clanId: string, applicationId: string): { success: boolean; error?: string } {
    const clans = this.getClans()
    const clan = clans.find((c) => c.id === clanId)

    if (!clan) {
      return { success: false, error: 'Clan not found' }
    }

    const application = clan.pendingApplications.find((app) => app.id === applicationId)

    if (!application) {
      return { success: false, error: 'Application not found' }
    }

    const user = authEngine.getUserById(application.userId)

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.clanId) {
      return { success: false, error: 'User is already in a clan' }
    }

    const member: ClanMember = {
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      role: 'member',
      score: user.score,
      arbitrageVolume: user.arbitrageVolume,
      joinedAt: Date.now(),
    }

    clan.members.push(member)
    clan.score += user.score
    clan.arbitrageVolume += user.arbitrageVolume
    clan.updatedAt = Date.now()

    application.status = 'approved'

    this.saveClans(clans)

    authEngine.updateUser(user.id, {
      clanId: clan.id,
      clanTag: clan.tag,
    })

    this.updateRankings()

    return { success: true }
  }

  rejectApplication(clanId: string, applicationId: string): { success: boolean; error?: string } {
    const clans = this.getClans()
    const clan = clans.find((c) => c.id === clanId)

    if (!clan) {
      return { success: false, error: 'Clan not found' }
    }

    const application = clan.pendingApplications.find((app) => app.id === applicationId)

    if (!application) {
      return { success: false, error: 'Application not found' }
    }

    application.status = 'rejected'
    this.saveClans(clans)

    return { success: true }
  }

  leaveClan(clanId: string): { success: boolean; error?: string } {
    const user = authEngine.getCurrentUser()
    if (!user) {
      return { success: false, error: 'Must be logged in' }
    }

    const clans = this.getClans()
    const clan = clans.find((c) => c.id === clanId)

    if (!clan) {
      return { success: false, error: 'Clan not found' }
    }

    const member = clan.members.find((m) => m.userId === user.id)

    if (!member) {
      return { success: false, error: 'You are not in this clan' }
    }

    if (member.role === 'founder') {
      return { success: false, error: 'Founder cannot leave clan. Transfer ownership first.' }
    }

    clan.members = clan.members.filter((m) => m.userId !== user.id)
    clan.score = Math.max(0, clan.score - member.score)
    clan.arbitrageVolume = Math.max(0, clan.arbitrageVolume - member.arbitrageVolume)
    clan.updatedAt = Date.now()

    this.saveClans(clans)

    authEngine.updateUser(user.id, {
      clanId: null,
      clanTag: null,
    })

    this.updateRankings()

    return { success: true }
  }

  sendChatMessage(clanId: string, channel: ClanChatChannel, message: string): { success: boolean; error?: string } {
    const user = authEngine.getCurrentUser()
    if (!user) {
      return { success: false, error: 'Must be logged in' }
    }

    if (user.clanId !== clanId) {
      return { success: false, error: 'You are not in this clan' }
    }

    const messages = this.getClanMessages()

    const chatMessage: ClanChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      clanId,
      userId: user.id,
      username: user.username,
      avatar: user.avatar,
      channel,
      message,
      timestamp: Date.now(),
    }

    messages.push(chatMessage)
    this.saveClanMessages(messages)

    return { success: true }
  }

  getMessagesForClan(clanId: string, channel?: ClanChatChannel): ClanChatMessage[] {
    const messages = this.getClanMessages()
    let filtered = messages.filter((m) => m.clanId === clanId)
    
    if (channel) {
      filtered = filtered.filter((m) => m.channel === channel)
    }

    return filtered.sort((a, b) => a.timestamp - b.timestamp)
  }

  updateClanScore(clanId: string, additionalScore: number): void {
    const clans = this.getClans()
    const clan = clans.find((c) => c.id === clanId)

    if (clan) {
      clan.score += additionalScore
      clan.arbitrageVolume += additionalScore * 100
      clan.updatedAt = Date.now()
      this.saveClans(clans)
      this.updateRankings()
    }
  }

  initializeDemoClans(): void {
    const clans = this.getClans()
    if (clans.length > 0) return

    const users = authEngine.getAllUsers()
    if (users.length === 0) return

    const demoClan: Clan = {
      id: 'demo_clan_1',
      name: 'Neon Samurai',
      tag: 'NEON',
      emblem: '⚔️',
      description: 'Elite traders from the digital frontlines',
      motto: 'Strike fast, profit faster',
      region: 'asia-east',
      founderId: users[0].id,
      founderUsername: users[0].username,
      members: [
        {
          userId: users[0].id,
          username: users[0].username,
          avatar: users[0].avatar,
          role: 'founder',
          score: users[0].score,
          arbitrageVolume: users[0].arbitrageVolume,
          joinedAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        },
      ],
      pendingApplications: [],
      score: users[0].score,
      arbitrageVolume: users[0].arbitrageVolume,
      rank: 1,
      activity: 'very-active',
      createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
      updatedAt: Date.now(),
    }

    this.saveClans([demoClan])

    authEngine.updateUser(users[0].id, {
      clanId: demoClan.id,
      clanTag: demoClan.tag,
    })
  }
}

export const clanEngine = ClanEngine.getInstance()
