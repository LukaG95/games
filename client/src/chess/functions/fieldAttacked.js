import { showAndCreateLegalMoves } from "./legalMoves";
import { getOpponentColor } from "./getOpponentColor"

export function fieldAttacked(board, myColor, attackedPiece, squareToCheck){
  let fieldAttacked = false;
  let flippedBoard = flipboard(board); // flip board so we can properly display legalMoves

  for(let i=0; i<8; i++)
    for(let j=0; j<8; j++){
      if (flippedBoard[i][j].pieceColor === getOpponentColor(myColor)){ // find every opponents piece on the flipped board
        const {piece, pieceColor, square} = flippedBoard[i][j];
        flippedBoard = showAndCreateLegalMoves(flippedBoard, {i, j, piece, pieceColor, square}, getOpponentColor(myColor)) // show legal moves for that piece
        for(let i=0; i<8; i++)
          for(let j=0; j<8; j++){
            // check if certain square is attacked (used to check when castling)
            // pawns can move forward but the field isn't under attack, this can lead to bugs but doesn't mess with current implementation
            if (squareToCheck){
              if (flippedBoard[i][j].square === squareToCheck && flippedBoard[i][j].legalMove){
                fieldAttacked = true;
              }
            }

            // check if certain piece is attacked (used to see when king is in check)
            if (flippedBoard[i][j].piece === attackedPiece && flippedBoard[i][j].pieceColor === myColor && flippedBoard[i][j].legalMove){ // check if our king has legal move attribute meaning we're in check
              fieldAttacked = true;
            }
          }
      }
    }

  // cleanse board since it's a reference to the board that is about to be updated to state
  for(let i=0; i<8; i++)
  for(let j=0; j<8; j++){
    flippedBoard[i][j].legalMove = false;
    flippedBoard[i][j].selected = false;
  }
  return fieldAttacked;
}

export function flipboard(board){
  let temp = [[], [], [], [], [], [], [], []]
  let a = -1;

  for(let i=7; i>-1; i--){
    a++;
    for(let j=7; j>-1; j--){
      board[i][j].legalMove = false;
      board[i][j].selected = false;
      temp[a].push(board[i][j]);
    }
  }
  
  return temp;
}
