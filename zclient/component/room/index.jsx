import React, { useContext } from 'react'
import { useRoom } from '../../hook/useRoom'
import { UserDispatchContext } from '../context/user-context'
import './style.less'

export const RoomList = () => {
    const roomList = useRoom()
    const changeRoom = useContext(UserDispatchContext)
    if (!changeRoom) return null
    return (
        <div className='room'>
            {roomList.map(r =>
                <div onClick={() => {
                    changeRoom(r)
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