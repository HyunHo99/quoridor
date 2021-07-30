import React, { useState, useEffect } from "react";
import { Board, Player, existPath } from "./tools";
import { withRouter } from "react-router";
import VideoChatApp from "../../connection/videoChat";
import Wall_Img from "../../../images/wall.png";
import Rabbit_Img from "../../../images/rabbit_board.png";
import Shark_Img from "../../../images/shark_board.png";
import Turtle_Img from "../../../images/turtle_board.png";
import Rat_Img from "../../../images/rat_board.png";
import Black_Img from "../../../images/black.png";
import Background_Img from "../../../images/background.png";
import Void_Img from "../../../images/void.png";
import Red_Img from "../../../images/red.png";
import Thumb_Rabbit from "../../../images/rabbit.png";
import Thumb_Shark from "../../../images/shark.png";
import Thumb_Turtle from "../../../images/turtle.png";
import Thumb_Rat from "../../../images/rat.png";

function GamePage(props) {
  var qs = require("qs");
  const imgList = [Rabbit_Img, Shark_Img, Rat_Img, Turtle_Img];
  const thumbList = [Thumb_Rabbit, Thumb_Shark, Thumb_Rat, Thumb_Turtle];
  const userNames = props.location.state.userNames;
  const userName = props.location.state.userName;
  // const userNames = ["2@2", "111"];
  // const userName = "111";
  // const roomID = "100";
  console.log(userNames);
  console.log(userName);
  const userImgs = props.location.state.userImgs;
  // const userImgs = [Rabbit_Img, Shark_Img];
  const playerIndex = userNames.findIndex((i) => i == String(userName));

  const player_Thumb_Img = thumbList[userImgs[playerIndex] - 1];
  const compatitor_Thumb_Img =
    thumbList[userImgs[playerIndex == 0 ? 1 : 0] - 1];
  const player_Board_Img = imgList[userImgs[playerIndex] - 1];
  const compatitor_Board_Img = imgList[userImgs[playerIndex == 0 ? 1 : 0] - 1];

  const socket = props.socket;
  const gameboard_item = JSON.parse(localStorage.getItem("gameboard"));
  const turn_item = localStorage.getItem("turn");
  const player1_item = JSON.parse(localStorage.getItem("player1"));
  const player2_item = JSON.parse(localStorage.getItem("player2"));
  const [gameboard, setGameboard] = useState(
    gameboard_item == null ? new Board() : new Board(gameboard_item.board)
  );
  const [player1, setplayer1] = useState(
    player1_item == null
      ? new Player(0, 8, [16, 8])
      : new Player(player1_item.y, player1_item.x, player1_item.destination)
  );
  const [player2, setplayer2] = useState(
    player2_item == null
      ? new Player(16, 8, [0, 8])
      : new Player(player2_item.y, player2_item.x, player2_item.destination)
  );
  const [turn, setTurn] = useState(0);
  const roomID = Object.values(qs.parse(props.location.search))[0];
  const Im_Player = Number(Object.values(qs.parse(props.location.search))[1]);
  const [wallPoints, setWallPoints] = useState([]);

  const messageHandler = (data) => {
    let k = JSON.parse(data.data);
    console.log(k);
    if (k.roomID === roomID) {
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
        console.log("message", gameboard.board);
        downHandler1();
      }
      if (k.message === "Make_Wall") {
        let a = String(k.startX);
        let b = String(k.startY);
        let c = String(k.endX);
        let d = String(k.endY);
        console.log(a, b, c, d);
        if (gameboard.makeWall([a, b], [c, d])) {
          gameboard.updateCannotMakeWall([player1, player2]);
          console.log(gameboard.board);
          setGameboard(new Board(gameboard.board));
          setTurn((turn + 1) % 2);
        }
      }
    }
  };

  useEffect(() => {
    console.log(turn_item);
    setTurn(turn_item == null ? Im_Player : Number(turn_item));
    socket.addEventListener("message", messageHandler);
    return () => {
      socket.removeEventListener("message", messageHandler);
    };
  }, []);

  const Game_End = (who) => {
    if (who === 2) {
      props.history.push(`/resultPage_win`);
    } else {
      props.history.push(`/resultPage_lose`);
    }
  };

  const checkWin = function (player, who) {
    if (
      player.y === player.destination[0] &&
      player.x === player.destination[1]
    ) {
      console.log(who);
      Game_End(who);
      return true;
    }
  };

  useEffect(() => {
    localStorage.setItem("gameboard", JSON.stringify(gameboard));
    localStorage.setItem("turn", turn);
    localStorage.setItem("player1", JSON.stringify(player1));
    localStorage.setItem("player2", JSON.stringify(player2));
  }, [gameboard, turn, player1, player2]);

  const upHandler1 = () => {
    console.log("upHandler1 run", gameboard.board, player1);
    const k = player1.goto("up", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log("player1", player1);
      setTurn((turn + 1) % 2);
      checkWin(player1, 1);
    }
  };
  const leftHandler1 = () => {
    console.log("leftHandler1 run", gameboard.board, player1);
    const k = player1.goto("left", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log("player1", player1);
      setTurn((turn + 1) % 2);
      checkWin(player1, 1);
    }
  };
  const rightHandler1 = () => {
    console.log("rightHandler1 run", gameboard.board, player1);
    const k = player1.goto("right", gameboard.board);
    if (k[1]) {
      setTurn((turn + 1) % 2);
      setGameboard(k[0]);
      console.log(gameboard);
      console.log("player1", player1);
      checkWin(player1, 1);
    }
  };
  const downHandler1 = () => {
    console.log("downHandler1 run", gameboard.board, player1);
    console.log("player1", player1);
    console.log(gameboard.board);
    const k = player1.goto("down", gameboard.board);
    console.log(k);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log("player1", player1);
      console.log(turn);
      setTurn((turn + 1) % 2);
      checkWin(player1, 1);
    }
  };
  const upHandler2 = () => {
    setWallPoints([]);
    const k = player2.goto("up", gameboard.board);
    console.log(k);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player2);
      setTurn((turn + 1) % 2);
      socket.send(`{"roomID":"${roomID}", "message":"Move_Up"}`);
      checkWin(player2, 2);
    }
  };
  const leftHandler2 = () => {
    setWallPoints([]);
    const k = player2.goto("left", gameboard.board);
    console.log(k);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player2);
      setTurn((turn + 1) % 2);
      socket.send(`{"roomID":"${roomID}", "message":"Move_Left"}`);
      checkWin(player2, 2);
    }
  };
  const rightHandler2 = () => {
    setWallPoints([]);
    const k = player2.goto("right", gameboard.board);
    console.log(k);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player2);
      console.log(player2.x, player2.y);
      setTurn((turn + 1) % 2);
      socket.send(`{"roomID":"${roomID}", "message":"Move_Right"}`);
      checkWin(player2, 2);
    }
  };
  const downHandler2 = () => {
    setWallPoints([]);
    const k = player2.goto("down", gameboard.board);
    console.log(k);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player2);
      setTurn((turn + 1) % 2);
      socket.send(`{"roomID":"${roomID}", "message":"Move_Down"}`);
      checkWin(player2, 2);
    }
  };
  const onSubmitHandler2 = ([startX, startY], [endX, endY]) => {
    if (gameboard.makeWall([startX, startY], [endX, endY])) {
      gameboard.updateCannotMakeWall([player1, player2]);
      console.log(gameboard.board);
      setGameboard(new Board(gameboard.board));
      setTurn((turn + 1) % 2);
      socket.send(
        `{"roomID":"${roomID}", "message":"Make_Wall", "startX":"${startX}", "startY":"${startY}", "endX":"${endX}", "endY":"${endY}"}`
      );
    }
  };

  const OnClickHandler_MakeWall = (x, y) => () => {
    console.log(x, y, "Clicked");
    if (turn) {
      if (wallPoints.length === 2) {
        onSubmitHandler2(wallPoints, [x, y]);
        setWallPoints([]);
        console.log(wallPoints);
      } else if (wallPoints.length > 2) {
        console.log("something wrong");
      } else {
        setWallPoints([x, y]);
      }
    }
  };
  function MakeWall_Bt(x, y) {
    return (
      <img
        src={Black_Img}
        onMouseOver={(e) => (e.currentTarget.src = Red_Img)}
        onMouseOut={(e) => (e.currentTarget.src = Black_Img)}
        onClick={OnClickHandler_MakeWall(x, y)}
        className="MakeWall_Bt BackColor "
      ></img>
    );
  }

  return (
    <div>
      <div className="BackBoard BackColor">
        <div className="CompetitorProfile">
          <div className="Comp_Control">
            <div className="UserProfile">
              <img className="Profile_Img" src={compatitor_Thumb_Img} />
              {/* <div className="Profile_Text">
                {userNames[playerIndex == 0 ? 1 : 0]}
              </div> */}
            </div>
            <div className="Comp_text">
              {turn == 1 ? "" : "상대가 고민중..."}
            </div>
          </div>
        </div>

        <div className="GamePan">
          <div className="Board">
            {new Array(19).fill(0).map((i, index) => {
              if (index % 2 == 0 && index !== 0 && index !== 18) {
                return MakeWall_Bt(index - 1, -1);
              } else {
                return (
                  <img src={Void_Img} className="Row-Wall BackColor"></img>
                );
              }
            })}
          </div>
          {gameboard.board.map((val, index) => {
            return (
              <div className="Board" key={index}>
                {[index].map((i) => {
                  if (i % 2 === 1) return MakeWall_Bt(-1, index);
                })}
                {val.map((x, index2) => {
                  if (index2 % 2 === 1 && index % 2 === 1) {
                    if (x === 1) return MakeWall_Bt(index2, index);
                    else return MakeWall_Bt(index2, index);
                  }
                  if (index2 % 2 === 0 && index % 2 === 1) {
                    if (gameboard.board[index][index2] === 1) {
                      return (
                        <img
                          className="Row-Wall BackColor"
                          src={Wall_Img}
                        ></img>
                      );
                    }
                    if (gameboard.board[index][index2] === -1) {
                      return (
                        <img src={Red_Img} className="Row-Wall BackColor"></img>
                      );
                    }
                    return (
                      <img src={Void_Img} className="Row-Wall BackColor"></img>
                    );
                  }
                  if (index % 2 === 0 && index2 % 2 === 1) {
                    if (gameboard.board[index][index2] === 1) {
                      return (
                        <img
                          className="Col-Wall BackColor"
                          src={Wall_Img}
                        ></img>
                      );
                    }
                    if (gameboard.board[index][index2] === -1) {
                      return (
                        <img src={Red_Img} className="Col-Wall BackColor"></img>
                      );
                    }
                    return (
                      <img src={Void_Img} className="Col-Wall BackColor"></img>
                    );
                  }
                  if (x === 1)
                    return <img className="Square" src={player_Board_Img} />;
                  if (x === 2)
                    return (
                      <img className="Square" src={compatitor_Board_Img} />
                    );
                  return <img src={Void_Img} className="Square" />;
                })}
                {[index].map((i) => {
                  if (i % 2 === 1) return MakeWall_Bt(17, index);
                })}
              </div>
            );
          })}
          <div className="Board">
            {new Array(19).fill(0).map((i, index) => {
              if (index % 2 == 0 && index !== 0 && index !== 18) {
                return MakeWall_Bt(index - 1, 17);
              } else {
                return (
                  <img src={Void_Img} className="Row-Wall BackColor"></img>
                );
              }
            })}
          </div>
        </div>
        <div className="MyProfile">
          <div className="User_Control">
            <div className="UserProfile">
              <img className="Profile_Img" src={player_Thumb_Img} />
              {/* <div className="Profile_Text">{userNames[playerIndex]}</div> */}
            </div>
            <div className="Pannal">
              <div className="TurnText">
                {turn == 1 ? "나의 턴!" : "상대가 고민중..."}
              </div>
              <button disabled={!turn} onClick={upHandler2}>
                Up
              </button>
              <br />
              <button disabled={!turn} onClick={leftHandler2}>
                left
              </button>
              <button disabled={!turn} onClick={rightHandler2}>
                right
              </button>
              <br />
              <button disabled={!turn} onClick={downHandler2}>
                down
              </button>
            </div>
          </div>
        </div>
        <VideoChatApp roomid={roomID} />
      </div>
    </div>
  );
}

export default withRouter(GamePage);
