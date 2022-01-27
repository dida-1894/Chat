const { randomString } = require("./utils")

const USER_SERVICE = 1
const USER_CUSTOM = 0

const lobby = (function(){
    return {
        rooms: new Map(), // { clientID: msg[] }
    
        customCount: 0,
        serviceCount: 0
    }
}())
module.exports = function (socket){
    // const roomID = randomString()
    console.log('=====> connect', socket.id)
    socket.on('chat:message', (msg) => {
        const roomMsg = lobby.rooms.get(msg.roomID)
        if (!roomMsg) return
        else {
            roomMsg.push(msg)
            lobby.rooms.set(msg.roomID, roomMsg)
        }

        // console.log('message: ' , msg,lobby.rooms.get(roomMsg), lobby.rooms);
        socket.emit(`chat:message`,lobby.rooms.get(msg.roomID) || [])
    });

    socket.on(`login:${USER_CUSTOM}`, (clientID, cb) => {
        if (!clientID) return
        // console.log('=====>', clientID)
        lobby.rooms.set(clientID, [])
        socket.join(clientID)
        lobby.customCount++

        socket.emit(`logined:${USER_CUSTOM}`, { userID:'custom' + randomString(), type: USER_CUSTOM })
        socket.broadcast.emit(`room:list`,[...lobby.rooms.keys()])
    })

    socket.on(`login:${USER_SERVICE}`, () => {
        lobby.serviceCount++

        socket.emit(`logined:${USER_SERVICE}`, { userID:'service' + randomString(), type: USER_SERVICE })
    })

    socket.on(`room:goto`, (roomID) => {
        socket.to(roomID)
        socket.emit(`chat:message`,lobby.rooms.get(roomID) || [])
    })

    socket.on(`room:list`, (cb) => {
        console.log('=====> room keys', lobby.rooms.keys())
        cb({
            status: 200,
            data: [...lobby.rooms.keys()],
        })
    })

    socket.on('disconnect', () => {
        lobby.rooms.delete(socket.id)
        console.log('user disconnected', socket.id);
    });
}