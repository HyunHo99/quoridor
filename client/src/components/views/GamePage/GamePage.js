import React, { useState } from 'react'
import { Board, Player } from './tools'
function GamePage() {
    const [gameboard, setGameboard] = useState(new Board())
    let player = new Player(16, 8)
    console.log(gameboard)
    console.log(player)

    const upHandler = () =>{
        setGameboard(player.goto('up', gameboard)[0])
        console.log(gameboard)
        console.log(player)
    }
    const leftHandler = () =>{
        setGameboard(player.goto('left', gameboard)[0])
        console.log(gameboard)
        console.log(player)
    }
    const rightHandler = () =>{
        setGameboard(player.goto('right', gameboard)[0])
        console.log(gameboard)
        console.log(player)
    }
    const downHandler = () =>{
        setGameboard(player.goto('down', gameboard)[0])
        console.log(gameboard)
        console.log(player)
    }
    

    return (
        <div>

        
        <button onClick={upHandler}>Up</button>
        <button onClick={leftHandler}>left</button>
        <button onClick={rightHandler}>right</button>
        <button onClick={downHandler}>down</button>
        {gameboard.board.map(x =>{
                return (
                    <ol>
                        {x}
                    </ol>
                )
            })}
        </div>
    )


}

export default GamePage
