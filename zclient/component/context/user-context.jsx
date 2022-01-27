import React, { useEffect, useState } from 'react'
import { USER_SERVICE } from '../../constant'
import { Custom, Service } from '../../class/user'
import { useSocket } from '../../hook/useSocket'


export const UserContext = React.createContext(null)
export const UserContextProvider = (props) => {
    const [userInfo, setUserInfo] = useState()

    const socket = useSocket()
    useEffect(() => {
        if (!socket) return
        socket.emit(`login:${props.userType}`, socket.id)
        socket.on(`logined:${props.userType}`, userInfo => {
            if (userInfo.type == USER_SERVICE) setUserInfo(new Service(userInfo.userID, socket))
            else setUserInfo(new Custom(userInfo.userID, socket))
        })
    }, [socket])

    if (!userInfo) return <div>登陆中</div>

    return <UserContext.Provider value={userInfo}>
        {props.children}
    </UserContext.Provider>
}