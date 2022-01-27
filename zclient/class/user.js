export class Custom {
    constructor(userID, socket) {
        this.userID = userID
        this.socket = socket
        this.room = socket.id
    }
    joinRoom = function (){
        this.socket.join(this.socket.id)
    }
    disconnect = function (){
        this.socket.leave(this.socket.id)
        this.socket.disconnect()
    }
}

export class Service {
    constructor(userID, socket) {
        this.userID = userID
        this.socket = socket
        this.room = null
    }
    joinRoom = function (roomID){
        this.socket.join(roomID)
    }
    changeRoom = function (roomID){
        this.room = roomID
        this.socket.emit('room:goto', roomID)
    }
    disconnect = function (){
        this.socket.leave(this.socket.id)
        this.socket.disconnect()
    }
}