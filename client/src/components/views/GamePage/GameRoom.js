import React, {useRef, useEffect, useState} from 'react'
import { withRouter } from 'react-router'
import Axios from 'axios'
import { Card } from 'antd';
import "./GameRoom.css"
const socket = new WebSocket('ws://143.248.194.208:5000')

function GameRoom(props) {
    var qs = require('qs')
    const roomID = Object.values(qs.parse(props.location.search))[0]
    const [userNames, setUserNames] = useState([])
    const [readyed, setReadyed] = useState(false)
    var yame=true

    const room = props.location.state.detail
    console.log(room)
    useEffect(() => {
        if(yame){
            yame = false
            socket.addEventListener('message',(data)=>{
                let k = JSON.parse(data.data)
                console.log(k)
                    if(k.roomID===roomID){
                    if(k.message ==="Game_Start"){
                        props.history.push(`/game?id=${roomID}&turn=${k.turn}`)
                    }
                    if(k.message ==="Ready_Success"){
                        console.log(k.message)
                        setReadyed(true)
                    }
                    if(k.message === "User_Come"){
                        if(k.roomID === roomID){
                            console.log(k.userList.split(","))
                            setUserNames(k.userList.split(","))
                        }
            
                    }
            }
            })
    }
        return () => {
            
        }
    })




    const gameStartHandler = () =>{
        socket.send(`{"roomID": "${roomID}", "message":"Game_Start"}`)
    }
    
    const backHandler = async () =>{
        let body = {
            url:roomID
        }
        await Axios.post('/api/outRoom', body)
        socket.send(`{"roomID": "${roomID}", "message":"Request_Setup"}`)
        window.history.back()
    }

    return (
        <div className="site-card-wrapper"  style={{display: 'flex', flexDirection: 'column'}}>
            <Card title={room.roomName} bordered={false} extra={<a onClick={backHandler}>방 나가기</a>} style={{ height: '95vh', background: '#f0f2f5'}}>
            <div className="innerRoom">
                <p>참가자 :
                {userNames.map(user =>{
                    return(
                        <p>{user}</p>
                    )
                })}</p>
                <button disabled={readyed} onClick={gameStartHandler}>준비!</button>
            </div>
            </Card>
        </div>
        
    )
    
}

export default withRouter(GameRoom)
