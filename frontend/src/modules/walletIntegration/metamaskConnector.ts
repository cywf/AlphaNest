import type {
  MetaMaskWindow,
  MetaMaskEthereum,
  WalletState,
  NFTMetadata,
  TransactionRequest,
  SignatureRequest,
} from './metamaskTypes'

class MetaMaskConnector {
  private ethereum: MetaMaskEthereum | null = null
  private listeners: Map<string, Set<(state: WalletState) => void>> = new Map()

  constructor() {
    if (typeof window !== 'undefined') {
      const win = window as MetaMaskWindow
      this.ethereum = win.ethereum || null
      this.setupEventListeners()
    }
  }

  private setupEventListeners() {
    if (!this.ethereum?.on) return

    this.ethereum.on('accountsChanged', (accounts: string[]) => {
      this.notifyListeners({
        isConnected: accounts.length > 0,
        address: accounts[0] || null,
        isMetaMaskInstalled: this.isInstalled(),
        chainId: null,
      })
    })

    this.ethereum.on('chainChanged', (chainId: string) => {
      console.log('Chain changed:', chainId)
      window.location.reload()
    })

    this.ethereum.on('disconnect', () => {
      this.notifyListeners({
        isConnected: false,
        address: null,
        isMetaMaskInstalled: this.isInstalled(),
        chainId: null,
      })
    })
  }

  private notifyListeners(state: WalletState) {
    this.listeners.get('stateChange')?.forEach((callback) => callback(state))
  }

  public subscribe(event: string, callback: (state: WalletState) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(callback)

    return () => {
      this.listeners.get(event)?.delete(callback)
    }
  }

  public isInstalled(): boolean {
    return Boolean(this.ethereum?.isMetaMask)
  }

  public async connect(): Promise<string | null> {
    if (!this.isInstalled()) {
      throw new Error('MetaMask is not installed')
    }

    try {
      const accounts = await this.ethereum!.request({
        method: 'eth_requestAccounts',
      })

      if (accounts && accounts.length > 0) {
        return accounts[0]
      }
      return null
    } catch (error) {
      console.error('Failed to connect to MetaMask:', error)
      throw error
    }
  }

  public async getAccounts(): Promise<string[]> {
    if (!this.isInstalled()) return []

    try {
      const accounts = await this.ethereum!.request({
        method: 'eth_accounts',
      })
      return accounts || []
    } catch (error) {
      console.error('Failed to get accounts:', error)
      return []
    }
  }

  public async getChainId(): Promise<string | null> {
    if (!this.isInstalled()) return null

    try {
      const chainId = await this.ethereum!.request({
        method: 'eth_chainId',
      })
      return chainId
    } catch (error) {
      console.error('Failed to get chain ID:', error)
      return null
    }
  }

  public async signTransaction(transaction: TransactionRequest): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('MetaMask is not installed')
    }

    try {
      const txHash = await this.ethereum!.request({
        method: 'eth_sendTransaction',
        params: [transaction],
      })
      return txHash
    } catch (error) {
      console.error('Failed to sign transaction:', error)
      throw error
    }
  }

  public async signMessage(request: SignatureRequest): Promise<string> {
    if (!this.isInstalled()) {
      throw new Error('MetaMask is not installed')
    }

    try {
      const signature = await this.ethereum!.request({
        method: 'personal_sign',
        params: [request.message, request.address],
      })
      return signature
    } catch (error) {
      console.error('Failed to sign message:', error)
      throw error
    }
  }

  public async getNFTs(address: string): Promise<NFTMetadata[]> {
    console.log('[PLACEHOLDER] Fetching NFTs for address:', address)
    
    return [
      {
        id: 'nft-1',
        contractAddress: '0x1234...5678',
        tokenId: '1',
        name: 'CyberPunk Trader #1',
        description: 'Rare genesis trader NFT',
        image: 'https://placehold.co/400x400/1a1a2e/63dcff?text=NFT+1',
        collection: 'Alpha Traders',
        chain: 'ethereum',
      },
      {
        id: 'nft-2',
        contractAddress: '0xabcd...ef01',
        tokenId: '42',
        name: 'Digital Asset #42',
        description: 'Limited edition digital collectible',
        image: 'https://placehold.co/400x400/1a1a2e/ff006e?text=NFT+2',
        collection: 'Digital Assets',
        chain: 'ethereum',
      },
    ]
  }

  public async sendNFT(
    from: string,
    to: string,
    contractAddress: string,
    tokenId: string
  ): Promise<string> {
    console.log('[PLACEHOLDER] Sending NFT:', {
      from,
      to,
      contractAddress,
      tokenId,
    })

    await new Promise((resolve) => setTimeout(resolve, 1500))
    
    return '0xabcdef1234567890'
  }

  public async tradeOnArbScan(
    tokenAddress: string,
    amount: string,
    fromExchange: string,
    toExchange: string
  ): Promise<string> {
    console.log('[PLACEHOLDER] Executing ArbScan trade:', {
      tokenAddress,
      amount,
      fromExchange,
      toExchange,
    })

    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    return '0x9876543210fedcba'
  }

  public async marketPurchaseNFT(
    nftId: string,
    price: string,
    sellerAddress: string
  ): Promise<string> {
    console.log('[PLACEHOLDER] Purchasing NFT from market:', {
      nftId,
      price,
      sellerAddress,
    })

    await new Promise((resolve) => setTimeout(resolve, 2000))
    
    return '0x1111222233334444'
  }

  public disconnect() {
    this.notifyListeners({
      isConnected: false,
      address: null,
      isMetaMaskInstalled: this.isInstalled(),
      chainId: null,
    })
  }
}

export const metamaskConnector = new MetaMaskConnector()
