import React, { useState } from 'react'
import {useDispatch} from 'react-redux'
import { withRouter } from 'react-router'
import { getRoom } from '../../../_actions/room_action'


function Rooms() {
    const dispatch = useDispatch()
    const [rooms, setRooms] = useState([])

    const getRooms = () => {
        dispatch(getRoom())
            .then(response =>{
                if(response.payload.success){
                    setRooms(response.payload.rooms)
                } else{
                    console.log('방 불러오기 실패')
                }
            })
    }
    getRooms()
    return (
        <div>
            {rooms.map(room =>{
                return(
                    <button>{room.roomName}</button>
                )
            })}
        </div>
    )
}

export default Rooms
