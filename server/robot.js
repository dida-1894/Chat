const { randomString } = require("./utils")

class Robot {
    constructor(socket) {
        this.socket = socket
    }
    createRoom() {
        let room = 'room' + randomString()
        this.socket.join(room)
        this.room = room
        return room
    }
    replayAuto(room) {
        this.socket.on('chat:message', (msg) => {
            if (room.service || !['question1'].includes(msg.data)) return

            this.socket.to(msg.roomID).emit('chat:message', 'answer1')
        })
    }
    sayHello() {
        this.socket.emit('chat:message', [{
            type: 'text',
            value: 'hello, xx智能客服为你服务， 你可以问我下列问题， 或者发送 请求人工服务',
            date: (+new Date()),
            roomID: this.room,
            userID: 'Robot'
        }])
    }
    join(room, user) {
        user.join(room)
    }
}

module.exports = Robot