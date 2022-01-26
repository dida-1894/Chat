import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client'


export const SocketContext = React.createContext(null)
export const SocketContextProvider = (props) => {
    const [socket, setSocket] = useState()
    useEffect(() => {
        let socket = io('http://localhost:3200')
        socket.on("connect", () => {
            setSocket(socket)
            console.log(socket.id);
        });
        return () => {
            socket.disconnect()
        }
    }, [])

    return <SocketContext.Provider value={socket}>
        {props.children}
    </SocketContext.Provider>
}
