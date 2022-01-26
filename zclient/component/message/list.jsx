import React from 'react'
import './style.less'
import { useMessageList } from '../../hook/useMessageList'

const Item = (msg) => {
    return (
        <div></div>
    )
}

export const MessageList = () => {
    const [messageList] = useMessageList()

    return <div className='message-list'>
        {messageList.map((item) => <div k={item.date}>{item.text}</div>)}
    </div>
}