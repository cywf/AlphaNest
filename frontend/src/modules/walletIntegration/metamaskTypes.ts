export interface MetaMaskWindow extends Window {
  ethereum?: MetaMaskEthereum
}

export interface MetaMaskEthereum {
  isMetaMask?: boolean
  request: (args: MetaMaskRequest) => Promise<any>
  on?: (event: string, handler: (...args: any[]) => void) => void
  removeListener?: (event: string, handler: (...args: any[]) => void) => void
  selectedAddress?: string | null
}

export interface MetaMaskRequest {
  method: string
  params?: any[]
}

export interface WalletState {
  isConnected: boolean
  address: string | null
  isMetaMaskInstalled: boolean
  chainId: string | null
}

export interface NFTMetadata {
  id: string
  contractAddress: string
  tokenId: string
  name: string
  description: string
  image: string
  collection: string
  chain: string
}

export interface TransactionRequest {
  to: string
  from: string
  value?: string
  data?: string
  gas?: string
}

export interface SignatureRequest {
  message: string
  address: string
}
