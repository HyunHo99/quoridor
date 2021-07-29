/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Board, Player, existPath } from "./tools";
import { withRouter } from "react-router";
import Axios from "axios";
import { io } from "socket.io-client";
import "./GamePage.css";

// create a peer server
const myPeer = new window.Peer(undefined, {
  host: "/",
  port: "3001",
});

function GamePage(props) {
  var qs = require("qs");
  const socket = props.socket;
  const videoGrid = document.getElementById("video-grid");
  const [gameboard, setGameboard] = useState(new Board());
  const [startX, setStartX] = useState("");
  const [startY, setStartY] = useState("");
  const [yame, setYame] = useState(0);
  const [yame2, setYame2] = useState(0);
  const [endX, setEndX] = useState("");
  const [endY, setEndY] = useState("");
  const [peers, setPeers] = useState({});
  // const [videoGrid, setVideoGrid] = useState(
  //   document.getElementById("video-grid")
  // );

  const [player1, setplayer1] = useState(new Player(0, 8, [16, 8]));
  const [player2, setplayer2] = useState(new Player(16, 8, [0, 8]));
  const [turn, setTurn] = useState(0);
  const roomID = Object.values(qs.parse(props.location.search))[0];

  const socket_io = io("ws://143.248.197.173:443");

  // const videoGrid = React.createRef();
  // console.log("videoGrid in game function: " + videoGrid);

  const myVideo = document.createElement("video");
  myVideo.muted = true;

  // MAKE CALLS TO OTHER USERS
  // send my stream to the new user
  function connectToNewUser(userId, stream) {
    console.log("Make calls to other users");
    // call variable is coming from our peer object
    // send {userId} with {stream} using call function
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    // when the opponent send us back their stream, we are going to add it to our videoGrid
    console.log("make call to userid: ", userId);
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
      console.log("opponenet's video is added - MAKE CALL");
    });
    // remove people who are not connected (leave the room)
    // whenever someone leaves and closes the call, remove it
    call.on("close", () => {
      video.remove();
      console.log("remove video of people ending connection");
    });

    setPeers((peers[userId] = call));
    console.log(peers);
  }

  function addVideoStream(myVideo, stream) {
    // console.log("addvideostream funciton called");
    // console.log("videoGrid in addvideostream: " + videoGrid);
    // console.log("addVideoStream function called");
    myVideo.srcObject = stream;
    myVideo.addEventListener("loadedmetadata", () => {
      myVideo.play();
    });
    // setVideoGrid(videoGrid.append(myVideo));
    videoGrid.append(myVideo);
  }

  useEffect(() => {
    // listen for disconnected users and change peers array
    socket_io.on("user-disconnected", (userId) => {
      if (peers[userId]) setPeers(peers[userId].close());
      console.log("disconnected user id: ", userId);
    });

    if (videoGrid && yame2 === 0) {
      //get the peer id of myself
      // connect with the peer server and get an id
      myPeer.on("open", (id) => {
        setYame2(1);
        socket_io.emit("join-room", "arbitrary roomid", id);
        console.log("My peer id is " + id);
        console.log(myPeer);
      });
    }

    if (videoGrid) {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: false,
        })
        .then((stream) => {
          // console.log("ingetusermedia");
          if (yame2 === 0) addVideoStream(myVideo, stream); // my current video

          console.log(myPeer);
          // RECEIVE CALLS FROM OTHER USERS
          // listen to calls from opponenets
          // constantly be listening
          // and answer them with our stream
          // currently not able to receive call
          // console.log("myPeer: ", myPeer);
          myPeer.on("call", (call) => {
            console.log("receive call: ", call);
            call.answer(stream);
            const video = document.createElement("video");
            call.on("stream", (userVideoStream) => {
              addVideoStream(video, userVideoStream);
              console.log("opponenet's video is added - RECEIVE CALL");
            });
          });

          // listen for the new user connected event (message about a new connected user)
          // does not include myself
          socket_io.on("user-connected", (userId) => {
            console.log("connect to a new (other) user - about to MAKE CALL");
            connectToNewUser(userId, stream);
          });
        });
    }
  }, [
    socket_io,
    myPeer,
    videoGrid,
    yame2,
    peers,
    addVideoStream,
    myVideo,
    connectToNewUser,
  ]);

  const upHandler1 = () => {
    const k = player1.goto("up", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player1);
      setTurn((turn + 1) % 2);
    }
  };
  const leftHandler1 = () => {
    const k = player1.goto("left", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player1);
      setTurn((turn + 1) % 2);
    }
  };
  const rightHandler1 = () => {
    const k = player1.goto("right", gameboard.board);
    if (k[1]) {
      setTurn((turn + 1) % 2);
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player1);
    }
  };
  const downHandler1 = () => {
    const k = player1.goto("down", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player1);
      console.log(turn);
      setTurn((turn + 1) % 2);
    }
  };

  const upHandler2 = () => {
    const k = player2.goto("up", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player2);
      setTurn((turn + 1) % 2);
      socket.send(`{"roomID":"${roomID}", "message":"Move_Up"}`);
    }
  };
  const leftHandler2 = () => {
    const k = player2.goto("left", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player2);
      setTurn((turn + 1) % 2);
      socket.send(`{"roomID":"${roomID}", "message":"Move_Left"}`);
    }
  };
  const rightHandler2 = () => {
    const k = player2.goto("right", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player2);
      setTurn((turn + 1) % 2);
      socket.send(`{"roomID":"${roomID}", "message":"Move_Right"}`);
    }
  };
  const downHandler2 = () => {
    const k = player2.goto("down", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player2);
      setTurn((turn + 1) % 2);
      socket.send(`{"roomID":"${roomID}", "message":"Move_Down"}`);
    }
  };
  const onSubmitHandler1 = () => {};
  const onSubmitHandler2 = () => {
    if (gameboard.makeWall([startX, startY], [endX, endY])) {
      gameboard.updateCannotMakeWall([player1, player2]);
      console.log(gameboard.board);
      setGameboard(Object.create(gameboard));
      setTurn((turn + 1) % 2);
      socket.send(
        `{"roomID":"${roomID}", "message":"Make_Wall", "startX":"${startX}", "startY":"${startY}", "endX":"${endX}", "endY":"${endY}"}`
      );
    }
  };

  useEffect(() => {
    if (yame === 0) {
      setYame(1);
      setTurn(Number(Object.values(qs.parse(props.location.search))[1]));
      socket.addEventListener("message", (data) => {
        let k = JSON.parse(data.data);
        console.log(k);
        if (k.message === "Move_Up") {
          upHandler1();
        }
        if (k.message === "Move_Left") {
          leftHandler1();
        }
        if (k.message === "Move_Right") {
          rightHandler1();
        }
        if (k.message === "Move_Down") {
          downHandler1();
        }
        if (k.message === "Make_Wall") {
          let a = String(k.startX);
          let b = String(k.startY);
          let c = String(k.endX);
          let d = String(k.endY);
          console.log(a, b, c, d);
          onSubmitHandler1();
          if (gameboard.makeWall([a, b], [c, d])) {
            gameboard.updateCannotMakeWall([player1, player2]);
            console.log(gameboard.board);
            setGameboard(Object.create(gameboard));
            setTurn((turn + 1) % 2);
          }
        }
      });
    }
  });

  return (
    <>
      <div>
        <label>startX</label>
        <input
          type="text"
          value={startX}
          onChange={(event) => {
            setStartX(event.currentTarget.value);
          }}
        />
        <label>startY</label>
        <input
          type="text"
          value={startY}
          onChange={(event) => {
            setStartY(event.currentTarget.value);
          }}
        />
        <label>endX</label>
        <input
          type="text"
          value={endX}
          onChange={(event) => {
            setEndX(event.currentTarget.value);
          }}
        />
        <label>endY</label>
        <input
          type="text"
          value={endY}
          onChange={(event) => {
            setEndY(event.currentTarget.value);
          }}
        />
        <br />
        {gameboard.board.map((val, index) => {
          return (
            <li key={index}>
              {val.map((x, index2) => {
                if (index2 % 2 === 1 && index % 2 === 1) {
                  return " ";
                }
                if (index2 % 2 === 0 && index % 2 === 1) {
                  if (gameboard.board[index][index2] === 1) {
                    return "=";
                  }
                  return "_";
                }
                if (index % 2 === 0 && index2 % 2 === 1) {
                  if (gameboard.board[index][index2] === 1) {
                    return "||";
                  }
                  return "|";
                } else return x;
              })}
            </li>
          );
        })}
        <button disabled={!turn} onClick={upHandler2}>
          Up2
        </button>
        <button disabled={!turn} onClick={leftHandler2}>
          left2
        </button>
        <button disabled={!turn} onClick={rightHandler2}>
          right2
        </button>
        <button disabled={!turn} onClick={downHandler2}>
          down2
        </button>
        <button disabled={!turn} onClick={onSubmitHandler2}>
          makeWall2
        </button>
        <p>{turn}</p>
      </div>
      <div id="video-grid"></div>
      {/* <div id="video-grid" ref={videoGrid}></div> */}
    </>
  );
}

export default withRouter(GamePage);