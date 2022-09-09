export function createShallowInstance(board){
  let shallowBoard = [[], [], [], [], [], [], [], []]
    for (let i=0; i<8; i++)
      for(let j=0; j<8; j++){
        let x = Object.create(board[i][j])
        shallowBoard[i].push(x);
      }

  return shallowBoard;

}
