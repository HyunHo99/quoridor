import io from "socket.io-client";
import React, { useEffect, useState, useRef } from "react";
import Peer from "simple-peer";
import styled from "styled-components";
import Popup from "reactjs-popup";
import "./videoChat.css";

const socket = io("ws://143.248.194.208:443");

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
    socket.on("connect", () => {
      console.log("room id: ", props.roomid);
      socket.emit("join-room", props.roomid, socket.id);
      console.log("socketid: ", socket.id);
    });

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

    socket.on("user-connected-socket-to-1st-user", (id) => {
      console.log("A new player joined the room! ");
      setOpponentSocketId(id);
      socket.emit("my-socketid", props.roomid, socket.id);
    });

    socket.on("user-connected-socket-to-2nd-user", (id) => {
      console.log("Giving the id of firstly entered user!");
      setOpponentSocketId(id);
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
      <video
        class="web-cam"
        muted
        ref={userVideo}
        autoPlay
        width="120px"
        height="120px"
        align="center"
      />
    );
  }

  let mainView = null;
  let OpponentVideo = null;

  if (callAccepted) {
    OpponentVideo = (
      <video
        class="web-cam"
        muted
        ref={partnerVideo}
        autoPlay
        width="120px"
        height="120px"
        align="center"
      />
    );
  } else if (receivingCall) {
    mainView = (
      <div className="connectionHandler">
        <h3>Other player is calling you</h3>
        <button onClick={acceptCall}>
          <h3>Accept</h3>
        </button>
      </div>
    );
  } else if (isCalling) {
    mainView = (
      <div className="connectionHandler">
        {/* <h1>Currently calling {props.opponentUserName}...</h1> */}
        <h3>Currently calling the other player ...</h3>
      </div>
    );
  } else {
    mainView = (
      <>
        <button
          id="startchatbutton"
          onClick={() => {
            callPeer(opponentSocketId);
          }}
        >
          <h3>Chat with your friend while you play!</h3>
        </button>
      </>
    );
  }

  if (props.want === 0) {
    return <div class="video-div">{UserVideo}</div>;
  }

  if (props.want === 1) {
    return <div>{OpponentVideo}</div>;
  }

  if (props.want === 2) {
    return <div class="main-view">{mainView}</div>;
  }
}

export default VideoChatApp;
