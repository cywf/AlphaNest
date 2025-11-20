export interface User {
  id: string
  username: string
  email: string
  passwordHash?: string
  avatar: string
  avatarType: 'preset' | 'custom'
  bio: string
  region: Region
  clanId: string | null
  clanTag: string | null
  shopTheme: ShopTheme
  createdAt: number
  score: number
  rankedScore: number
  casualScore: number
  arbitrageVolume: number
  isOnline: boolean
}

export type Region =
  | 'north-america'
  | 'south-america'
  | 'europe'
  | 'asia-east'
  | 'asia-south'
  | 'middle-east'
  | 'africa'
  | 'oceania'

export const REGIONS: Region[] = [
  'north-america',
  'south-america',
  'europe',
  'asia-east',
  'asia-south',
  'middle-east',
  'africa',
  'oceania',
]

export const REGION_NAMES: Record<Region, string> = {
  'north-america': 'North America',
  'south-america': 'South America',
  'europe': 'Europe',
  'asia-east': 'East Asia',
  'asia-south': 'South Asia',
  'middle-east': 'Middle East',
  'africa': 'Africa',
  'oceania': 'Oceania',
}

export type ShopTheme = 'cyan' | 'magenta' | 'gold' | 'glitch'

export const SHOP_THEMES: ShopTheme[] = ['cyan', 'magenta', 'gold', 'glitch']

export const SHOP_THEME_NAMES: Record<ShopTheme, string> = {
  cyan: 'Neon Cyan',
  magenta: 'Hot Magenta',
  gold: 'Golden Hour',
  glitch: 'Glitch Matrix',
}

export interface UserSession {
  userId: string
  username: string
  token: string
  expiresAt: number
}

export interface SignupData {
  username: string
  email: string
  password: string
  avatar: string
  avatarType: 'preset' | 'custom'
  bio: string
  region: Region
}

export interface LoginData {
  username: string
  password: string
}
