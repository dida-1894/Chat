const { randomString } = require("./utils")
class RMessage {
    constructor(val) {
        this.type = 'text'
        this.value = val
        this.date = +new Date()
        this.userID = 'Robot'
    }
}
class Robot {
    constructor(io, socket) {
        this.io = io
        this.socket = socket
        this.map = new Map()
        this.map.set('1', 'answer1')
        this.map.set('2', 'answer2')
        this.map.set('3', 'answer3')

    }
    createRoom() {
        let room = 'room' + randomString()
        this.room = room
        return room
    }

    replayAuto(room) {
        this.socket.on('chat:message', ({ value }) => {
            if (room.service) return

            if (this.map.get(value.trim())) return this.io.to(this.room).emit('chat:message', new RMessage(this.map.get(value.trim())))
        })
    }
    sayHello() {
        this.io.to(this.room).emit('chat:message', new RMessage('hello, xx智能客服为你服务， 你可以问我下列问题[1,2,3]， 或者发送 请求人工服务'))
    }
    postMessage(m, room = this.room) { // m: {} || []
        this.io.to(room).emit('chat:message', m)
    }
    syncToHistory(history, room = this.socket.id) {
        this.io.to(room).emit('chart:history', history)
    }
}

module.exports = {
    Robot,
    RMessage
}