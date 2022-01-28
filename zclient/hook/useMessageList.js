import { useContext, useEffect, useState } from "react"
import { UserContext } from "../component/context/user-context"


export const useMessageList = () => {
    const { socket } = useContext(UserContext)
    const [list, setList] = useState([])
    useEffect(() => {
        if (!socket) return
        socket.on('chat:message', (msgList) => {
            setList(msgList)
            console.log('=====> msgList', msgList)
        })
    }, [socket])

    return [list]
}