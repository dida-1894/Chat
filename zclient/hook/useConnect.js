import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export const useConnect = () => {
    const [socket, setSocket] = useState()
    useEffect(() => {
        let socket = io('http://localhost:3200')
        socket.on("connect", () => {
            setSocket(socket)
            console.log(socket.id);
        });
    }, [])
    return socket
}