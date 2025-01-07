import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../service/peer";

const RoomPage = () => {
    const socket = useSocket();
     const[remoteSocketId, setRemoteSocketId] = useState(null);
     const[myStream , setMyStream] = useState();

    const handleUserJoined = useCallback(({ email, id }) => {
        console.log(`Email ${email} joined room with ID: ${id}`);
        setRemoteSocketId(id);
    }, []);

    const handleCallUser = useCallback( async()=>{
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true , 
            video: true
        })
           const offer = await peer.getOffer();
              socket.emit("user:call", { to: remoteSocketId, offer })
            setMyStream(stream);
    },[remoteSocketId , socket]);

    const handleIncomingCall = useCallback( async ({from , offer}) => {
        setRemoteSocketId(from);
    console.log(`Incoming call`, from , offer);
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true , 
        video: true
    })
    setMyStream(stream);
    const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", {to: from, ans});
    },[socket]);

    const handleCallAccepted = useCallback(({from , ans}) => {
    peer.setLocalDescription(ans);
    console.log("call Accepted");      
    },[])

    useEffect(() => {
        if (!socket) {
            console.error("Socket is not available.");
            return;
        }

        // console.log("useEffect running, socket:", socket);
        // console.log("Socket initialized:", socket.id);

        // console.log("Setting up listener for 'user:joined' event");
        socket.on("user:joined", handleUserJoined);
        socket.on("incoming:call", handleIncomingCall)
        socket.on("call:accepted", handleCallAccepted)

        // Cleanup the event listener on unmount
        return () => {
            // console.log("Removing 'user:joined' listener");
            socket.off("user:joined", handleUserJoined);
            socket.off("incoming:call", handleIncomingCall);
            socket.off("call:accepted", handleCallAccepted);
        };
    },  [socket, handleUserJoined , handleIncomingCall]);  
    return (
        <div>
            <h1>Room Page</h1>
            <h4>{remoteSocketId ? "Connected" : "No One In Room"}</h4>
        {remoteSocketId && <button onClick={handleCallUser}>CALL</button>}
        
  <>
        
        <h1>My Stream</h1>
    {  myStream && 
        <ReactPlayer 
        playing 
        muted 
        height="200px"
         width="300px" 
         url={myStream} />
    }
</>
        </div>
    );
}


export default RoomPage;
