export class Board {
    //board의 홀수항은 막는 벽
    //x,y 모두 짝수항은 플레이어의 위치가 될 수 있는 곳.(짝수항이 1이라면 플레이가 위치해있는곳, 짝수항이 0이라면 없는곳)
    //항이 1이라면 막혀있는 벽, 항이 -1이라면 막을 수 없는 벽, 항이 0이라면 막을 수 있는 벽
    //[홀수항]x[홀수항]은 무시되는 항
    constructor(board = null){
        if(board === null){
            this.board = new Array(17)
            for(var i = 0; i <this.board.length; i++){
                this.board[i] = new Array(17).fill(0)
            }
            this.board[16][8]=1
            this.board[0][8]=2
        }
        else{
            this.board = board
        }
    }

    makeWall(start, end){
        //start는 처음 클릭한 곳, end 는 다음으로 클릭한 곳
        //start, end의 x,y 좌표는 각각 반드시 홀수여야함
        let startX=start[0]
        let startY=start[1]
        let endX=end[0]
        let endY=end[1]
        if(startX<=17 && startX>=-1 && startY>=-1 && startY<=17 && endX>=-1 && endX<=17 && endY>=-1 && endY<=17){
            
            if(startX===endX && Math.abs(startY-endY)===4){ ///세로로 쌓은 경우
                let startYFrom = Math.max(startY, endY)
                
                if(this.board[startYFrom-1][startX]!==1 && this.board[startYFrom-2][startX]===0 && this.board[startYFrom-3][startX]!==1 &&
                    !(this.board[startYFrom-1][startX]===-1 && this.board[startYFrom-3][startX]===-1)){
                    this.board[startYFrom-1][startX]=1
                    this.board[startYFrom-2][startX]=1
                    this.board[startYFrom-3][startX]=1
                    return true
                }
            }
            if(startY===endY && Math.abs(startX-endX)===4){ ///가로로 쌓은 경우
                
                let startXFrom = Math.max(startX, endX)
                if(this.board[startY][startXFrom-1]!==1 && this.board[startY][startXFrom-2]===0 && this.board[startY][startXFrom-3]!==1 &&
                    !(this.board[startY][startX-1]===-1 && this.board[startY][startX-3]===-1)){
                    this.board[startY][startXFrom-1]=1
                    this.board[startY][startXFrom-2]=1
                    this.board[startY][startXFrom-3]=1
                    return true
                }
            }
            return false
    }
        return false
    }

    updateCannotMakeWall(players){
        for(var y=0; y<17; y++){
            for(var x=0; x<17; x++){  //x가 짝수면 가로 벽, y가 짝수면 세로 벽
                if((x+y)%2===0) continue
                if(x%2==0){    //가로벽일때
                    if(x+2>17) continue
                    if(this.board[y][x]===0 && this.board[y][x+2]===0){
                        this.board[y][x]=1
                        this.board[y][x+2]=1
                        let notChange=true
                        for(var i=0; i<players.length; i++){
                            notChange=notChange&&existPath(this.board, [players[i].y, players[i].x], players[i].destination)
                        }
                        if(notChange){
                            this.board[y][x]=0
                            this.board[y][x+2]=0
                        }else{
                            this.board[y][x]=-1
                            this.board[y][x+2]=-1
                        }
                    }
            }
                else if(y%2==0){ //세로벽일때
                    if(y+2>17) continue
                    if(this.board[y][x]===0 && this.board[y+2][x]===0){
                        this.board[y][x]=1
                        this.board[y+2][x]=1
                        let notChange=true
                        for(var i=0; i<players.length; i++){
                            notChange=notChange&&existPath(this.board, [players[i].y, players[i].x], players[i].destination)
                        }
                        if(notChange){
                            this.board[y][x]=0
                            this.board[y+2][x]=0
                        }else{
                            this.board[y][x]=-1
                            this.board[y+2][x]=-1
                        }
                    }

                }
            }
        }

    }
}

export function existPath(board, start, destination){    //start 에서 destination까지 가는 path가 있는지를 반환.
    let visited = [start]
    let adjacent = []
    const y = start[0]
    const x = start[1]
    if(y%2!==0 && x%2!==0) return false
    if(y<=14 && board[y+1][x]!==1){  //아래쪽으로 갈 수 있는지 탐색
        adjacent.push([y+2,x])
    }
    if(y>=2 && board[y-1][x]!==1){ //위쪽으로 갈 수 있는지 탐색
        adjacent.push([y-2,x])
    }
    if(x<=14 && board[y][x+1]!==1){ //오른쪽으로 갈 수 있는지 탐색
        adjacent.push([y,x+2])
    }
    if(x>=2 && board[y][x-1]!==1){ //왼쪽으로 갈 수 있는지 탐색
        adjacent.push([y,x-2])
    }
    while(adjacent.length!==0){
        const k = adjacent.shift()
        visited.push(k)
        const kX = k[1]
        const kY = k[0]
        if(kY===destination[0] && kX===destination[1]){
            return true
        }
        if(kY<=14 && board[kY+1][kX]!==1){  //아래쪽으로 갈 수 있는지 탐색
            if(!include(adjacent,[kY+2,kX]) && !include(visited,[kY+2,kX])){ ///기존에 탐색한, 혹은 탐색할 곳인지 확인
                adjacent.push([kY+2,kX])
            }
        }
        if(kY>=2 && board[kY-1][kX]!==1){ //위쪽으로 갈 수 있는지 탐색
            if(!include(adjacent,[kY-2,kX]) && !include(visited,[kY-2,kX])){
                adjacent.push([kY-2,kX])
            }
        }
        if(kX<=14 && board[kY][kX+1]!==1){ //오른쪽으로 갈 수 있는지 탐색
            if(!include(adjacent,[kY,kX+2]) && !include(visited,[kY,kX+2])){
                adjacent.push([kY,kX+2])
            }
        }
        if(kX>=2 && board[kY][kX-1]!==1){ //왼쪽으로 갈 수 있는지 탐색
            if(!include(adjacent,[kY,kX-2]) && !include(visited,[kY,kX-2])){
                adjacent.push([kY,kX-2])
            }
        }

    }
    return false
}
function include(list,element){
    if(list.filter(e => e[0]===element[0] && e[1]===element[1]).length===0) return false
    return true
}

export class Player {
    constructor(y, x, destination){
        //x,y좌표는 0~16까지 가능. 플레이어의 위치를 나타냄. 각 x와 y는 짝수만 가능.
        this.x = x
        this.y = y
        this.destination = destination
    }
    goto(direction, board){

        let x = this.x
        let y = this.y
        switch (direction) {
            case 'left':
                if(x<2) return [new Board(board),false]
                if(board[y][x-1]!==1){
                    if(board[y][x-2]===1){
                        if(x>=4){
                            this.x -=4
                            board[y][this.x]=board[y][x]
                            board[y][x]=0
                        }else{
                            return [new Board(board),false]
                        }
                    }else{
                        this.x -=2
                        board[y][this.x]=board[y][x]
                        board[y][x]=0
                    }
                    return [new Board(board),true]
                }else{
                    return [new Board(board),false]
                }
            case 'right':  
                if(x>15) return [new Board(board),false]
                if(board[y][x+1]!==1){
                    if(board[y][x+2]===1){
                        if(x<=12){
                            this.x +=4
                            board[y][this.x]=board[y][x]
                            board[y][x]=0
                            
                        }else{
                            return [new Board(board),false]
                        }
                    }else{
                        this.x +=2
                        board[y][this.x]=board[y][x]
                        board[y][x]=0
                    }
                    return [new Board(board),true]
                }else{
                    return [new Board(board),false]
                }
            case 'up':   
                if(y<2) return [new Board(board),false]
                if(board[y-1][x]!==1){
                    if(board[y-2][x]===1){
                        if(y>=4){
                            this.y -=4
                            board[this.y][x]=board[y][x]
                            board[y][x]=0
                        }else{
                            return [new Board(board),false]
                        }
                    }else{
                        this.y -=2
                        board[this.y][x]=board[y][x]
                        board[y][x]=0
                    }
                    return [new Board(board),true]
                }else{
                    return [new Board(board),false]
                }
            case 'down':  
                if(y>15) return [new Board(board),false]
                if(board[y+1][x]!==1){
                    if(board[y+2][x]===1){
                        if(y<=12){
                            this.y +=4
                            board[this.y][x]=board[y][x]
                            board[y][x]=0
                        }else{
                            return [new Board(board),false]
                        }
                    }else{
                        this.y +=2
                        board[this.y][x]=board[y][x]
                        board[y][x]=0
                    }
                    return [new Board(board),true]
                }else{
                    return [new Board(board),false]
                }
            default:
                return [new Board(board),false]
        }
    }
}