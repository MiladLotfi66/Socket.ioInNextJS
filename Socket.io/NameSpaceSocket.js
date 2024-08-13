import NameSpace from "../models/Chat.js";
import connectDB from "../src/utils/connectDb.js";

function NameSpaceSocket(io) {
io.on("connection",async(socket)=>{
  console.log("socket--->",socket.id);
  await connectDB()
  const namespaces= await NameSpace.find({}).sort({_id:-1})
  socket.emit("namespaces",namespaces)
})
}

export default NameSpaceSocket
