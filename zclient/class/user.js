export class User {
    roomID = null
    constructor(userID, socket) {
        this.userID = userID
        this.socket = socket
    }
    setRoom = function (room) {
        this.roomID = room
    }
    disconnect = function (){
        this.socket.disconnect()
    }
}
