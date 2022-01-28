const { randomString } = require("./utils")
const Robot = require("./robot")

const USER_SERVICE = 1
const USER_CUSTOM = 0

const lobby = (function(){
    return {
        rooms: new Map(), // { roomID: { msg: [], custom: socket, service: socket } }
    
        // customs: new Map(),
        // service: new Map(),
        customCount: 0,
        serviceCount: 0,
        serviceRoom: 'serviceRoom',
        cRooms: new Set()
    }
}())

class Custom {
    constructor(socket) {
        this.socket = socket
        this.id = socket.id
        this.robot = new Robot(socket)
        this.room = this.robot.createRoom()
        lobby.rooms.set(this.room, { msg: [], custom: this.socket, service: null })

        this.robot.replayAuto(lobby.rooms.get(this.room))
        this.login()
        this.sendMessage()
        this.disconnect()
    }

    login() {
        // this.socket.join(room)

        lobby.customCount++
        this.robot.sayHello()

        this.socket.emit(`logined:${USER_CUSTOM}`, { userID:'custom' + randomString(), type: USER_CUSTOM, roomID: this.room })
    }

    callService() {
        this.socket.on('call:service', () => {
            lobby.cRooms.add(this.room)
            this.socket.to(lobby.serviceRoom).emit('room:list', [...lobby.cRooms])
        })
    }

    sendMessage() {
        this.socket.on('chat:message', (msg) => {
            const roomMsg = lobby.rooms.get(msg.roomID)
            if (!roomMsg) return // cb({ status: 500, errMsg: 'DOES NOT EXIST ROOM' })

            // console.log('message: ' , msg,lobby.rooms.get(roomMsg), lobby.rooms);
            // this.socket.to(this.room).emit(`chat:message`,lobby.rooms.get(msg.roomID) || [])
        });
    }

    disconnect() {
        this.socket.on('disconnect', () => {
            lobby.customCount--

            // lobby.rooms.delete(this.room)
            lobby.cRooms.delete(this.room)
            console.log('user disconnected', this.socket.id);
        });
    }

}
class Service {
    constructor(socket) {
        this.socket = socket
        this.id = socket.id

        this.login()
        this.sendMessage()
        this.disconnect()
        this.gotoRoom()
        this.getRoomList()
    }

    login() {
        lobby.serviceCount++

        this.socket.join(lobby.serviceRoom)
        this.socket.emit(`logined:${USER_SERVICE}`, { userID:'service' + randomString(), type: USER_SERVICE })
        this.socket.emit(`room:list`, [...lobby.cRooms])
    }
    sendMessage() {
        this.socket.on('chat:message', (msg) => {
            const roomMsg = lobby.rooms.get(msg.roomID)
            if (!roomMsg) return console.log('======> no room ID') // cb({ status: 500, errMsg: 'DOES NOT EXIST ROOM' })
            else {
                roomMsg.push(msg)
                lobby.rooms.set(msg.roomID, roomMsg)
            }

            // console.log('message: ' , msg,lobby.rooms.get(roomMsg), lobby.rooms);
            if (!this.socket.rooms.has(msg.roomID)) this.socket.join(msg.roomID)
            console.log('=====>', this.socket.rooms)
            this.socket.emit(`chat:message`,lobby.rooms.get(msg.roomID) || [])
            this.socket.to([msg.roomID, this.id]).emit(`chat:message`,lobby.rooms.get(msg.roomID) || [])
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
            room.service = this.socket
            lobby.rooms.set(roomID, room)
            this.socket.to(roomID).emit(`chat:message`, room.msg || [])
        })
    }
    getRoomList() {
        this.socket.on(`room:list`, (cb) => {
            console.log('=====> room keys', lobby.rooms.keys())
            cb({
                status: 200,
                data: [...lobby.cRooms],
            })
        })
    }

}

module.exports = function (socket){
    // const roomID = randomString()
    // console.log('=====> connect', socket.id)
    socket.on(`login:${USER_CUSTOM}`, () => new Custom(socket))

    socket.on(`login:${USER_SERVICE}`, () => new Service(socket))
}