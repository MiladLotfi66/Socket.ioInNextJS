import {InitConnection ,NameSpaceRooms } from "./NameSpaceSocket.js"
function indexSocket(io) {

    InitConnection(io)
    NameSpaceRooms(io)
}

export default indexSocket
