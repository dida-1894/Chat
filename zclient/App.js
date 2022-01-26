import React from 'react';
import { Chart } from './component/chat';
import { EditorContextProvider } from './component/context/editor-context';
import { SocketContextProvider } from './component/context/socket-context';

export const App = () => {
    return (
        <SocketContextProvider>
            <EditorContextProvider>
                <Chart />
            </EditorContextProvider>
        </SocketContextProvider>
    )
}