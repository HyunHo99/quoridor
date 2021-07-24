export class Board {
    //board의 홀수항은 막는 벽
    //x,y 모두 짝수항은 플레이어의 위치가 될 수 있는 곳.(짝수항이 1이라면 플레이가 위치해있는곳, 짝수항이 0이라면 없는곳)
    //항이 1이라면 막혀있는 벽, 항이 -1이라면 막을 수 없는 벽, 항이 0이라면 막을 수 있는 벽
    //[홀수항]x[홀수항]은 무시되는 항
    constructor(){

    }

    makeWall(start, end){
        //start는 처음 클릭한 곳, end 는 다음으로 클릭한 곳
        //start, end의 x,y 좌표는 각각 반드시 홀수여야함
        let startX=start[0]
        let startY=start[1]
        let endX=end[0]
        let endY=end[1]
        if(startX<=17 && startX>=-1 && startY>=-1 && startY<=17 && endX>=-1 && endX<=17 && endY>=-1 && endY<=17) return false
        if(startX===endX && Math.abs(startY-endY)===4){ ///세로로 쌓은 경우
            let startYFrom = Math.max(startY, endY)
            if(this.board[startYFrom-1][startX]===0 && this.board[startYFrom-3][startX]===0){
                this.board[startYFrom-1][startX]=1
                this.board[startYFrom-3][startX]=1
            }
        }
        if(startY===endY && Math.abs(startX-endX)===4){ ///가로로 쌓은 경우
            let startXFrom = Math.max(startX, endX)
            if(this.board[startY][startXFrom-1]===0 && this.board[startY][startXFrom-3]===0){
                this.board[startY][startXFrom-1]=1
                this.board[startY][startXFrom-3]=1
            }
        }
        return false
    }
}

export class Player {
    constructor(y, x){
        //x,y좌표는 0~16까지 가능. 플레이어의 위치를 나타냄. 각 x와 y는 짝수만 가능.
        this.x = x
        this.y = y
    }
    goto(direction, Board){
        let x = this.x
        let y = this.y
        switch (direction) {
            case 'left':
                if(x<2) return [Board,false]
                if(Board.board[y][x-1]!==1){
                    if(Board.board[y][x-2]===1){
                        if(x>=4){
                            this.x -=4
                            Board.board[y][x]=0
                            Board.board[y][this.x]=1
                        }else{
                            return [Board,false]
                        }
                    }else{
                        this.x -=2
                        Board.board[y][x]=0
                        Board.board[y][this.x]=1
                    }
                    return [Board,true]
                }else{
                    return [Board,false]
                }
            case 'right':  
                if(x>15) return [Board,false]
                if(Board.board[y][x+1]!==1){
                    if(Board.board[y][x+2]===1){
                        if(x<=12){
                            this.x +=4
                            Board.board[y][x]=0
                            Board.board[y][this.x]=1
                        }else{
                            return [Board,false]
                        }
                    }else{
                        this.x +=2
                        Board.board[y][x]=0
                        Board.board[y][this.x]=1
                    }
                    return [Board,true]
                }else{
                    return [Board,false]
                }
            case 'up':   
                if(y<2) return [Board,false]
                if(Board.board[y-1][x]!==1){
                    if(Board.board[y-2][x]===1){
                        if(y>=4){
                            this.y -=4
                            Board.board[y][x]=0
                            Board.board[this.y][x]=1
                        }else{
                            return [Board,false]
                        }
                    }else{
                        this.y -=2
                        Board.board[y][x]=0
                        Board.board[this.y][x]=1
                    }
                    return [Board,true]
                }else{
                    return [Board,false]
                }
            case 'down':  
                if(y>15) return [Board,false]
                if(Board.board[y+1][x]!==1){
                    if(Board.board[y+2][x]===1){
                        if(y<=12){
                            this.y +=4
                            Board.board[y][x]=0
                            Board.board[this.y][x]=1
                        }else{
                            return [Board,false]
                        }
                    }else{
                        this.y +=2
                        Board.board[y][x]=0
                        Board.board[this.y][x]=1
                    }
                    return [Board,true]
                }else{
                    return [Board,false]
                }
            default:
                return [Board,false]
        }
    }
}