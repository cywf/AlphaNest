import type {
  ClanWarzState,
  RegionDominance,
  UserPin,
  ClanInfluence,
  HotZone,
  ClanWarzLeaderboard,
  ClanRanking,
  ClanPresence,
} from './clanWarzTypes'
import { REGION_POSITIONS, REGION_COLORS } from './clanWarzTypes'
import { REGIONS, type Region } from '../users/userTypes'
import { clanEngine } from '../clans/clanEngine'
import { authEngine } from '../users/authEngine'

export class ClanWarzEngine {
  private static instance: ClanWarzEngine

  private constructor() {}

  static getInstance(): ClanWarzEngine {
    if (!ClanWarzEngine.instance) {
      ClanWarzEngine.instance = new ClanWarzEngine()
    }
    return ClanWarzEngine.instance
  }

  calculateClanWarzState(): ClanWarzState {
    const clans = clanEngine.getAllClans()
    const users = authEngine.getAllUsers()

    const regionDominance: Record<Region, RegionDominance> = {} as Record<Region, RegionDominance>
    
    REGIONS.forEach((region) => {
      const regionClans: ClanPresence[] = []
      const regionUsers = users.filter((u) => u.region === region && u.clanId)

      const clanScores = new Map<string, { clanId: string; clanTag: string; clanEmblem: string; score: number; members: number }>()

      regionUsers.forEach((user) => {
        if (user.clanId) {
          const clan = clans.find((c) => c.id === user.clanId)
          if (clan) {
            const existing = clanScores.get(user.clanId) || {
              clanId: user.clanId,
              clanTag: clan.tag,
              clanEmblem: clan.emblem,
              score: 0,
              members: 0,
            }
            existing.score += user.score
            existing.members += 1
            clanScores.set(user.clanId, existing)
          }
        }
      })

      const totalScore = Array.from(clanScores.values()).reduce((sum, c) => sum + c.score, 0)

      clanScores.forEach((clanData) => {
        regionClans.push({
          clanId: clanData.clanId,
          clanTag: clanData.clanTag,
          clanEmblem: clanData.clanEmblem,
          score: clanData.score,
          memberCount: clanData.members,
          percentage: totalScore > 0 ? (clanData.score / totalScore) * 100 : 0,
        })
      })

      regionClans.sort((a, b) => b.score - a.score)

      const dominantClan = regionClans[0]
      const activityLevel = Math.min(100, (regionUsers.length / 10) * 100)

      let color = REGION_COLORS.default
      if (dominantClan) {
        if (dominantClan.percentage > 60) {
          color = REGION_COLORS.dominated
        } else if (dominantClan.percentage > 30) {
          color = REGION_COLORS.contested
        }
      }

      regionDominance[region] = {
        region,
        dominantClanId: dominantClan?.clanId || null,
        dominantClanTag: dominantClan?.clanTag || null,
        dominanceScore: dominantClan?.percentage || 0,
        clanPresence: regionClans,
        activityLevel,
        color,
      }
    })

    const userPins: UserPin[] = users
      .filter((u) => u.clanId)
      .map((user) => {
        const basePos = REGION_POSITIONS[user.region]
        const randomOffset = {
          x: (Math.random() - 0.5) * 8,
          y: (Math.random() - 0.5) * 8,
        }

        const glowIntensity = Math.min(1, user.score / 10000)

        return {
          userId: user.id,
          username: user.username,
          avatar: user.avatar,
          clanId: user.clanId,
          clanTag: user.clanTag,
          region: user.region,
          score: user.score,
          position: {
            x: basePos.x + randomOffset.x,
            y: basePos.y + randomOffset.y,
          },
          glowIntensity,
        }
      })

    const clanInfluence: ClanInfluence[] = clans
      .filter((c) => c.members.length > 0)
      .map((clan) => {
        const clanRegions = new Set<Region>()
        const regionScores = new Map<Region, number>()

        users
          .filter((u) => u.clanId === clan.id)
          .forEach((user) => {
            clanRegions.add(user.region)
            const current = regionScores.get(user.region) || 0
            regionScores.set(user.region, current + user.score)
          })

        const primaryRegion = Array.from(regionScores.entries()).reduce(
          (max, [region, score]) => (score > (max.score || 0) ? { region, score } : max),
          { region: clan.region, score: 0 }
        ).region

        const influenceRadius = Math.min(15, 5 + clan.members.length * 0.5)

        return {
          clanId: clan.id,
          clanTag: clan.tag,
          clanEmblem: clan.emblem,
          totalScore: clan.score,
          regions: Array.from(clanRegions),
          primaryRegion,
          influenceRadius,
          color: this.getClanColor(clan.rank),
        }
      })

    const hotZones: HotZone[] = REGIONS.map((region) => {
      const regionData = regionDominance[region]
      const activityScore = regionData.activityLevel
      const recentTrades = Math.floor(activityScore / 10)
      const pulseIntensity = activityScore / 100

      return {
        region,
        activityScore,
        recentTrades,
        pulseIntensity,
      }
    }).filter((zone) => zone.activityScore > 20)

    return {
      regionDominance,
      userPins,
      clanInfluence,
      hotZones,
      lastUpdated: Date.now(),
    }
  }

  getLeaderboards(): ClanWarzLeaderboard {
    const clans = clanEngine.getAllClans()
    const users = authEngine.getAllUsers()

    const global: ClanRanking[] = clans.map((clan, index) => {
      const clanRegions = new Set<Region>()
      users
        .filter((u) => u.clanId === clan.id)
        .forEach((user) => clanRegions.add(user.region))

      const powerRating = this.calculatePowerRating(clan.score, clan.members.length, clanRegions.size)

      return {
        rank: index + 1,
        clanId: clan.id,
        clanTag: clan.tag,
        clanEmblem: clan.emblem,
        clanName: clan.name,
        score: clan.score,
        memberCount: clan.members.length,
        regions: Array.from(clanRegions),
        powerRating,
      }
    })

    const regional: Record<Region, ClanRanking[]> = {} as Record<Region, ClanRanking[]>

    REGIONS.forEach((region) => {
      const regionUsers = users.filter((u) => u.region === region && u.clanId)
      const clanScores = new Map<string, number>()

      regionUsers.forEach((user) => {
        if (user.clanId) {
          const current = clanScores.get(user.clanId) || 0
          clanScores.set(user.clanId, current + user.score)
        }
      })

      const rankings: ClanRanking[] = []
      clanScores.forEach((score, clanId) => {
        const clan = clans.find((c) => c.id === clanId)
        if (clan) {
          const memberCount = regionUsers.filter((u) => u.clanId === clanId).length
          const powerRating = this.calculatePowerRating(score, memberCount, 1)

          rankings.push({
            rank: 0,
            clanId: clan.id,
            clanTag: clan.tag,
            clanEmblem: clan.emblem,
            clanName: clan.name,
            score,
            memberCount,
            regions: [region],
            powerRating,
          })
        }
      })

      rankings.sort((a, b) => b.score - a.score)
      rankings.forEach((ranking, index) => {
        ranking.rank = index + 1
      })

      regional[region] = rankings
    })

    return { global, regional }
  }

  private calculatePowerRating(score: number, memberCount: number, regionCount: number): number {
    return Math.floor(score * 0.6 + memberCount * 100 * 0.3 + regionCount * 500 * 0.1)
  }

  private getClanColor(rank: number): string {
    if (rank <= 3) return 'oklch(0.80 0.20 80)'
    if (rank <= 10) return 'oklch(0.75 0.15 195)'
    if (rank <= 20) return 'oklch(0.70 0.25 340)'
    return 'oklch(0.65 0.15 220)'
  }
}

export const clanWarzEngine = ClanWarzEngine.getInstance()
