import { useContext, useEffect, useState } from "react"
import { SocketContext } from "../component/context/socket-context"


export const useMessageList = () => {
    const socket = useContext(SocketContext)
    const [list, setList] = useState([])
    useEffect(() => {
        if (!socket) return
        socket.on('chat:message', (msg) => {
            list.push(msg)
            setList([...list])
            console.log(msg)
        })
    }, [socket])

    return [list]
}