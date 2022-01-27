import { useEffect, useState } from 'react';
import { io } from 'socket.io-client'

export const useSocket = () => {
    const [socket, setSocket] = useState()
    useEffect(() => {
        let socket = io('http://localhost:3200')
        socket.on("connect", () => {
            setSocket(socket)
        });
        return () => {
            socket.disconnect()
        }
    }, [])

    return socket
}