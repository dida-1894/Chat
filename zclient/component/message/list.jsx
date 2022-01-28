import React, { useContext, useEffect, useRef } from 'react'
import './style.less'
import { useMessageList } from '../../hook/useMessageList'
import { UserContext } from '../context/user-context'
import { Image } from 'antd'
import { MESSAGE_TYPE } from '../../constant'

export const MessageList = () => {
    const { userID } = useContext(UserContext)
    const [messageList] = useMessageList()
    const ref = useRef()
    useEffect(() => {
        if (!ref.current) return
        ref.current.scrollTop = ref.current.scrollHeight - 350
    }, [messageList])
    return (
        <div className='scroll-container' ref={ref} id="s">
            <div className='message-list'>
                {messageList.map((item) => {
                    const { type, date, value, userID: id } = item
        
                    return (
                        <div className={`item-container ${userID == id ? 'to' : 'from'}`} key={id+date}>
                            <div className={`item ${userID == id ? 'to' : 'from'}`}>{
                                type == MESSAGE_TYPE.IMG ? <Image src={value} /> : String(value)
                            }</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}