import React from 'react'
import { MessageList } from '../message/list'
import { RoomList } from '../room'
import { Talk } from '../talk'
import './style.less'

export const ServiceChart = () => {
    return (
        <div className='service-app'>
            <RoomList />

            <div className='container'>
                <MessageList />
                <Talk />
            </div>
        </div>
    )
}
