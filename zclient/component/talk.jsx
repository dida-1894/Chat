import { Button, Input } from 'antd'
import React, { useCallback, useRef } from 'react'

export const Talk = () => {
    const input = useRef()
    const submit = useCallback(() => {
        if (!input.current) return
        const text = input.current
        console.log(text)
    }, [])
    return <div>
        <Input ref={input} />
        <Button onClick={submit}>发送</Button>
    </div>
}