import React, { useState, useEffect } from 'react'
import {useDispatch} from 'react-redux'
import { withRouter } from 'react-router'
import { getRoom, joinRoom } from '../../../_actions/room_action'
import Modal from '../../modal/Modal';

function Rooms(props) {
    const dispatch = useDispatch()
    const [rooms, setRooms] = useState([])
    const [modalOpen, setModalOpen] = useState(false)
    const [password, setPassword] = useState("")


    const openModal = () => {
        setModalOpen(true)
      }
    const closeModal = () => {
        setModalOpen(false)
      }

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
    const joinHandler = (room) =>{
        let body = {
            password : password,
            url : room.url
        }
        dispatch(joinRoom(body)).then(response =>{
            if(response.payload.joinSuccess){
                props.history.push(`/gameRoom?id=${room.url}`)
            }else{
                alert('정원이 가득 찼거나, 패스워드가 틀립니다')
            }
        })
        
    }



    useEffect(() => {
        getRooms()
    }, [])



    return (
        <div>
            {rooms.map(room =>{
                return(
                    <div>
                    <Modal open={ modalOpen } close={ closeModal } header="Create a game room">
                        <label>방 비밀번호</label>
                        <input type="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)}></input>
                        <button onClick={() => joinHandler(room)}>입장</button>
                    </Modal>
                    <button onClick={openModal}>{room.roomName}</button>
                    </div>
                )   
            })}
        </div>
    )
}

export default withRouter(Rooms)
