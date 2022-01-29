import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/user-context"


export const useMessageList = () => {
    const { socket } = useContext(UserContext)
    const [list, setList] = useState([])

    useEffect(() => {
        if (!socket) return

        socket.on('chat:message', (m) => {
            if (Array.isArray(m)) return console.log('====> type err')
            list.push(m)
            setList([...list])
        })
        socket.on('chart:history', (l) => {
            setList(l)
        })

        return () => {
            socket.off('chart:history')
            socket.off('chat:message')
        }
    }, [socket, list])

    return [list]
}