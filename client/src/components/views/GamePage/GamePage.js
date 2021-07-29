import React, { useState, useEffect } from "react";
import { Board, Player, existPath } from "./tools";
import { withRouter } from "react-router";
import Axios from "axios";

const socket = new WebSocket("ws://143.248.197.173:5000");

function GamePage(props) {
  var qs = require("qs");

  // gameboard and turn should be persistent when reloaded
  const [gameboard, setGameboard] = useState(new Board());
  const [startX, setStartX] = useState("");
  const [startY, setStartY] = useState("");
  const [yame, setYame] = useState(0);
  const [endX, setEndX] = useState("");
  const [endY, setEndY] = useState("");
  const [player1, setplayer1] = useState(new Player(0, 8, [16, 8]));
  const [player2, setplayer2] = useState(new Player(16, 8, [0, 8]));
  const [turn, setTurn] = useState(0);
  const roomID = Object.values(qs.parse(props.location.search))[0];
  const Im_Player = Number(Object.values(qs.parse(props.location.search))[1]);

  useEffect(() => {
    const gameboard_item = JSON.parse(localStorage.getItem("gameboard"));
    const turn_item = localStorage.getItem("turn");
    const player1_item = JSON.parse(localStorage.getItem("player1"));
    const player2_item = JSON.parse(localStorage.getItem("player2"));

    console.log("gameboard_item", gameboard_item);
    console.log("player2", player2_item);
    if (gameboard_item) setGameboard(gameboard_item);
    if (turn_item) setTurn(turn_item);
    if (player1_item)
      setplayer1(
        new Player(player1_item.y, player1_item.x, player1_item.destination)
      );
    if (player2_item) {
      console.log("setplayer2 function called");
      setplayer2(
        new Player(player2_item.y, player2_item.x, player2_item.destination)
      );
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("gameboard", JSON.stringify(gameboard));
    localStorage.setItem("turn", turn);
    localStorage.setItem("player1", JSON.stringify(player1));
    localStorage.setItem("player2", JSON.stringify(player2));
  }, [gameboard, turn, player1, player2]);

  //   useEffect(() => {
  //     setGameboard(JSON.parse(localStorage.getItem("gameboard")));
  //     setTurn(JSON.parse(localStorage.getItem("turn")));
  //     setplayer1(JSON.parse(localStorage.getItem("player1")));
  //     setplayer2(JSON.parse(localStorage.getItem("player2")));
  //   }, []);

  useEffect(() => {
    if (yame === 0) {
      setYame(1);
      setTurn(Im_Player);
      socket.addEventListener("message", (data) => {
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
        }
      });
    }
  }, [socket]);

  const Game_End = (who) => {
    if (who === 2) {
      props.history.push(`/resultPage_win`);
    } else {
      props.history.push(`/resultPage_loose`);
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
    } else return false;
  };

  const upHandler1 = () => {
    const k = player1.goto("up", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player1);
      setTurn((turn + 1) % 2);
      checkWin(player1, 1);
    }
  };
  const leftHandler1 = () => {
    const k = player1.goto("left", gameboard.board);
    if (k[1]) {
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player1);
      setTurn((turn + 1) % 2);
      checkWin(player1, 1);
    }
  };
  const rightHandler1 = () => {
    const k = player1.goto("right", gameboard.board);
    if (k[1]) {
      setTurn((turn + 1) % 2);
      setGameboard(k[0]);
      console.log(gameboard);
      console.log(player1);
      checkWin(player1, 1);
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
      checkWin(player1, 1);
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
      checkWin(player2, 2);
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
      checkWin(player2, 2);
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
      checkWin(player2, 2);
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
      checkWin(player2, 2);
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

  return (
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
                return <button></button>;
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
              } else return <button>{x}</button>;
            })}
          </li>
        );
      })}
      <button disabled={false} onClick={upHandler2}>
        Up2
      </button>
      <button disabled={false} onClick={leftHandler2}>
        left2
      </button>
      <button disabled={false} onClick={rightHandler2}>
        right2
      </button>
      <button disabled={false} onClick={downHandler2}>
        down2
      </button>
      <button disabled={false} onClick={onSubmitHandler2}>
        makeWall2
      </button>
      <p>{turn}</p>
    </div>
  );
}

export default withRouter(GamePage);
