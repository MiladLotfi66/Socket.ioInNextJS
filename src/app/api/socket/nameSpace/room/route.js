// src/app/api/socket/nameSpace/route.js
import connectDB from '@/utils/connectDb';
import NameSpace from "../../../../../../models/Chat";

export async function GET(request) {
  await connectDB();
  try {
    // Extract query parameters from the request URL
    const { searchParams } = new URL(request.url);
    const namespace = searchParams.get('namespace');

    if (!namespace) {
      return new Response(JSON.stringify({ message: "Namespace query parameter is required" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const nameSpace = await NameSpace.findOne({ href: namespace });

    if (!nameSpace) {
      return new Response(JSON.stringify({ message: "Namespace not found" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true, data: nameSpace.rooms }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch rooms' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  await connectDB();
  
  try {
    const body = await request.json();
    const { title, namespace } = body;
    const nameSpace = await NameSpace.findOne({ $or: [{ href :namespace}] });

    if (!nameSpace) {
      return new Response(JSON.stringify({ message: "Namespace not found" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    const mainRoom=await NameSpace.findOne({"rooms.title":title})
    if (mainRoom) {
        return new Response(JSON.stringify({ message: "room is exist" }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }); 
    }
    const Newroom={title,image:"test image"}
    await NameSpace.findOneAndUpdate({ href: namespace },{
        $push:{
            rooms:Newroom
        }
    } );
    return new Response(JSON.stringify({ success: true, data: "new room saved" }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to create room' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
