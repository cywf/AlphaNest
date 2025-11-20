import type { ShowcaseItem, ShopTheme, ShopLayout } from '../users/shopThemes'

export interface UserShop {
  userId: string
  username: string
  theme: ShopTheme
  layout: ShopLayout
  showcaseItems: ShowcaseItem[]
  customTitle: string
  customDescription: string
  createdAt: number
  updatedAt: number
}

export interface ShopSettings {
  theme: ShopTheme
  layout: ShopLayout
  customTitle: string
  customDescription: string
}
