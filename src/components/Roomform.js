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

    useEffect(() => {
        // Connect to Socket.IO server
        socket = io();
console.log("socket---->",socket.id);
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
                setMessage(data.data);
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
                {namespaces.map(ns => (
                    <li key={ns._id}>{ns.title}</li>
                ))}
            </ul>
        </>
    );
}

export default RoomForm;



// "use client";
// // components/RoomForm.js
// import { useState } from "react";
// import io from "socket.io-client";

// function RoomForm() {
//     const [namespace, setNamespace] = useState("");
//     const [title, setTitle] = useState("");
//     const [message, setMessage] = useState("");
//     const [error, setError] = useState("");

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch("/api/socket/nameSpace/room", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ namespace, title }),
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 setMessage(data.data);
//                 setError("");
//             } else {
//                 setError(data.message || "Failed to create room");
//                 setMessage("");
//             }
//         } catch (e) {
//             setError("An error occurred while creating the room");
//             setMessage("");
//         }
//     };

//     return (
//         <>
//             <h1>Create a new Room</h1>
//             {message && <p style={{ color: "green" }}>{message}</p>}
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <label>Namespace</label>
//                     <input
//                         type="text"
//                         value={namespace}
//                         onChange={(e) => setNamespace(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <div>
//                     <label>Title</label>
//                     <input
//                         type="text"
//                         value={title}
//                         onChange={(e) => setTitle(e.target.value)}
//                         required
//                     />
//                 </div>
//                 <button type="submit">Create</button>
//             </form>
//         </>
//     );
// }

// export default RoomForm;
