import { useForm } from "antd/lib/form/Form"
import React, { useContext, useMemo } from "react"
import { SocketContext } from "./socket-context"

export const EditorContext = React.createContext(null)

export const EditorContextProvider = (props) => {
    const [form] = useForm()
    const socket = useContext(SocketContext)
    const editor = useMemo(() => {
        return {
            form,
            postMessage: (text) => {
                socket.emit('chat:message', {
                    value: text,
                    type: 'text',
                    date: +new Date(),
                })
            },
            uploadImg: (base64) => {
                socket.emit('chat:message', {
                    type: 'img',
                    value: base64,
                    date: +new Date(),
                })
            }
        }
    }, [socket])
    return <EditorContext.Provider value={editor}>
        {props.children}
    </EditorContext.Provider>
}