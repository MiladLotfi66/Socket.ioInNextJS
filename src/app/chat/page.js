"use client";
import { useEffect,useState } from "react"
import { io } from "socket.io-client"
function page() {
const [socket ,setSocket] = useState(undefined)
const [inbox ,setInbox] = useState(["hello","nice"])

    useEffect(() => {   
const socket = io("http://localhost:3000")
    }, [])

        return (
            <div>
                <h1>Connecting...</h1>
            </div>
        )
    }



export default page
