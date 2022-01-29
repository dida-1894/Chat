# Chat

## 运行
```sh
npm i
npm run build
npm start
```
## 需求实现
1. IM通行
2. 图片传输
3. 机器人关键字回复

### 项目结构
```
|_ server // express4 node server
    |_ index // io server 与express app
    |_ lobby // lobby 与Custom 与 Service
    |_ robot // Robot class
    |_ utils 
|_zclinet // react结构
    |_ component // react UI组件
    |_ hook // 前端与socket交互逻辑
    |_ context // 前端的全局状态管理
    |_ styles // 全局样式与less变量
    |_ APP.js // 前端路由与应用APP
    |_ constant // 常量
```
### IM通信
主要利用sokcet.io对 websocket 的封装支持实现，`/server` 文件夹下为服务端相关代码，主要实现 custom/用户，service/客服，robot/机器人 等不同身份之间的 socket 通信

```TS
interface Lobby { // 主要用来暂存链接状态与消息数据
    rooms: { [room: string]: { msg: Message[], custom: Socket, service: Socket } }
    customCount: number
    serviceCount: number
    serviceRoom: string // 用来给所有在线的 service 发消息
    hotRooms: Set<string>() // 所有呼叫了人工客服的 room
}
```

```TS
class Robot { // 主要用于 custom 与 service 两个client之间的通信
    constructor(io: Server, socket: Socket) {...}

    postMessage(m: Message, room = this.room) {
        this.io.to(room).emit('chat:message', m)
    }
    //...
}
```

```TS
class Custom {
    constructor(socket, robot) {
        //...
        this.room = this.robot.createRoom() // 随机生成roomName， 并将 custom加入
        lobby.rooms.set(this.room, { msg: [], custom: this.socket, service: null })

        this.login() // 用户的socket链接建立之后client的回调执行
        this.sendMessage() // 信息发送
        this.callService() // 呼叫人工客服
        this.robot.replayAuto(lobby.rooms.get(this.room)) // 自动回复
        this.disconnect() // 断开链接
    }
}
```

```TS
class Service {
    constructor(socket, robot) {
        this.socket = socket
        this.id = socket.id
        this.userID = 'service' + randomString()
        this.robot = robot

        this.login() // 客服的socket链接建立之后client的回调执行
        this.gotoRoom() // 切换房间， 与不同的 custom 通信
        this.sendMessage() // 信息发送
        this.getRoomList() // 获取所有需要服务的 hotRoom
        this.disconnect() // 断开链接
    }
}
```

`zclient/` 文件下为前端主要代码，通过前端路由 `/` 和 `/service` 分为 Chart 与 ServiceChart 组件，为用户与客服提供不同交互操作
```js

const ChatApp = ({ userType }) => {
    return (
        <UserContextProvider userType={userType}>
            <EditorContextProvider>
                <Chart />
            </EditorContextProvider>
        </UserContextProvider>
    )
}

export const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Chart userType={USER_CUSTOM} />} />
                <Route path="/service" element={<Chart userType={USER_SERVICE} />} />
            </Routes>
        </BrowserRouter>
    )
}
```

`EditorContextProvider` 主要提供 editor 对象，主要提供消息发送的方法 fn 与 输入组件 form 对象
`UserContextProvider` 主要提供用户信息， 用户login之后server端返回userID，room信息等，service用户比 custom 用户要多一个切换房间的方法
### 图片传输
引入 antD 的 `<Upload />` 组件，利用其所封装的 action 事件(`(f: File) => Promise<unkown>`) 将需要上传的图片文件转换成 base64 字符串生成 Message 对象进行传输
通过 `<Image src={base64String} /> `进行图片展示
```js
// action 方法如下
(file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            editor.uploadImg(reader.result)
            resolve(reader.result)
        };
        reader.onerror = error => reject(error)
    })
}
```

### 机器人关键字回复
```TS
class Robot {
    //...
    replayAuto(room) {
        this.socket.on('chat:message', ({ value }) => {
            if (room.service) return // room 已经有了人工客服
            // 对固有问题的回答
            if (this.replayMap.get(value)) return this.io.to(this.room).emit('chat:message', new RMessage(this.replayMap.get(value)))
            // ... 请求 其他服务分析问题 得到答案 返给用户

            this.io.to(this.room).emit('chat:message', new RMessage('抱歉我不明白， 正在为你呼叫人工客服...'))
            this.room.custom.callService()
        })
    }
    //...
}
```
