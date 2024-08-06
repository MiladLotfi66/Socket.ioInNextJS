// src/app/api/socket/nameSpace/route.js
import connectDB from '@/utils/connectDb';
import NameSpace from "@/models/Chat";

export async function GET(request) {
  await connectDB();

  try {
    const namespaces = await NameSpace.find({}, { rooms: 0 });
    return new Response(JSON.stringify({ success: true, data: namespaces }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch namespaces' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request) {
  await connectDB();
  
  try {
    const body = await request.json();
    const { title, href } = body;
    const namespace = await NameSpace.findOne({ $or: [{ title }, { href }] });

    if (namespace) {
      return new Response(JSON.stringify({ message: "Namespace already exists" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const newNamespace = await NameSpace.create({ title, href });
    return new Response(JSON.stringify({ success: true, data: newNamespace }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to create namespace' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
