import { useContext, useEffect, useState } from "react"
import { UserContext } from "../component/context/user-context"

export const useRoom = () => {
    const [roomList, setRoomList] = useState([])
    const { socket } = useContext(UserContext)

    useEffect(() => {
        if (!socket) return
        if (roomList.length == 0) socket.emit('room:list', ({ status, data }) => {
            if (status == 200)  setRoomList(data)
        })
        socket.on('room:list', room => {
            setRoomList(room)
        })
        // socket.on()
    }, [socket])



    return roomList
}