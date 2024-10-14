import React from 'react'
import Signup from './Signup'
import styles from "../../styles/MainView.module.css"
import { useEffect, useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { SOLANA_HOST } from '../../utils/const'
import { getProgramInstance } from '../../utils/utils'
import { TOKEN_PROGRAM_ID } from '@project-serum/anchor/dist/cjs/utils/token'
import useTiktok from '../../hooks/useTiktok'
import useAccount from '../../hooks/useAccount'
import Video from "./Video"
import Comments from "./Comments"
import BottomBar from './BottonBar'
import UploadModal from './UploadModal'

const anchor = require('@project-serum/anchor')
const utf8 = anchor.utils.bytes.utf8
const { BN, web3 } = anchor
const { SystemProgram } = web3 

const defaultAccounts = {
    tokenProgram: TOKEN_PROGRAM_ID, 
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    systemProgram: SystemProgram.programId,
}

let isAccount = false

export default function MainView(){
    const [isAccount, setAccount] = useState(false)
    const wallet = useWallet()
    const connection = new anchor.web3.Connection(SOLANA_HOST)

    const program = getProgramInstance(connection, wallet)
    
    const [tiktoks, setTiktoks] = useState()
    const [newVideoShow, setNewVideoShow] = useState(false)
    const [description, setDescription] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [userDetail, setUserDetail] = useState()

    const { signup } = useAccount()
    const { getTiktoks, likeVideo, createComment, newVideo, getComments } = useTiktok(
        setTiktoks,
        userDetail,
        videoUrl,
        description,
        setDescription,
        setVideoUrl,
        setNewVideoShow
    )

    useEffect(()=> {
        if(wallet.connected){
            checkAccount()
            getTiktoks()
        }
    }, [wallet.connected])

    useEffect(() => {
        const intervalId = setInterval(() => {
          getTiktoks();
          checkAccount()
        },1000)
    
        // clear interval on re-render to avoid memory leaks
        return () => clearInterval(intervalId)
      })

    const checkAccount = async () => {
        let [user_pda] = await anchor.web3.PublicKey.findProgramAddress(
            [utf8.encode('user'), wallet.publicKey.toBuffer()],
            program.programId,
        )
        try {
           const userInfo = await program.account.userAccount.fetch(user_pda)
           setUserDetail(userInfo)
           setAccount(true)
        } catch(e) {
            setAccount(false)
        }
    }

    return (
            <>
            {isAccount ? (
                <div>
                    {newVideoShow && (
                        <UploadModal 
                        description = {description}
                        videoUrl = {videoUrl}
                        newVideo = {newVideo}
                        setDescription = {setDescription}
                        setVideoUrl = {setVideoUrl}
                        setNewVideoShow = {setNewVideoShow}
                        />
                    )}
                    <div className={styles.appVideos}>
                        {tiktoks?.length === 0 ? (
                            <h1>No Videos</h1>
                        ) : (
                            tiktoks?.map((tiktok,id)=> (
                                
                                <Video 
                                key = {id}
                                address = {tiktok.publicKey.toBase58()}
                                url = {tiktok.account.videoUrl}
                                channel = {tiktok.account.creatorName}
                                index = {tiktok.account.index.toNumber()}
                                likes = {tiktok.account.likes}
                                description = {tiktok.account.description}
                                likeVideo = {likeVideo}
                                likesAddress = {tiktok.account.peopleWhoLiked}
                                createComment = {createComment}
                                getComments = {getComments}
                                commentCount = {tiktok.account.commentCount.toNumber()}
 
                                />
                            )
                            )
                        )}
                    </div>
                    <BottomBar
                    setNewVideoShow = {setNewVideoShow}
                    getTiktoks = {getTiktoks}
                    />
                </div>
            ) : (
                <Signup signup = {signup} wallet = {wallet.publicKey.toBase58}/>
            )}
            </>
    )
}