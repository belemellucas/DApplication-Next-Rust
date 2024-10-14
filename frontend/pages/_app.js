import '../styles/globals.css'
import dyanmic from 'next/dynamic'
import '@solana/wallet-adapter-react-ui/styles.css'
//import { Provider } from "react-redux"
//import { createStore } from 'redux'
//import dadosReducer from '../hooks/useRedux'

//const store = createStore(dadosReducer)

function MyApp({ Component, pageProps }) {
  const WalletConnectionProvider = dyanmic(
    () => import ('../context/WalletConnectionProvider'),
    { ssr:false },
  )
  return (
    /*<Provider store={store}>*/
     <WalletConnectionProvider>
       <Component {...pageProps} />
     </WalletConnectionProvider>
    /* </Provider>*/
  )
 
}

export default MyApp
