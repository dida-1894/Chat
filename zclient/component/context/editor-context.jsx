import { useForm } from "antd/lib/form/Form"
import React, { useContext, useMemo } from "react"
import { UserContext } from "./user-context"

export const EditorContext = React.createContext(null)

export const EditorContextProvider = (props) => {
    const [form] = useForm()
    const { socket, room: roomID, userID } = useContext(UserContext)

    const editor = useMemo(() => {
        return {
            form,
            postMessage: (text) => {
                socket.emit('chat:message', {
                    type: 'text',
                    value: text,
                    date: +new Date(),
                    roomID,
                    userID,
                })
            },
            uploadImg: (base64) => {
                socket.emit('chat:message', {
                    type: 'img',
                    value: base64,
                    date: +new Date(),
                    roomID,
                    userID,
                })
            }
        }
    }, [socket])
    return <EditorContext.Provider value={editor}>
        {props.children}
    </EditorContext.Provider>
}