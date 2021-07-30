import React, { useRef, useEffect, useState } from "react";
import { withRouter } from "react-router";
import Axios from "axios";
import { Card, Button } from "antd";
import "./GameRoom.css";
import rabbit from "../../../images/rabbit.png";
import rat from "../../../images/rat.png";
import shark from "../../../images/shark.png";
import turtle from "../../../images/turtle.png";



function GameRoom(props) {
    var qs = require("qs");
    const roomID = Object.values(qs.parse(props.location.search))[0];
    const [userNames, setUserNames] = useState([]);
    const [userImgs, setUserImgs] = useState([]);
    const [readyed, setReadyed] = useState(false);
    const animalsList = [rabbit, shark, rat, turtle];
    const socket = props.socket

    const room = props.location.state.detail
    console.log(room)
    useEffect(() => {
            socket.addEventListener('message',(data)=>{
                let k = JSON.parse(data.data)
                console.log(k)
                    if(k.roomID===roomID){
                    if(k.message ==="Game_Start"){
                        console.log(userNames)
                        let body = {
                            url: roomID,
                        };
                        Axios.post("/api/startGame", body).then(response =>{
                            console.log(response)
                            props.history.push({
                                pathname : `/game`,
                                search : `?id=${roomID}&turn=${k.turn}`,
                                state : {userNames : response.data.userNameList, userImgs : response.data.userImageList,
                                     userName : response.data.userName}
                            })
                        })
                        
                    }
                    if(k.message ==="Ready_Success"){
                        console.log(k.message)
                        setReadyed(true)
                    }
                    if(k.message === "User_Come"){
                        if(k.roomID === roomID){
                            setUserNames(k.userNameList.split(","))
                            setUserImgs(k.userImageList.split(","))
                        }
            
                    }
            }
            })
            socket.addEventListener('open', ()=>{
            socket.send(`{"roomID": "${roomID}", "message":"Request_Setup"}`)
                console.log("message send")
            })
    return () => {};
  }, []);

    const gameStartHandler = () => {
    socket.send(`{"roomID": "${roomID}", "message":"Game_Start"}`);
    };

    const backHandler = async () => {
    let body = {
        url: roomID,
    };
    await Axios.post("/api/outRoom", body);
    socket.send(`{"roomID": "${roomID}", "message":"Request_Setup"}`);
    window.history.back();
    };

    return (
    <div
        className="site-card-wrapper"
        style={{ display: "flex", flexDirection: "column" }}
    >
        <Card
        title={<b className="head">방 이름 : {room.roomName}</b>}
        bordered={false}
        extra={
            <a className="head" onClick={backHandler}>
            방 나가기
            </a>
        }
        style={{ height: "120vh", background: "#f0f2f5" }}
        >
        <div className="innerRoom">
            참가자 :
            {userNames.map((user, index) => {
                return (
                <div className="userCard">
                    <img
                    className="userImage"
                    src={animalsList[userImgs[index] - 1]}
                    style={{ height: "20vh", width: "20vh" }}
                    />
                    <div className="userText">{userNames[index]}</div>
                </div>
                );
            })}
            <p/>
            <Button size="large" disabled={readyed} onClick={gameStartHandler}>
            준비!
            </Button>
        </div>
        </Card>
    </div>
    );
    }

export default withRouter(GameRoom);
