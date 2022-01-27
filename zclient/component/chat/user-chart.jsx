import React from 'react'
import { MessageList } from '../message/list'
import { Talk } from '../talk'
import './style.less'

export const Chart = () => {

    return <div className='container'>
        <MessageList />
        <Talk />
    </div>
}