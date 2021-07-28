import React, { useState, useEffect } from 'react'
import {useDispatch} from 'react-redux'
import { withRouter } from 'react-router'
import { getRoom, joinRoom } from '../../../_actions/room_action'
import Modal from '../../modal/Modal';
import { Card, Col, Row } from 'antd';
const socket = new WebSocket('ws://143.248.194.208:5000')


function Rooms(props) {
    const dispatch = useDispatch()
    const [rooms, setRooms] = useState([[]])
    const [modalOpen, setModalOpen] = useState(false)
    const [password, setPassword] = useState("")
    const [modalRoom, setModalRoom] = useState()
    


    const openModal = (room) => () => {
        setModalOpen(true)
        setModalRoom(room)
        setPassword("")
      }
    const closeModal = () => {
        setModalOpen(false)
      }

    const getRooms = () => {
        dispatch(getRoom())
            .then(response =>{
                if(response.payload.success){
                    let chunks=splitArrayIntoChunksOfLen(response.payload.rooms,4)
                    console.log(chunks)
                    setRooms(chunks)
                } else{
                    console.log('방 불러오기 실패')
                }
            })
    }
    const joinHandler = () =>{
        console.log(modalRoom)
        let body = {
            password : password,
            url : modalRoom.url
        }
        dispatch(joinRoom(body)).then(response =>{
            if(response.payload.joinSuccess){
                socket.send(`{"roomID": "${modalRoom.url}", "message":"Request_Setup"}`)
                props.history.push({
                    pathname : `/gameRoom`,
                    search : `?id=${modalRoom.url}`,
                    state : {detail : modalRoom}
                })
            }else{
                alert('정원이 가득 찼거나, 패스워드가 틀립니다')
            }
        })
        
    }



    useEffect(() => {
        getRooms()
    }, [])

    function splitArrayIntoChunksOfLen(arr, len) {
        var chunks = [], i = 0, n = arr.length;
        while (i < n) {
          chunks.push(arr.slice(i, i += len));
        }
        return chunks;
      }
    const getRoomContents = roomChunk =>{
        let content =[]
        for(var i=0; i<roomChunk.length; i++) {
            console.log(roomChunk[i])
            content.push(
            <Col span={6}>
                <Modal open={ modalOpen } close={ closeModal } header="패스워드를 입력하세요">
                    <label>방 비밀번호 : </label>
                    <input type="password" value={password} onChange={(event) => setPassword(event.currentTarget.value)}></input>
                    <p/>
                    <button onClick={joinHandler}>입장</button>
                </Modal>
                <Card title={roomChunk[i].roomName} bordered={false}>
                    <p>인원 : {roomChunk[i].clientList.length}/2</p>
                    <button onClick={openModal(roomChunk[i])}>입장</button>
                </Card>
            </Col>)
        }
        return content
    }

    return (
        <div>
            {rooms.map(roomChunk =>{
                return(
                    <div>
                    <Row gutter={16}>
                      {getRoomContents(roomChunk)}
                    </Row>
                  </div>
                )   
            })}
        </div>
    )
}

export default withRouter(Rooms)