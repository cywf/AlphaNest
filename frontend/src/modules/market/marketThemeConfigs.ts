import type { MarketTheme, MarketThemeConfig, MarketLayout, MarketLayoutConfig } from './marketTypes'

export const MARKET_THEME_CONFIGS: Record<MarketTheme, MarketThemeConfig> = {
  cyan: {
    id: 'cyan',
    name: 'Neon Cyan',
    primaryColor: 'oklch(0.75 0.15 195)',
    secondaryColor: 'oklch(0.60 0.20 200)',
    accentColor: 'oklch(0.80 0.25 190)',
    glowColor: 'oklch(0.75 0.15 195 / 0.6)',
    borderStyle: 'glow-border',
    backgroundPattern: 'grid-bg',
  },
  magenta: {
    id: 'magenta',
    name: 'Hot Magenta',
    primaryColor: 'oklch(0.70 0.25 340)',
    secondaryColor: 'oklch(0.55 0.22 330)',
    accentColor: 'oklch(0.75 0.28 345)',
    glowColor: 'oklch(0.70 0.25 340 / 0.6)',
    borderStyle: 'glow-border-accent',
    backgroundPattern: 'grid-bg',
  },
  gold: {
    id: 'gold',
    name: 'Golden Hour',
    primaryColor: 'oklch(0.80 0.15 80)',
    secondaryColor: 'oklch(0.70 0.18 70)',
    accentColor: 'oklch(0.85 0.20 90)',
    glowColor: 'oklch(0.80 0.15 80 / 0.6)',
    borderStyle: 'glow-border',
    backgroundPattern: 'grid-bg',
  },
  glitch: {
    id: 'glitch',
    name: 'Glitch Matrix',
    primaryColor: 'oklch(0.65 0.25 160)',
    secondaryColor: 'oklch(0.70 0.20 340)',
    accentColor: 'oklch(0.75 0.15 195)',
    glowColor: 'oklch(0.65 0.25 160 / 0.6)',
    borderStyle: 'glow-border',
    backgroundPattern: 'grid-bg',
  },
}

export const MARKET_LAYOUTS: MarketLayoutConfig[] = [
  {
    id: 'grid',
    name: 'Neon Grid',
    description: 'Clean card grid layout with glow effects',
    icon: '◫',
  },
  {
    id: 'gallery',
    name: 'Holographic Gallery',
    description: 'Large showcase tiles with parallax',
    icon: '▦',
  },
  {
    id: 'terminal',
    name: 'Terminal Matrix',
    description: 'Command-line style interface',
    icon: '▣',
  },
]

export const RARITY_CONFIGS = {
  common: {
    label: 'Common',
    color: 'oklch(0.60 0.10 240)',
    glowColor: 'oklch(0.60 0.10 240 / 0.4)',
    borderWidth: '1px',
  },
  rare: {
    label: 'Rare',
    color: 'oklch(0.75 0.15 195)',
    glowColor: 'oklch(0.75 0.15 195 / 0.6)',
    borderWidth: '2px',
  },
  epic: {
    label: 'Epic',
    color: 'oklch(0.70 0.25 340)',
    glowColor: 'oklch(0.70 0.25 340 / 0.8)',
    borderWidth: '2px',
  },
  legendary: {
    label: 'Legendary',
    color: 'oklch(0.80 0.15 80)',
    glowColor: 'oklch(0.80 0.15 80 / 1)',
    borderWidth: '3px',
  },
}
