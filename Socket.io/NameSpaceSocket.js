import NameSpace from "../models/Chat.js";
import connectDB from "../src/utils/connectDb.js";

function InitConnection(io) {
io.on("connection",async(socket)=>{
  await connectDB()
  const namespaces= await NameSpace.find({}).sort({_id:-1})
  socket.emit("namespaces",namespaces)
})
}
async function NameSpaceRooms (io,selectedNameSpace) {
  
  await connectDB()
  
  const namespaces= await NameSpace.find({}).lean();
  
  namespaces.forEach((namespace)=>{

  
    io.of(namespace.href).on("connection",async (socket)=>{
    const mainNameSpaces= await NameSpace.findOne({_id:namespace._id})

    socket.emit("nameSpaceRooms",mainNameSpaces.rooms)

socket.on("joining", async (newRoom)=>{
  const lastJoin=Array.from(socket.rooms)[1]
  if (lastJoin) {
    socket.leave(lastJoin)
    await getRoomOnlineUsers(io,lastJoin,namespace.href)

  }
socket.join(newRoom)

await getRoomOnlineUsers(io,newRoom,namespace.href)

const roomInfo =await mainNameSpaces.rooms.find((room) => room.title === newRoom)

socket.emit("roomInfo",roomInfo)

socket.on("disconnect",async ()=>{
  await getRoomOnlineUsers(io,newRoom,namespace.href)

})


})

  })

})
}

const getRoomOnlineUsers= async (io , roomTitle , href)=>{
const onLineUsers=await io.of(href).in(roomTitle).allSockets()

io.of(href).in(roomTitle).emit("onlineUserCount",Array.from(onLineUsers).length)
}

export  {InitConnection,NameSpaceRooms}
