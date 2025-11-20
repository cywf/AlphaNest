import { useState, useEffect, useCallback } from 'react'
import { metamaskConnector } from './metamaskConnector'
import type { WalletState } from './metamaskTypes'

export function useMetaMask() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: null,
    isMetaMaskInstalled: metamaskConnector.isInstalled(),
    chainId: null,
  })
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkConnection = async () => {
      const accounts = await metamaskConnector.getAccounts()
      const chainId = await metamaskConnector.getChainId()

      setWalletState({
        isConnected: accounts.length > 0,
        address: accounts[0] || null,
        isMetaMaskInstalled: metamaskConnector.isInstalled(),
        chainId,
      })
    }

    checkConnection()

    const unsubscribe = metamaskConnector.subscribe('stateChange', (state) => {
      setWalletState(state)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const connect = useCallback(async () => {
    if (!walletState.isMetaMaskInstalled) {
      setError('MetaMask is not installed. Please install MetaMask to continue.')
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const address = await metamaskConnector.connect()
      const chainId = await metamaskConnector.getChainId()

      setWalletState({
        isConnected: true,
        address,
        isMetaMaskInstalled: true,
        chainId,
      })
    } catch (err: any) {
      setError(err.message || 'Failed to connect to MetaMask')
      console.error('MetaMask connection error:', err)
    } finally {
      setIsConnecting(false)
    }
  }, [walletState.isMetaMaskInstalled])

  const disconnect = useCallback(() => {
    metamaskConnector.disconnect()
    setWalletState({
      isConnected: false,
      address: null,
      isMetaMaskInstalled: metamaskConnector.isInstalled(),
      chainId: null,
    })
  }, [])

  return {
    ...walletState,
    isConnecting,
    error,
    connect,
    disconnect,
  }
}
