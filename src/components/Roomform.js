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
  const [onlineUserCount, setOnlineUserCount] = useState(0);
  const [newMessage, setNewMessage] = useState("");

  const namespaceSocketRef = useRef(null);

  useEffect(() => {
    socket = io();
    socket.on("connect", () => {});

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
      if (namespaceSocketRef.current) {
        namespaceSocketRef.current.disconnect();
      }

      namespaceSocketRef.current = io(
        `http://localhost:3000${selectedNamespace}`
      );

      namespaceSocketRef.current.on("connect", () => {});

      namespaceSocketRef.current.on("nameSpaceRooms", (rooms) => {
        setRooms(rooms);
      });

      namespaceSocketRef.current.on("onlineUserCount", (count) => {
        setOnlineUserCount(count);
      });

      // گوش دادن به پیام‌های جدید
      namespaceSocketRef.current.on("newMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
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

      namespaceSocketRef.current.off("roomInfo");

      namespaceSocketRef.current.on("roomInfo", (roomInfo) => {
        setMessages(roomInfo.messages);
      });

      namespaceSocketRef.current.on("onlineUserCount", (count) => {
        setOnlineUserCount(count);
      });
    }
  }, [selectedRoom]);

  const handleNamespaceClick = (namespace) => {
    setSelectedNamespace(namespace.href);
  };

  const handleRoomClick = (room) => {
    setSelectedRoom(room.title);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && namespaceSocketRef.current && selectedRoom) {
      namespaceSocketRef.current.emit("newMessage", { room: selectedRoom, message: newMessage });
      setNewMessage("");
    }
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
          <h4>کاربران آنلاین: {onlineUserCount}</h4> 

          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg.message}</li>
            ))}
          </ul>
          <div>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="پیام جدید"
            />
            <button onClick={handleSendMessage}>ارسال</button>
          </div>
        </>
      )}
    </>
  );
}

export default RoomForm;
