import React, { useCallback, useContext } from 'react'
import { Input, Button, Form, message, Upload } from 'antd'
import { FileImageOutlined } from '@ant-design/icons'
import './style.less'
import { EditorContext } from '../context/editor-context'

export const Talk = () => {
    const editor = useContext(EditorContext)

    const submit = useCallback(({ text }) => {
        if (!text) return  message.warning('内容不能为空');
        editor.postMessage(text)
        editor.form.resetFields(['text'])
    }, [editor])

    const uploadImg = useCallback((file) => {
        console.log(file)
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // console.log(reader.result)
                editor.uploadImg(reader.result)
                resolve(reader.result)
            };
            reader.onerror = error => reject(error);
        });
    }, [editor])

    return <div className='talk'>
        <Form form={editor.form} onFinish={submit}>
            <div className='tools'>
                <Upload action={uploadImg} showUploadList={false}>
                    <FileImageOutlined className='item' />
                </Upload>
            </div>
            <Form.Item name='text'>
                <Input.TextArea
                    autoSize={{maxRows: 4, minRows: 4}}
                    showCount
                    maxLength={130}
                    bordered={false}
                />
            </Form.Item>
            <Button onClick={editor.form.submit}>发送</Button>
        </Form>
    </div>
}