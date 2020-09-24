const AI = {
    calculateNextMove: (board, userSign, AISign) => {
        if(board[1][1] === null){
            return {i:1, j:1};
        }

        let move = AIWinMove();
        if(move !== false)return move;
        
        move = UserBlockMove();
        if(move !== false)return move;

        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                if(board[i][j]===null)return {i,j};
            }
        }
        return false;

        function ThreeInARowMove(sign) {
            let sumValue = 2;
            if(sign === AISign)sumValue = 20;

            for(let i=0;i<3;i++){
                if(getValue(board[i][0])+getValue(board[i][1])+getValue(board[i][2]) === sumValue){
                    for(let j=0;j<3;j++){
                        if(board[i][j] === null)return {i,j};
                    }
                }
            }

            for(let i=0;i<3;i++){
                if(getValue(board[0][i])+getValue(board[1][i])+getValue(board[2][i]) === sumValue){
                    for(let j=0;j<3;j++){
                        if(board[j][i] === null)return {i:j,j:i};
                    }
                }
            }

            if(getValue(board[0][0])+getValue(board[1][1])+getValue(board[2][2]) === sumValue){
                for(let j=0;j<3;j++){
                    if(board[j][j] === null)return {i:j,j:j};
                }
            }

            if(getValue(board[0][2])+getValue(board[1][1])+getValue(board[2][0]) === sumValue){
                for(let j=0;j<3;j++){
                    if(board[2-j][j] === null)return {i:2-j,j:j};
                }
            }
            
            return false;
        }

        function AIWinMove() {
            return ThreeInARowMove(AISign);
        }

        function UserBlockMove() {
            return ThreeInARowMove(userSign);
        }

        function getValue(cell) {
            if(cell === null)return 0;
            if(cell === userSign)return 1;
            return 10;
        }
    }
}