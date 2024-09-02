"use client";
import { useState, useEffect, useRef } from "react";
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
  const [messages, setMessages] = useState([]);

  // استفاده از useRef برای نگهداری namespaceSocket
  const namespaceSocketRef = useRef(null);

  useEffect(() => {
    // اتصال به سرور Socket.IO
    socket = io();
    socket.on("connect", () => {
    });

    // گوش دادن برای دریافت namespaces
    socket.on("namespaces", (data) => {
      setNamespaces(data);
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedNamespace) {
      // قطع ارتباط قبلی با namespaceSocket
      if (namespaceSocketRef.current) {
        namespaceSocketRef.current.disconnect();
      }

      // اتصال به namespace انتخاب شده
      namespaceSocketRef.current = io(
        `http://localhost:3000${selectedNamespace}`
      );

      namespaceSocketRef.current.on("connect", () => {
      
      });

      namespaceSocketRef.current.on("nameSpaceRooms", (rooms) => {
        setRooms(rooms); // فرض می‌کنیم 'rooms' یک آرایه از روم‌ها باشد
      });

      return () => {
        if (namespaceSocketRef.current) {
          namespaceSocketRef.current.disconnect();
        }
      };
    }
  }, [selectedNamespace]);

  useEffect(() => {
    if (selectedRoom && namespaceSocketRef.current) {
      namespaceSocketRef.current.emit("joining", selectedRoom);

      // حذف event listener قبلی
      namespaceSocketRef.current.off("roomInfo");

      // اضافه کردن event listener جدید
      namespaceSocketRef.current.on("roomInfo", (roomInfo) => {
        
        const formattedMessages = roomInfo.messages.map(msg =>
          Object.values(msg).slice(0, -1).join("")
        );
        setMessages(formattedMessages);
      });
    }
  }, [selectedRoom]);

  const handleNamespaceClick = (namespace) => {
    setSelectedNamespace(namespace.href);
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room.title);
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
      <ul style={{ cursor: "pointer", display: "flex" }}>
        {namespaces.map((ns) => (
          <li
            key={ns._id}
            onClick={() => handleNamespaceClick(ns)}
            style={{ cursor: "pointer", display: "flex" }}
          >
            {ns.title}
          </li>
        ))}
      </ul>
      {selectedNamespace && (
        <>
          <h3>Rooms in {selectedNamespace}:</h3>
          <ul style={{ cursor: "pointer", display: "flex" }}>
            {rooms.map((room) => (
              <li
                key={room._id}
                onClick={() => handleRoomClick(room)}
                style={{ cursor: "pointer" }}
              >
                {room.title}
              </li>
            ))}
          </ul>
        </>
      )}
      {selectedRoom && (
        <>
          <h3>Messages in {selectedRoom}:</h3>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

export default RoomForm;
