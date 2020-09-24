function createGame(parent, userSign){
    let state = {
        board: [],
        boardDOMElements: [],
        eventListeners: [],
        userWins: 0,
        AIWins: 0,
        gamePlaying: false,
    }
    let AISign = userSign === "X" ? "O" : "X";
    const USER_WON = "USER_WON", AI_WON = "AI_WON", DRAW = "DRAW";

    let messageBox = document.createElement('h1');
    messageBox.classList.add("message");
    messageBox.innerHTML = "Play against AI. You are " + userSign + ".";

    let scoreboard = document.createElement('h1');
    scoreboard.classList.add("message");
    scoreboard.innerHTML = "0 - YOU AI - 0";

    let resetButton = document.createElement('button');
    resetButton.innerHTML = "RESET";
    resetButton.classList.add("message");
    resetButton.classList.add("resetButton");
    resetButton.addEventListener('click', resetBoard);

    let table = document.createElement('table');
    table.classList.add("board");
    let rows = [];

    for(let i=0;i<3;i++){
        rows.push(document.createElement('tr'));

        state.boardDOMElements.push([]);
        state.board.push([]);
        state.eventListeners.push([]);

        for(let j=0;j<3;j++){
            let cellDOMElement = document.createElement('td');
            cellDOMElement.innerHTML = "ses";
            cellDOMElement.classList.add("cell")

            state.boardDOMElements[i].push(cellDOMElement);
            rows[i].appendChild(cellDOMElement);
            
            state.board[i].push(null);

            state.eventListeners[i].push(()=>{
                if(state.gamePlaying === false)return;
                updateBoard(i, j, userSign);

                let didWin = checkWin(userSign, i, j);
                if(didWin === true){
                    //user won
                    endEvent(USER_WON);
                    return;
                }

                let nextMoveAI = AI.calculateNextMove(state.board, userSign, AISign);
                if(nextMoveAI === false){
                    //draw
                    endEvent(DRAW);
                    return;
                }

                updateBoard(nextMoveAI.i, nextMoveAI.j, AISign);

                didWin = checkWin(AISign, nextMoveAI.i, nextMoveAI.j);
                if(didWin === true){
                    //ai won
                    endEvent(AI_WON);
                    return;
                }
            });
        }
        table.appendChild(rows[i]);
    }

    parent.appendChild(messageBox);
    parent.appendChild(scoreboard);
    parent.appendChild(resetButton);
    parent.appendChild(table);

    resetBoard();

    function generateX() {
        return `
        <svg viewBox="0 0 100 100" height="90">
            <line x1="15" y1="15" x2="85" y2="85" stroke=white stroke-width=2 />
            <line x1="15" y1="85" x2="85" y2="15" stroke=white stroke-width=2 />
        </svg>
        `
    }

    function generateO() {
        return `
        <svg viewBox="0 0 100 100" height="90">
            <circle cx=50 cy=50 r=40 stroke=white stroke-width=3 fill="#363636" />
        </svg>
        `
    }

    function drawCell(cellElement, sign) {
        switch(sign) {
            case "X":
                cellElement.innerHTML = generateX();
                break;
            case "O":
                cellElement.innerHTML = generateO();
                break;
            default:
                cellElement.innerHTML = "";
        }
    }

    function updateBoard(i, j, sign) {
        state.board[i][j] = sign;
        let element = state.boardDOMElements[i][j];
        drawCell(element, sign);
        if(sign === null){
            element.addEventListener('click', state.eventListeners[i][j]);
        } else {
            element.removeEventListener('click', state.eventListeners[i][j]);
        }
    }

    function resetBoard() {
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                updateBoard(i, j, null);
            }
        }
        state.gamePlaying = true;
    }

    function checkWin(sign, i, j) {
        if(
            (//checking horizontal line
                state.board[i][(j+1)%3] === sign &&
                state.board[i][(j+2)%3] === sign
            ) || (//checking vertical line
                state.board[(i+1)%3][j] === sign &&
                state.board[(i+2)%3][j] === sign
            ) || (//checking right diagonal
                i + j === 2 && //it is on right diagonal
                state.board[(i+1)%3][(j+2)%3] == sign &&
                state.board[(i+2)%3][(j+1)%3] == sign
            ) || (//cheking left diagonal
                i == j && //it is on left diagonal
                state.board[(i+1)%3][(j+1)%3] == sign &&
                state.board[(i+2)%3][(j+2)%3] == sign
            )
        ){
            state.gamePlaying = false;
            return true;
        }
        return false;
    }

    function setMessage(message) {
        messageBox.innerHTML = message;
    }

    function refreshScoreboard() {
        scoreboard.innerHTML = `${state.userWins} - YOU AI - ${state.AIWins}`;
    }

    function endEvent(outcome){
        switch(outcome){
            case "DRAW":
                setMessage("Draw.");
                break;
            case "USER_WON":
                state.userWins++;
                setMessage("Congratulations, you have won!");
                refreshScoreboard();
                break;
            case "AI_WON":
                state.AIWins++;
                setMessage("Better luck next time.");
                refreshScoreboard();
                break;
        }
    }
}