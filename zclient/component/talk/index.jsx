import React, { useCallback, useContext, useEffect, useRef } from 'react'
import { Input, Form, message, Upload } from 'antd'
import { FileImageOutlined } from '@ant-design/icons'
import './style.less'
import { EditorContext } from '../../context/editor-context'

export const Talk = () => {
    const editor = useContext(EditorContext)
    const ref = useRef()

    const submit = useCallback(({ text }) => {
        if (!ref) return
        if (!text.trim()) return  message.warning('内容不能为空');
        editor.postMessage(text.trim())
        editor.form.resetFields(['text'])
        // console.log('======>')
        ref.current.focus({ cursor: 'first' })
    }, [editor, ref])

    useEffect(() => {
        if (!ref) return

        ref.current.focus({ cursor: 'first' })
    }, [])

    const uploadImg = useCallback((file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                editor.uploadImg(reader.result)
                resolve(reader.result)
            };
            reader.onerror = error => reject(error);
        });
    }, [editor])

    return <div className='talk'>
        <Form form={editor.form} onFinish={submit}>
            <div className='tools'>
                <Upload action={uploadImg} showUploadList={false} accept='.jpg, .jpeg, .png, .svg'>
                    <FileImageOutlined className='item' />
                </Upload>
            </div>
            <Form.Item name='text' initialValue=''>
                <Input.TextArea
                    autoSize={{maxRows: 4, minRows: 4}}
                    showCount
                    ref={ref}
                    maxLength={130}
                    bordered={false}
                    onPressEnter={editor.form.submit}
                />
            </Form.Item>
        </Form>
    </div>
}