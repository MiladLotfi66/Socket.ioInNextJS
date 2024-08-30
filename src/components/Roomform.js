"use client";
import { useState, useEffect } from "react";
import io from "socket.io-client";




let socket;

function RoomForm() {
    const [namespace, setNamespace] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [namespaces, setNamespaces] = useState([]);
    const [selectedNamespace, setSelectedNamespace] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        // Connect to Socket.IO server
        socket = io();
        socket.on("connect", () => {
            console.log("Connected to server with ID:", socket.id);
        });

        // Listen for namespaces event
        socket.on("namespaces", (data) => {
            console.log("Received namespaces:", data);
            setNamespaces(data);
        });

        return () => {
            if (socket) {
                socket.disconnect();
            }
        };
    }, []);

    useEffect(() => {
        let namespaceSocket;
        if (selectedNamespace) {
            namespaceSocket = io(`http://localhost:3000${selectedNamespace}`);
            console.log("Connecting to namespace:", selectedNamespace);

            namespaceSocket.on("connect", () => {
                console.log(`Connected to namespace: ${selectedNamespace} with socket ID: ${namespaceSocket.id}`);
            });

            namespaceSocket.on("nameSpaceRooms", (rooms) => {
                console.log("Rooms received from namespace:");
                console.log("Rooms ->", rooms);
                setRooms(rooms); // Assuming 'rooms' is the array of rooms received
            });
          

            return () => {
                if (namespaceSocket) {
                    namespaceSocket.disconnect();
                }
            };
        }
    }, [selectedNamespace]);
    useEffect(() => {
        let namespaceSocket;
        if (selectedRoom){
            namespaceSocket = io(`http://localhost:3000${selectedNamespace}`);

            console.log("join to room ",selectedRoom);
            namespaceSocket.emit("joining", selectedRoom);
        }
     
    }, [selectedRoom]);
    // useEffect(()=>{
    //   socket.join(selectedRoom)  
    // },[selectedRoom])

    const handleNamespaceClick = (namespace) => {
        setSelectedNamespace(namespace.href);
    };
      const handleRoomClick = ( room) => {
        // console.log(room._id);
        setSelectedRoom(room._id);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/socket/nameSpace/room", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ namespace, title }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                setError("");
            } else {
                setError(data.message || "Failed to create room");
                setMessage("");
            }
        } catch (e) {
            setError("An error occurred while creating the room");
            setMessage("");
        }
    };

    return (
        <>
            <h1>Create a new Room</h1>
            {message && <p style={{ color: "green" }}>{message}</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Namespace</label>
                    <input
                        type="text"
                        value={namespace}
                        onChange={(e) => setNamespace(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create</button>
            </form>
            <h2>Namespaces:</h2>
            <ul>
                {namespaces.map((ns) => (
                    <li key={ns._id} onClick={() => handleNamespaceClick(ns)} style={{ cursor: "pointer" }}>
                        {ns.title}
                    </li>
                ))}
            </ul>
            {selectedNamespace && (
                <>
                    <h3>Rooms in {selectedNamespace}:</h3>
                    <ul>
                        {rooms.map((room) => (
                            <li key={room._id} onClick={() => handleRoomClick(room)} style={{ cursor: "pointer" }}>
                                {room.title}
                                
                            </li>
                        ))}
                    </ul>
                </>
            )}
              {selectedRoom && (
                <>
                    <h3>content in {selectedRoom}:</h3>
                    <ul>
                      room is connected
                    </ul>
                </>
            )}
        </>
    );
}

export default RoomForm;
