import { useEffect, useState } from "react"
import { io } from "socket.io-client"

export const useMessageList = () => {
    const [list, setList] = useState([])
    useEffect(() => {
        console.log('====> ', io)
    }, [])

    return [list]
}