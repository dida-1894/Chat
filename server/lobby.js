const { randomString } = require("./utils")
const { Robot, RMessage } = require("./robot")

const USER_SERVICE = 1
const USER_CUSTOM = 0

const lobby = (function(){
    return {
        rooms: new Map(), // { roomID: { msg: [], custom: socket, service: socket } }
    
        customCount: 0,
        serviceCount: 0,
        serviceRoom: 'serviceRoom',
        hotRooms: new Set()
    }
}())

class Custom {
    constructor(socket, robot) {
        this.socket = socket
        this.id = socket.id
        this.robot = robot
        this.room = this.robot.createRoom()
        lobby.rooms.set(this.room, { msg: [], custom: this.socket, service: null })

        this.login()
        this.sendMessage()

        this.callService()
        this.robot.replayAuto(lobby.rooms.get(this.room))
        this.disconnect()
    }

    login() {
        // this.socket.join(room)

        lobby.customCount++
        this.socket.join(this.room)
        this.socket.emit(`logined:${USER_CUSTOM}`, { userID:'custom' + randomString(), type: USER_CUSTOM, roomID: this.room })
        this.robot.sayHello()
    }

    callService() {
        this.socket.on('call:service', () => {
            console.log('======>', lobby.serviceCount, lobby.serviceCount == 0)

            lobby.hotRooms.add(this.room)
            this.socket.to(lobby.serviceRoom).emit('room:list', [...lobby.hotRooms])

            if (lobby.serviceCount == 0) this.robot.postMessage(new RMessage('暂无在线客服， 你可以咨询上述给出的问题'))
            else this.robot.postMessage(new RMessage('稍等，客服正在接入'))
        })
    }

    sendMessage() {
        this.socket.on('chat:message', (msg) => {
            const roomMsg = lobby.rooms.get(this.room)
            // if (!roomMsg) return // cb({ status: 500, errMsg: 'DOES NOT EXIST ROOM' })

            roomMsg.msg.push(msg)
            lobby.rooms.set(this.room, roomMsg)
            // console.log('message: ' , msg,lobby.rooms.get(roomMsg), lobby.rooms);
            this.robot.postMessage(msg)
        });
    }

    disconnect() {
        this.socket.on('disconnect', () => {
            lobby.customCount--

            // lobby.rooms.delete(this.room)
            lobby.hotRooms.delete(this.room)
            console.log('user disconnected', this.socket.id);
        });
    }

}
class Service {
    constructor(socket, robot) {
        this.socket = socket
        this.id = socket.id
        this.userID = 'service' + randomString()
        this.robot = robot

        this.login()
        this.gotoRoom()
        this.sendMessage()
        this.disconnect()
        this.getRoomList()
    }

    login() {
        lobby.serviceCount++

        this.socket.join(lobby.serviceRoom)
        this.socket.emit(`logined:${USER_SERVICE}`, { userID: this.userID, type: USER_SERVICE })
        this.socket.emit(`room:list`, [...lobby.hotRooms])
    }
    sendMessage() {
        this.socket.on('chat:message', (msg) => {
            console.log(msg.roomID, lobby.rooms.has(msg.roomID))
            const room = lobby.rooms.get(msg.roomID)
            if (!room) return console.log('======> no room ID') // cb({ status: 500, errMsg: 'DOES NOT EXIST ROOM' })
            else {
                room.msg.push(msg)
                lobby.rooms.set(msg.roomID, room)
            }
            console.log(msg)
            this.robot.postMessage(msg, msg.roomID)
        });
    }
    disconnect() {
        this.socket.on('disconnect', () => {
            lobby.serviceCount--
            console.log('service disconnected', this.socket.id);
        });
    }
    gotoRoom() {
        this.socket.on(`room:goto`, (roomID, cb) => {
            cb()
            this.socket.join(roomID)
            const room = lobby.rooms.get(roomID)
            if (!room.service || room.service.id != this.socket.id) {
                this.socket.to(roomID).emit('chat:message', new RMessage(`${this.userID} 正在为您服务`), roomID)
                room.service = this.socket
                lobby.rooms.set(roomID, room)
            }

            this.robot.syncToHistory(room.msg)
        })
    }
    getRoomList() {
        this.socket.on(`room:list`, (cb) => {
            console.log('=====> room keys', lobby.rooms.keys())
            cb({
                status: 200,
                data: [...lobby.hotRooms],
            })
        })
    }

}

module.exports = function (socket, io){
    // const roomID = randomString()
    // console.log('=====> connect', socket.id)
    let robot = new Robot(io, socket)
    socket.on(`login:${USER_CUSTOM}`, () => new Custom(socket, robot))

    socket.on(`login:${USER_SERVICE}`, () => new Service(socket, robot))
}