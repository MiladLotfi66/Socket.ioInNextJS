"use client";
// components/RoomForm.js
import { useState } from "react";

function RoomForm() {
    const [namespace, setNamespace] = useState("");
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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
        </>
    );
}

export default RoomForm;
