import { useContext, useEffect, useState } from "react"
import { UserContext } from "../context/user-context"

export const useRoom = () => {
    const [roomList, setRoomList] = useState([])
    const { socket } = useContext(UserContext)

    useEffect(() => {
        if (!socket) return

        socket.on('room:list', room => {
            setRoomList(room)
        })
        return () => {
            socket.off('room:list')
        }
    }, [socket])



    return roomList
}