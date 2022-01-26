import React from 'react'
import './style.less'
import { useMessageList } from '../../hook/useMessageList'

const Item = ({ item }) => {
    const { type, date, value } = item
    if (type == 'img') return <img src={value} />
    return (
        <div>{value}</div>
    )
}

export const MessageList = () => {
    const [messageList] = useMessageList()

    return <div className='message-list'>
        {messageList.map((item) => <Item item={item} key={item.date} />)}
    </div>
}