import React, {useState} from 'react'
import {makeRoom, joinRoom} from '../../../_actions/room_action'
import {useDispatch} from 'react-redux'
import { Button } from 'antd';
import { withRouter } from 'react-router'
const socket = new WebSocket('ws://143.248.194.208:5000')

function MakeRoom(props) {
    
    const dispatch = useDispatch()
    const [roomName, setRoomName] = useState("")
    
    const [Password, setPassword] = useState("")
    



    const onSubmitHandler = (event) => {
        event.preventDefault()
        let body = {
            roomName: roomName,
            password: Password
        }
        dispatch(makeRoom(body))
            .then(response =>{
                if(response.payload.success){
                    let joinbody = {
                        url: response.payload.room.url,
                        password: Password
                    }
                    dispatch(joinRoom(joinbody)).then(response2 =>{
                        if(response2.payload.joinSuccess){
                            socket.send(`{"roomID": "${response.payload.room.url}", "message":"Request_Setup"}`)
                            props.history.push({
                                pathname : `/gameRoom`,
                                search : `?id=${response.payload.room.url}`,
                                state : {detail : response.payload.room}
                            })
                        }else{
                            console.log('error')
                        }
                    })
                } else{
                    alert('로그인 후 이용하세요.')
                }
            })
    }
    
    return (
        <div>            
                <label>방이름 : </label>
                <input type="text" value={roomName} onChange={(event) => {setRoomName(event.currentTarget.value)}} />
                <p/>
                <label>비밀번호 : </label>
                <input type="password" value={Password} onChange={(event) => {setPassword(event.currentTarget.value)}} />
                <p />
                <Button size="large" disabled={roomName.length<3} onClick={onSubmitHandler}>
                    방 만들기
                </Button>
        </div>
    )
}

export default withRouter(MakeRoom)
