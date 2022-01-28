import React, { useEffect, useState } from 'react'
import { USER_CUSTOM } from '../../constant'
import { User } from '../../class/user'
import { useSocket } from '../../hook/useSocket'


export const UserContext = React.createContext(null)
export const UserContextProvider = (props) => {
    const [userInfo, setUserInfo] = useState()

    const socket = useSocket()
    useEffect(() => {
        if (!socket) return
        socket.emit(`login:${props.userType}`, socket.id)
        socket.on(`logined:${props.userType}`, userInfo => {
            const user = new User(userInfo.userID, socket)
            if (userInfo.type == USER_CUSTOM) user.setRoom(user.socket.id)
            else user.changeRoom = (roomID) => {
                user.socket.emit('room:goto', roomID, () => {
                    console.log('=====>', roomID)
                    setUserInfo({ ...user, roomID })
                })
            }

            setUserInfo(user)
        })
    }, [socket])

    if (!userInfo) return <div>登陆中</div>

    return <UserContext.Provider value={userInfo}>
        {props.children}
    </UserContext.Provider>
}