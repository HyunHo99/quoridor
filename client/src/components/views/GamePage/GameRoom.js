import React, {useRef, useEffect} from 'react'
import { withRouter } from 'react-router'
import Axios from 'axios'

function GameRoom(props) {
    var qs = require('qs')
    const roomID = Object.values(qs.parse(props.location.search))[0]
    useEffect( () => {
        console.log('in')
        return () => {
            async function getOut(){
                let body = {
                    url:roomID
                }
                await Axios.post('/api/outRoom', body)
            }
            getOut().then(() =>console.log('success'))

        }
    })
      
    return (
        <div>
            <p>{roomID}
            </p>
        </div>
    )
}

export default withRouter(GameRoom)
