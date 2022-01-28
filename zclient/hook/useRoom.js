import { useContext, useEffect, useState } from "react"
import { UserContext } from "../component/context/user-context"

export const useRoom = () => {
    const [roomList, setRoomList] = useState([])
    const { socket } = useContext(UserContext)

    useEffect(() => {
        if (!socket) return

        socket.on('room:list', room => {
            setRoomList(room)
        })
        // socket.on()
    }, [socket])



    return roomList
}