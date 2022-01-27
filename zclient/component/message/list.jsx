import React, { useContext } from 'react'
import './style.less'
import { useMessageList } from '../../hook/useMessageList'
import { UserContext } from '../context/user-context'

export const MessageList = () => {
    const [messageList] = useMessageList()
    const { userID } = useContext(UserContext)

    return <div className='message-list'>
        {messageList.map((item) => {
            const { type, date, value, userID: id } = item
            if (type == 'img') return <img src={value} />
            return (
                <div className='item-container' key={item.date+item.user}>
                    <div className={`item ${userID == id ? 'to' : 'from'}`}>{value}</div>
                </div>
            )
        })}
    </div>
}