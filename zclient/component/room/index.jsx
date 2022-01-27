import React, { useContext } from 'react'
import { useRoom } from '../../hook/useRoom'
import { UserContext } from '../context/user-context'
import './style.less'

export const RoomList = () => {
    const roomList = useRoom()
    const service = useContext(UserContext)
    return (
        <div className='room'>
            {roomList.map(r =>
                <div onClick={() => {
                    service.changeRoom(r)
                }}
                className='item'
                key={r}
                >
                    {r}
                </div>
            )}
        </div>
    )
}