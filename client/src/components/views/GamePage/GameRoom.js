import React from 'react'
import { withRouter } from 'react-router'

function GameRoom(props) {
    var qs = require('qs')
    console.log(props.location.search)
    console.log(qs.parse(props.location.search, { ignoreQueryPrefix: true }.id).id)
    return (
        <div>
            <p>{qs.parse(props.location.search, { ignoreQueryPrefix: true }._id).id}
            </p>
        </div>
    )
}

export default withRouter(GameRoom)
