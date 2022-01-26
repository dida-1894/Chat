import { Spin } from 'antd'
import React, { useContext } from 'react'
import { SocketContext } from '../context/socket-context'
import { MessageList } from '../message/list'
import { Talk } from '../talk'
import './style.less'

export const Chart = () => {
    const io = useContext(SocketContext)

    if (!io) return <Spin />

    return <div className='container'>
        <MessageList />
        <Talk />
    </div>
}