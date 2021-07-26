import React, {useState} from 'react'
import {makeRoom} from '../../../_actions/room_action'
import {useDispatch} from 'react-redux'
import { withRouter } from 'react-router'

function MakeRoom(props) {
    
    const dispatch = useDispatch()
    const [roomName, setRoomName] = useState("")
    const [Password, setPassword] = useState("")
    



    const onSubmitHandler = (event) => {
        event.preventDefault()
        let body = {
            roomName: roomName,
            password: Password,
            socket: props.socket
        }
        dispatch(makeRoom(body))
            .then(response =>{
                if(response.payload.success){
                    props.history.push(`/gameRoom?id=${response.payload.room.url}`)
                } else{
                    alert('error')
                }
            })
    }
    
    return (
        <div>            
            <form style={{display: 'flex', flexDirection: 'column'}} onSubmit={onSubmitHandler}>
                <label>방이름</label>
                <input type="text" value={roomName} onChange={(event) => {setRoomName(event.currentTarget.value)}} />
                <label>방비밀번호</label>
                <input type="password" value={Password} onChange={(event) => {setPassword(event.currentTarget.value)}} />
                <br />
                <button type="submit">
                    방만들기
                </button>
                </form>
        </div>
    )
}

export default withRouter(MakeRoom)
