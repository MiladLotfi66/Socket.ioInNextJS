import NameSpace from "../models/Chat.js";
import connectDB from "../src/utils/connectDb.js";

function InitConnection(io) {
io.on("connection",async(socket)=>{
  console.log("socket--->",socket.id);
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
    socket.emit("nameSpaceRooms",namespace.rooms)

socket.on("joining", async (newRoom)=>{
console.log("room-->",newRoom);
socket.join(newRoom)
console.log("room-->",newRoom);

})


  })

})
}

export  {InitConnection,NameSpaceRooms}
