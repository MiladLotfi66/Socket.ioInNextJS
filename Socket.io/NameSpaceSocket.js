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
  }
socket.join(newRoom)
console.log("join()",newRoom);


const roomInfo =await mainNameSpaces.rooms.find((room) => room.title === newRoom)
console.log("roomInfo----->",roomInfo);

socket.emit("roomInfo",roomInfo)



})

  })

})
}

export  {InitConnection,NameSpaceRooms}
