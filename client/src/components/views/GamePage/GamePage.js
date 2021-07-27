import React, { useState,useEffect } from 'react'
import { Board, Player, existPath } from './tools'
import { withRouter } from 'react-router'
import Axios from 'axios'

function GamePage(props) {
    var qs = require('qs')
    const socket = props.socket
    const [gameboard, setGameboard] = useState(new Board())
    const [startX, setStartX] = useState("")
    const [startY, setStartY] = useState("")
    const [endX, setEndX] = useState("")
    const [endY, setEndY] = useState("")
    const [player1, setplayer1] = useState(new Player(0,8,[16,8]))
    const [player2, setplayer2] = useState(new Player(16, 8,[0,8]))
    const initTurn = Number(Object.values(qs.parse(props.location.search))[1])
    const [turn, setTurn] = useState(initTurn)
    const roomID = Object.values(qs.parse(props.location.search))[0]

    const upHandler1 = () =>{
        const k = player1.goto('up', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player1)
            setTurn((turn+1)%2)
        }
    }
    const leftHandler1 = () =>{
        const k = player1.goto('left', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player1)
            setTurn((turn+1)%2)
        }
    }
    const rightHandler1 = () =>{
        const k = player1.goto('right', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player1)
            setTurn((turn+1)%2)
        }
    }
    const downHandler1 = () =>{
        const k = player1.goto('down', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player1)
            setTurn((turn+1)%2)
        }
    }
    

    const upHandler2 = () =>{
        const k = player2.goto('up', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            setTurn((turn+1)%2)
            socket.send(`{"roomID":"${roomID}", "message":"Move_Up"}`)
            
        }
    }
    const leftHandler2 = () =>{
        const k = player2.goto('left', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            setTurn((turn+1)%2)
            socket.send(`{"roomID":"${roomID}", "message":"Move_Left"}`)
            
        }
    }
    const rightHandler2 = () =>{
        const k = player2.goto('right', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            setTurn((turn+1)%2)
            socket.send(`{"roomID":"${roomID}", "message":"Move_Right"}`)
            
        }
    }
    const downHandler2 = () =>{
        const k = player2.goto('down', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            setTurn((turn+1)%2)
            socket.send(`{"roomID":"${roomID}", "message":"Move_Down"}`)
            
        }
    }

    const onSubmitHandler1 = () => {
        if(gameboard.makeWall([startX,startY], [endX,endY])){
            gameboard.updateCannotMakeWall([player1,player2])
            console.log(gameboard.board)
            setGameboard(Object.create(gameboard))
            setTurn((turn+1)%2)
        }
    }
    const onSubmitHandler2 = () => {
        if(gameboard.makeWall([startX,startY], [endX,endY])){
            gameboard.updateCannotMakeWall([player1,player2])
            console.log(gameboard.board)
            setGameboard(Object.create(gameboard))
            setTurn((turn+1)%2)
            socket.send(`{"roomID":"${roomID}", "message":"Make_Wall", "startX":"${startX}", "startY":"${startY}", "endX":"${endX}", "endY":"${endY}"}`)
        }
    }
    useEffect(() => {
        console.log("zz")
        socket.addEventListener('message', (data) => {
            let k = JSON.parse(data.data)
            console.log(k)
            if(k.message==="Move_Up"){
                upHandler1()
            }
            if(k.message==="Move_Left"){
                leftHandler1()
            }
            if(k.message==="Move_Right"){
                rightHandler1()
            }
            if(k.message==="Move_Down"){
                downHandler1()
            }
            if(k.message==="Make_Wall"){
                setStartX(k.startX)
                setStartY(k.startY)
                setEndX(k.endX)
                setEndY(k.endY)
                onSubmitHandler1()
            }
        })
    })


    

    return (
        <div>
            <label>startX</label>
            <input type="text" value={startX} onChange={(event) =>{setStartX(event.currentTarget.value)}} />
            <label>startY</label>
            <input type="text" value={startY} onChange={(event) => {setStartY(event.currentTarget.value)}} />
            <label>endX</label>
            <input type="text" value={endX} onChange={(event) => {setEndX(event.currentTarget.value)}} />
            <label>endY</label>
            <input type="text" value={endY} onChange={(event) => {setEndY(event.currentTarget.value)}} />
            <br />
        {gameboard.board.map((val, index) => {
            return(
                <li key={index}>
                    {val.map((x, index2)=>{
                        if(index2%2===1 && index%2===1){
                            return (" ")
                        }
                        if(index2%2===0 && index%2===1){
                            if(gameboard.board[index][index2]===1){
                                return("=")
                            }
                            return("_")
                        }
                        if(index%2===0 && index2%2===1){
                            if(gameboard.board[index][index2]===1){
                                return("||")
                            }
                            return("|")
                        }
                        else return (x)
                    })}
                </li>
            )
            })}
        <button disabled={!turn} onClick={upHandler2}>Up2</button>
        <button disabled={!turn} onClick={leftHandler2}>left2</button>
        <button disabled={!turn} onClick={rightHandler2}>right2</button>
        <button disabled={!turn} onClick={downHandler2}>down2</button>
        <button disabled={!turn} onClick={onSubmitHandler2}>makeWall2</button>
        <p>{turn}</p>
        </div>
    )


}

export default withRouter(GamePage)
