import React, {useRef, useEffect} from 'react'
import { withRouter } from 'react-router'
import Axios from 'axios'

function GameRoom(props) {
    var qs = require('qs')
    const roomID = Object.values(qs.parse(props.location.search))[0]
    var Out = true;


    props.socket.addEventListener('message',(data)=>{
        let k = JSON.parse(data.data)
        if(k.message ==="Game_Start"){
            Out = false
            props.history.push(`/game?id=${roomID}&turn=${k.turn}`)
        }
        if(k.message ==="Ready_Success"){
        }
    })


    useEffect(() => {
        console.log('in')
        return () => {
            async function getOut(){
                let body = {
                    url:roomID
                }
                await Axios.post('/api/outRoom', body)
            }
            if(Out) getOut().then(() =>console.log('success'))

        }
    })


    const gameStartHandler = () =>{
        props.socket.send(`{"roomID": "${roomID}", "message":"Game_Start"}`)
    }
    console.log(props.socket)


      
    return (
        <div>
            <p>{roomID}
            </p>
            <button onClick={gameStartHandler}>gameStart</button>
        </div>
    )
}

export default withRouter(GameRoom)
