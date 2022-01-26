import React from 'react'
import { useConnect } from '../../hook/useConnect'
import { useMessageList } from '../../hook/useMessageList'
import { Talk } from '../talk'
import { Spin as Loading  } from 'antd'
const MessageList = () => {
    const [messageList] = useMessageList()

    return <div>
        {messageList.map((item, i) => <div k={i}>{item}</div>)}
    </div>
}
export const Chart = () => {
    const io = useConnect()
    if (!io) return <Loading />

    return <div>
        <MessageList />
        <Talk />
    </div>
}