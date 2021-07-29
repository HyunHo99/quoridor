import io from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import styled from "styled-components";

const socket = io("ws://143.248.194.208:443");

const Container = styled.div`
  height: 100vh;
  width: 100%;
  flex-direction: column;
`;

const Row = styled.div`
  width: 100%;
`;

const Video = styled.video`
  border: 1px solid blue;
`;

function VideoChatApp(props) {
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [opponentSocketId, setOpponentSocketId] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const userVideo = useRef();
  const partnerVideo = useRef();

  useEffect(() => {
    socket.on("connect", ()=>{
        socket.emit("join-room", props.roomid, socket.id);
        console.log("socketid: ", socket.id);
    })

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    socket.on("hey", (data) => {
      console.log("hey received");
      setReceivingCall(true);
      setCaller(data.from);
      setCallerSignal(data.signal);
    });

    socket.on("user-connected", (id) => {
      console.log("A new player joined the room! ");
      setOpponentSocketId(id);
      console.log("opponenet's socketid: ", opponentSocketId);
    });
  }, []);

  function callPeer(id) {
    console.log(opponentSocketId);
    setIsCalling(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    // fired when the peer wants to send signaling data to the remote peer
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: socket.id,
      });
    });

    // received a remote video stream
    peer.on("stream", (stream) => {
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal); // Call this method whenever the remote peer emits a peer.on('signal') event.
    });
  }

  function acceptCall() {
    setCallAccepted(true);
    setIsCalling(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("acceptCall", { signal: data, to: caller });
    });

    peer.on("stream", (stream) => {
      partnerVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = (
      <Video
        playsInline
        muted
        ref={userVideo}
        autoPlay
        style={{ width: "50%", height: "50%" }}
      />
    );
  }

  let mainView;

  if (callAccepted) {
    mainView = (
      <Video
        playsInline
        ref={partnerVideo}
        autoPlay
        style={{ width: "100%", height: "100%" }}
      />
    );
  } else if (receivingCall) {
    mainView = (
      <div>
        <h1>Other player is calling you</h1>
        <button onClick={acceptCall}>
          <h1>Accept</h1>
        </button>
      </div>
    );
  } else if (isCalling) {
    mainView = (
      <div>
        {/* <h1>Currently calling {props.opponentUserName}...</h1> */}
        <h1>Currently calling the other player ...</h1>
      </div>
    );
  } else {
    mainView = (
      <button
        onClick={() => {
          callPeer(opponentSocketId);
        }}
      >
        <h1>Chat with your friend while you play!</h1>
      </button>
    );
  }

  return (
    <Container>
      <Row>
        {mainView}
        {UserVideo}
      </Row>
    </Container>
  );
}

export default VideoChatApp;
