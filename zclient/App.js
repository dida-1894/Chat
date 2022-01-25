import React from 'react';
import { Message } from './component/message';

export const App = () => {
    const msgList = ['duds', 'dshf']
    return <div>
        {msgList.map(m => (<Message msg={m} key={m} />))}
    </div>
}