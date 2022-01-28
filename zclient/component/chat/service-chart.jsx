import React, { useContext } from 'react'
import { MessageList } from '../message/list'
import { RoomList } from '../room'
import { Talk } from '../talk'
import { Alert } from 'antd'
import { useRoom } from '../../hook/useRoom'
import './style.less'
import { UserContext } from '../context/user-context'

export const ServiceChart = () => {
    const roomList = useRoom()
    const service = useContext(UserContext)
    return (
        <div className='service-app'>
            <div className='notice'>
                {roomList.length == 0
                    ? <Alert type='success' message='您暂时没有需要服务的用户休息一下吧' />
                    : !service.roomID ? <Alert type='warning' message='请快速响应您左边的用户' />
                    : <Alert type='warning' message={'您正在回应' + service.roomID + '的用户'} />
                }
            </div>
            <RoomList roomList={roomList} />

            <div className='container'>
                <MessageList />
                <Talk />
            </div>
        </div>
    )
}
