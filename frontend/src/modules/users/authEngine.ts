import type { User, UserSession, SignupData, LoginData } from './userTypes'
import { AVATAR_PRESETS } from './avatarPresets'

const USERS_KEY = 'crypto_arbitrage_users'
const SESSION_KEY = 'crypto_arbitrage_session'

export class AuthEngine {
  private static instance: AuthEngine

  private constructor() {}

  static getInstance(): AuthEngine {
    if (!AuthEngine.instance) {
      AuthEngine.instance = new AuthEngine()
    }
    return AuthEngine.instance
  }

  private getUsers(): User[] {
    const stored = localStorage.getItem(USERS_KEY)
    return stored ? JSON.parse(stored) : []
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  private hashPassword(password: string): string {
    let hash = 0
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash
    }
    return hash.toString(36)
  }

  signup(data: SignupData): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers()

    if (users.some((u) => u.username.toLowerCase() === data.username.toLowerCase())) {
      return { success: false, error: 'Username already taken' }
    }

    if (users.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
      return { success: false, error: 'Email already registered' }
    }

    if (data.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' }
    }

    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username: data.username,
      email: data.email,
      passwordHash: this.hashPassword(data.password),
      avatar: data.avatar,
      avatarType: data.avatarType,
      bio: data.bio,
      region: data.region,
      clanId: null,
      clanTag: null,
      shopTheme: 'cyan',
      createdAt: Date.now(),
      score: 0,
      rankedScore: 0,
      casualScore: 0,
      arbitrageVolume: 0,
      isOnline: false,
    }

    users.push(user)
    this.saveUsers(users)

    return { success: true, user }
  }

  login(data: LoginData): { success: boolean; session?: UserSession; error?: string } {
    const users = this.getUsers()
    const user = users.find((u) => u.username.toLowerCase() === data.username.toLowerCase())

    if (!user) {
      return { success: false, error: 'Invalid username or password' }
    }

    const passwordHash = this.hashPassword(data.password)
    if (user.passwordHash !== passwordHash) {
      return { success: false, error: 'Invalid username or password' }
    }

    const session: UserSession = {
      userId: user.id,
      username: user.username,
      token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(session))

    user.isOnline = true
    this.saveUsers(users)

    return { success: true, session }
  }

  logout(): void {
    const session = this.getSession()
    if (session) {
      const users = this.getUsers()
      const user = users.find((u) => u.id === session.userId)
      if (user) {
        user.isOnline = false
        this.saveUsers(users)
      }
    }
    localStorage.removeItem(SESSION_KEY)
  }

  getSession(): UserSession | null {
    const stored = localStorage.getItem(SESSION_KEY)
    if (!stored) return null

    const session: UserSession = JSON.parse(stored)

    if (session.expiresAt < Date.now()) {
      this.logout()
      return null
    }

    return session
  }

  getCurrentUser(): User | null {
    const session = this.getSession()
    if (!session) return null

    const users = this.getUsers()
    return users.find((u) => u.id === session.userId) || null
  }

  updateUser(userId: string, updates: Partial<User>): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers()
    const index = users.findIndex((u) => u.id === userId)

    if (index === -1) {
      return { success: false, error: 'User not found' }
    }

    if (updates.username && updates.username !== users[index].username) {
      if (users.some((u) => u.username.toLowerCase() === updates.username!.toLowerCase())) {
        return { success: false, error: 'Username already taken' }
      }
    }

    users[index] = { ...users[index], ...updates }
    this.saveUsers(users)

    return { success: true, user: users[index] }
  }

  getUserById(userId: string): User | null {
    const users = this.getUsers()
    return users.find((u) => u.id === userId) || null
  }

  getUserByUsername(username: string): User | null {
    const users = this.getUsers()
    return users.find((u) => u.username.toLowerCase() === username.toLowerCase()) || null
  }

  getAllUsers(): User[] {
    return this.getUsers()
  }

  incrementUserScore(userId: string, points: number): void {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId)
    if (user) {
      user.score += points
      user.arbitrageVolume += points * 100
      this.saveUsers(users)
    }
  }

  incrementCasualScore(userId: string, points: number): void {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId)
    if (user) {
      user.casualScore += points
      user.score += points
      this.saveUsers(users)
    }
  }

  incrementRankedScore(userId: string, points: number): void {
    const users = this.getUsers()
    const user = users.find((u) => u.id === userId)
    if (user) {
      user.rankedScore += points
      user.score += points
      this.saveUsers(users)
    }
  }

  initializeDemoUsers(): void {
    const users = this.getUsers()
    if (users.length > 0) return

    const demoUsers: User[] = [
      {
        id: 'demo_user_1',
        username: 'CyberSamurai',
        email: 'cyber@example.com',
        passwordHash: this.hashPassword('demo123'),
        avatar: AVATAR_PRESETS[0].emoji,
        avatarType: 'preset',
        bio: 'Elite trader from the neon streets of Neo Tokyo',
        region: 'asia-east',
        clanId: null,
        clanTag: null,
        shopTheme: 'cyan',
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        score: 15420,
        rankedScore: 12340,
        casualScore: 3080,
        arbitrageVolume: 1542000,
        isOnline: true,
      },
      {
        id: 'demo_user_2',
        username: 'NeonPhantom',
        email: 'phantom@example.com',
        passwordHash: this.hashPassword('demo123'),
        avatar: AVATAR_PRESETS[2].emoji,
        avatarType: 'preset',
        bio: 'Ghost in the machine, master of the arbitrage game',
        region: 'north-america',
        clanId: null,
        clanTag: null,
        shopTheme: 'magenta',
        createdAt: Date.now() - 45 * 24 * 60 * 60 * 1000,
        score: 22850,
        rankedScore: 18280,
        casualScore: 4570,
        arbitrageVolume: 2285000,
        isOnline: true,
      },
      {
        id: 'demo_user_3',
        username: 'QuantumHacker',
        email: 'quantum@example.com',
        passwordHash: this.hashPassword('demo123'),
        avatar: AVATAR_PRESETS[3].emoji,
        avatarType: 'preset',
        bio: 'Hacking the matrix, one arbitrage at a time',
        region: 'europe',
        clanId: null,
        clanTag: null,
        shopTheme: 'gold',
        createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
        score: 8960,
        rankedScore: 7168,
        casualScore: 1792,
        arbitrageVolume: 896000,
        isOnline: false,
      },
    ]

    this.saveUsers(demoUsers)
  }
}

export const authEngine = AuthEngine.getInstance()
