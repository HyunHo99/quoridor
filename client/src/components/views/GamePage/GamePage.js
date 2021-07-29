import React, { useState, useEffect } from 'react'
import { Board, Player, existPath } from './tools'
import { withRouter } from 'react-router'

import Wall_Img from '../../../images/wall.png'
import Rabbit_Img from '../../../images/rabbit_board.png'
import Shark_Img from '../../../images/shark_board.png'
import Turtle_Img from '../../../images/turtle_board.png'
import Rat_Img from '../../../images/rat_board.png'
import Black_Img from '../../../images/black.png'
import Background_Img from '../../../images/background.png'
import Void_Img from '../../../images/void.png'
import Red_Img from '../../../images/red.png'


const socket = new WebSocket('ws://143.248.194.208:5000')



function GamePage(props) {
    var qs = require('qs')

    const [gameboard, setGameboard] = useState(new Board())
    const [player1, setplayer1] = useState(new Player(0, 8, [16, 8]))
    const [player2, setplayer2] = useState(new Player(16, 8, [0, 8]))
    const [turn, setTurn] = useState(0)
    const roomID = Object.values(qs.parse(props.location.search))[0]
    const Im_Player = Number(Object.values(qs.parse(props.location.search))[1])
    const temp = new Array(19).fill(0)
    const [controlState, setControlState] = useState(0)
    const [wallPoints, setWallPoints] = useState([])

    useEffect(() => {
        setTurn(Im_Player)
        socket.addEventListener('message', (data) => {
            let k = JSON.parse(data.data)
            console.log(k)
            if (k.roomID === roomID) {
                if (k.message === "Move_Up") {
                    upHandler1()
                }
                if (k.message === "Move_Left") {
                    leftHandler1()
                }
                if (k.message === "Move_Right") {
                    rightHandler1()
                }
                if (k.message === "Move_Down") {
                    downHandler1()
                }
                if (k.message === "Make_Wall") {
                    let a = String(k.startX)
                    let b = String(k.startY)
                    let c = String(k.endX)
                    let d = String(k.endY)
                    console.log(a, b, c, d)
                    onSubmitHandler1()
                    if (gameboard.makeWall([a, b], [c, d])) {
                        gameboard.updateCannotMakeWall([player1, player2])
                        console.log(gameboard.board)
                        setGameboard(Object.create(gameboard))
                        setTurn((turn + 1) % 2)
                    }
                }


            }
        })
        
    }, [])

    const Game_End = (who) => {
        if (who === 2) {
            props.history.push(`/resultPage_win`)
        } else {
            props.history.push(`/resultPage_loose`)
        }
    }

    const checkWin = function (player, who) {
        if (player.y === player.destination[0] && player.x === player.destination[1]) {
            console.log(who)
            Game_End(who)
            return true
        }
        else return false
    }

    const upHandler1 = () => {
        const k = player1.goto('up', gameboard.board)
        if (k[1]) {
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player1)
            setTurn((turn + 1) % 2)
            checkWin(player1, 1)
        }
    }
    const leftHandler1 = () => {
        const k = player1.goto('left', gameboard.board)
        if (k[1]) {
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player1)
            setTurn((turn + 1) % 2)
            checkWin(player1, 1)
        }
    }
    const rightHandler1 = () => {
        const k = player1.goto('right', gameboard.board)
        if (k[1]) {
            setTurn((turn + 1) % 2)
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player1)
            checkWin(player1, 1)
        }
    }
    const downHandler1 = () => {
        const k = player1.goto('down', gameboard.board)
        if (k[1]) {
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player1)
            console.log(turn)
            setTurn((turn + 1) % 2)
            checkWin(player1, 1)
        }
    }
    const upHandler2 = () => {
        const k = player2.goto('up', gameboard.board)
        if (k[1]) {
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            setTurn((turn + 1) % 2)
            socket.send(`{"roomID":"${roomID}", "message":"Move_Up"}`)
            checkWin(player2, 2)
        }

    }
    const leftHandler2 = () => {
        const k = player2.goto('left', gameboard.board)
        if (k[1]) {
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            setTurn((turn + 1) % 2)
            socket.send(`{"roomID":"${roomID}", "message":"Move_Left"}`)
            checkWin(player2, 2)
        }
    }
    const rightHandler2 = () => {
        const k = player2.goto('right', gameboard.board)
        if (k[1]) {
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            console.log(player2.x, player2.y)
            setTurn((turn + 1) % 2)
            socket.send(`{"roomID":"${roomID}", "message":"Move_Right"}`)
            checkWin(player2, 2)
        }
    }
    const downHandler2 = () => {
        const k = player2.goto('down', gameboard.board)
        if (k[1]) {
            setGameboard(k[0])
            console.log(gameboard)
            console.log(player2)
            setTurn((turn + 1) % 2)
            socket.send(`{"roomID":"${roomID}", "message":"Move_Down"}`)
            checkWin(player2, 2)
        }
    }
    const onSubmitHandler1 = () => {

    }
    const onSubmitHandler2 = ([startX, startY], [endX, endY]) => {
        if (gameboard.makeWall([startX, startY], [endX, endY])) {
            gameboard.updateCannotMakeWall([player1, player2])
            console.log(gameboard.board)
            setGameboard(Object.create(gameboard))
            setTurn((turn + 1) % 2)
            socket.send(`{"roomID":"${roomID}", "message":"Make_Wall", "startX":"${startX}", "startY":"${startY}", "endX":"${endX}", "endY":"${endY}"}`)
        }
    }

    const ChooseMoveHandler = () =>{
        setControlState(1)
        setWallPoints([])
    }

    const ChooseMakeWallHandler = () =>{
        setControlState(2)
    }

    const OnClickHandler_MakeWall = (x, y) => () =>{
        console.log(x,y,"Clicked")
        if(controlState===2){
            if(wallPoints.length===2){
                onSubmitHandler2(wallPoints,[x,y])
                setWallPoints([])
                console.log(wallPoints)
            }
            else if(wallPoints.length>2){
                console.log("something wrong")
            }
            else{
                setWallPoints([x,y])
            }
        }
    }
    function MakeWall_Bt(x,y){
        return (<img src={Black_Img} onMouseOver={(e)=> e.currentTarget.src=Red_Img}
        onMouseOut={(e) => e.currentTarget.src=Black_Img}
         onClick={OnClickHandler_MakeWall(x,y)} className="MakeWall_Bt BackColor "></img>)
    }
    

    return (
        <div>
            <div className="BackBoard BackColor">
                <div className="Board">
                    {temp.map((i, index) => {
                        if (index % 2 == 0 &&index!==0 && index!==18) {
                            return (MakeWall_Bt(index-1,-1))
                        }
                        else {
                            return (<img src={Void_Img} className="Row-Wall BackColor" ></img>)
                        }
                    })}
                </div>
                {gameboard.board.map((val, index) => {
                    return (
                        <div className="Board" key={index}>
                            {[index].map(i => { if (i % 2 === 1) return (MakeWall_Bt(-1,index))})}
                            {val.map((x, index2) => {
                                if (index2 % 2 === 1 && index % 2 === 1) {
                                    if (x === 1) return (MakeWall_Bt(index2,index))
                                    else return (MakeWall_Bt(index2,index))
                                }
                                if (index2 % 2 === 0 && index % 2 === 1) {
                                    if (gameboard.board[index][index2] === 1) {
                                        return (<img className="Row-Wall BackColor" src={Wall_Img}></img>)
                                    }
                                    if (gameboard.board[index][index2] === -1) {
                                        return (<img src={Red_Img} className="Row-Wall BackColor" ></img>)
                                    }
                                    return (<img src={Void_Img} className="Row-Wall BackColor" ></img>)
                                }
                                if (index % 2 === 0 && index2 % 2 === 1) {
                                    if (gameboard.board[index][index2] === 1) {
                                        return (<img className="Col-Wall BackColor" src={Wall_Img}></img>)
                                    }
                                    if (gameboard.board[index][index2] === -1) {
                                        return (<img src={Red_Img} className="Col-Wall BackColor" ></img>)
                                    }
                                    return (<img src={Void_Img} className="Col-Wall BackColor" ></img>)
                                }
                                if (x === 1) return (<img className="Square" src={Shark_Img} />)
                                if (x === 2) return (<img className="Square" src={Rabbit_Img} />)
                                return (<img src={Void_Img} className="Square" />)
                            })}
                            {[index].map(i => { if (i % 2 === 1) return (MakeWall_Bt(17,index)) })}
                        </div>

                    )
                })}
                <div className="Board">
                    {temp.map((i, index) => {
                        if (index % 2 == 0 &&index!==0 && index!==18) {
                            return (MakeWall_Bt(index-1,17))
                        }
                        else {
                            return (<img src={Void_Img} className="Row-Wall BackColor" ></img>)
                        }
                    })}
                </div>
            </div>
            {/* <button disabled={!turn} onClick={upHandler2}>Up2</button>
        <button disabled={!turn} onClick={leftHandler2}>left2</button>
        <button disabled={!turn} onClick={rightHandler2}>right2</button>
        <button disabled={!turn} onClick={downHandler2}>down2</button>
        <button disabled={!turn} onClick={onSubmitHandler2}>makeWall2</button> */}
            <button disabled={false} onClick={ChooseMoveHandler}>Choose Move</button>
            <button disabled={false} onClick={ChooseMakeWallHandler}>Choose MakeWall</button>


            {(controlState==1) && <button disabled={false} onClick={upHandler2}>Up2</button>}
            {(controlState==1) && <button disabled={false} onClick={leftHandler2}>left2</button>}
            {(controlState==1) && <button disabled={false} onClick={rightHandler2}>right2</button>}
            {(controlState==1) && <button disabled={false} onClick={downHandler2}>down2</button>}
            {(controlState==2) && <button disabled={false} onClick={onSubmitHandler2}>makeWall2</button>}
            <p>{turn}</p>
        </div>
    )


}

export default withRouter(GamePage)
