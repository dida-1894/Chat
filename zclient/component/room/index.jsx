import React, { useContext } from 'react'
import { UserDispatchContext } from '../../context/user-context'
import './style.less'

export const RoomList = ({ roomList }) => {
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