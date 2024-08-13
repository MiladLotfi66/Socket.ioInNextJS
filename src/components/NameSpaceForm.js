"use client";
// components/NameSpaceForm.js
import { useState, useEffect } from "react";

function NameSpaceForm() {
    const [title, setTitle] = useState("");
    const [href, setHref] = useState("");
    const [namespaces, setNamespaces] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchNamespaces();
    }, []);

    const fetchNamespaces = async () => {
        try {
            const response = await fetch("/api/socket/nameSpace");
            const data = await response.json();
            if (data.success) {
                setNamespaces(data.data);
            } else {
                setError(data.error);
            }
        } catch (e) {
            setError("Failed to fetch namespaces");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/socket/nameSpace", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, href }),
            });
            const data = await response.json();
            if (data.success) {
                setNamespaces([...namespaces, data.data]);
                setTitle("");
                setHref("");
                setError("");
            } else {
                setError(data.message || "Failed to create namespace");
            }
        } catch (e) {
            setError("An error occurred while creating the namespace");
        }
    };

    return (
        <>
            <h1>Create a new Namespace</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Href</label>
                    <input
                        type="text"
                        value={href}
                        onChange={(e) => setHref(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create</button>
            </form>

            <h2>Namespaces</h2>
            <ul>
                {namespaces.map((namespace) => (
                    <li key={namespace._id}>{namespace.title} - {namespace.href}</li>
                ))}
            </ul>
        </>
    );
}

export default NameSpaceForm;
