const AI = {
    calculateNextMove: (board, userSign) => {
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                if(board[i][j]===null)return {i,j};
            }
        }
        return false;
    }
}