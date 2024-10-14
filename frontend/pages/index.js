import MainView from '../pages/components/MainView'
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'

export default function Home() {
  const { connected } = useWallet()

  return (
    <div className="app">
    {connected ? (
       <MainView />
    ) : (
      <div className='loginContainer'>
        <div className='loginTitle'>Login in Twitter
        </div>
        <div className='loginSubtitle'>
          Manage your account, check nofitications, comment
          on videos, mode
        </div>
        <WalletMultiButton/>
      </div>
    )}
    </div>
  )
}
