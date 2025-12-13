import { FC, ReactNode } from 'react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'

interface WalletModalWrapperProps {
    children: ReactNode
}

/**
 * Simple wrapper around WalletModalProvider
 */
export const WalletModalWrapper: FC<WalletModalWrapperProps> = ({ children }) => {
    return (
        <WalletModalProvider>
            {children}
        </WalletModalProvider>
    )
}


