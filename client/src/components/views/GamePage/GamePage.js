import React, { useState,useEffect } from 'react'
import { Board, Player, existPath } from './tools'
import { withRouter } from 'react-router'
import Axios from 'axios'

function GamePage(props) {
    var qs = require('qs')
    const [gameboard, setGameboard] = useState(new Board())
    const [startX, setStartX] = useState("")
    const [startY, setStartY] = useState("")
    const [endX, setEndX] = useState("")
    const [endY, setEndY] = useState("")
    const [player1, setplayer1] = useState(new Player(0,8,[16,8]))
    const [player2, setplayer2] = useState(new Player(16, 8,[0,8]))
    const [turn, setTurn] = useState(0)
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
        }
    }
    const leftHandler2 = () =>{
        const k = player2.goto('left', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            setTurn((turn+1)%2)
        }
    }
    const rightHandler2 = () =>{
        const k = player2.goto('right', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            setTurn((turn+1)%2)
        }
    }
    const downHandler2 = () =>{
        const k = player2.goto('down', gameboard.board)
        if(k[1]){
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            setTurn((turn+1)%2)
        }
    }


    useEffect(() => {
        let body = {
            roomID : roomID
        }
        Axios.post('/getTurn', body).then((response) =>{
            if(response.data.success){
                setTurn(response.data.turn)
            }
            else{
                console.log('game start fail')
            }
        })
    })

    const onSubmitHandler1 = () => {
        if(gameboard.makeWall([startX,startY], [endX,endY])){
            gameboard.updateCannotMakeWall([player1,player2])
            console.log(gameboard.board)
            setGameboard(Object.create(gameboard))
            setTurn((turn+1)%2)
        }
    }
    

    return (
        <div>
        <button disabled={turn} onClick={upHandler1}>Up1</button>
        <button disabled={turn} onClick={leftHandler1}>left1</button>
        <button disabled={turn} onClick={rightHandler1}>right1</button>
        <button disabled={turn} onClick={downHandler1}>down1</button>
            <label>startX</label>
            <input type="text" value={startX} onChange={(event) =>{setStartX(event.currentTarget.value)}} />
            <label>startY</label>
            <input type="text" value={startY} onChange={(event) => {setStartY(event.currentTarget.value)}} />
            <label>endX</label>
            <input type="text" value={endX} onChange={(event) => {setEndX(event.currentTarget.value)}} />
            <label>endY</label>
            <input type="text" value={endY} onChange={(event) => {setEndY(event.currentTarget.value)}} />
            <br />
            <button disabled={turn} onClick={onSubmitHandler1}>makeWall1</button>
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
        <button disabled={!turn} onClick={onSubmitHandler1}>makeWall2</button>
        <p>{turn}</p>
        </div>
    )


}

export default withRouter(GamePage)
