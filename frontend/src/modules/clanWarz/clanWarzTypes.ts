import type { Region } from '../users/userTypes'

export interface ClanWarzState {
  regionDominance: Record<Region, RegionDominance>
  userPins: UserPin[]
  clanInfluence: ClanInfluence[]
  hotZones: HotZone[]
  lastUpdated: number
}

export interface RegionDominance {
  region: Region
  dominantClanId: string | null
  dominantClanTag: string | null
  dominanceScore: number
  clanPresence: ClanPresence[]
  activityLevel: number
  color: string
}

export interface ClanPresence {
  clanId: string
  clanTag: string
  clanEmblem: string
  score: number
  memberCount: number
  percentage: number
}

export interface UserPin {
  userId: string
  username: string
  avatar: string
  clanId: string | null
  clanTag: string | null
  region: Region
  score: number
  position: { x: number; y: number }
  glowIntensity: number
}

export interface ClanInfluence {
  clanId: string
  clanTag: string
  clanEmblem: string
  totalScore: number
  regions: Region[]
  primaryRegion: Region
  influenceRadius: number
  color: string
}

export interface HotZone {
  region: Region
  activityScore: number
  recentTrades: number
  pulseIntensity: number
}

export interface ClanWarzLeaderboard {
  global: ClanRanking[]
  regional: Record<Region, ClanRanking[]>
}

export interface ClanRanking {
  rank: number
  clanId: string
  clanTag: string
  clanEmblem: string
  clanName: string
  score: number
  memberCount: number
  regions: Region[]
  powerRating: number
}

export const REGION_POSITIONS: Record<Region, { x: number; y: number }> = {
  'north-america': { x: 20, y: 35 },
  'south-america': { x: 30, y: 65 },
  'europe': { x: 50, y: 30 },
  'africa': { x: 52, y: 55 },
  'middle-east': { x: 58, y: 40 },
  'asia-south': { x: 68, y: 48 },
  'asia-east': { x: 78, y: 38 },
  'oceania': { x: 82, y: 70 },
}

export const REGION_COLORS: Record<string, string> = {
  default: 'oklch(0.75 0.15 195)',
  contested: 'oklch(0.70 0.25 340)',
  dominated: 'oklch(0.80 0.15 80)',
}
