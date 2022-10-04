import { fieldAttacked } from './fieldAttacked'
import { showAndCreateLegalMoves } from './legalMoves';
import { createShallowInstance } from './createShallowInstance';

export function checkmate(board, myColor, legalCastle) {
  let checkmate = true;
  let virtualBoard = createShallowInstance(board);

  // scan the board for my pieces
  virtualBoard.forEach((row, i) => row.forEach((field, j)=> {
    if (field.pieceColor === myColor){
      const {piece, pieceColor, square} = field;
      let selectedPiece = {i, j, piece, pieceColor, square}; // select each piece

      let temp = showAndCreateLegalMoves(virtualBoard, selectedPiece, myColor, legalCastle); // find legalMoves for that selected piece
      let temp2 = showAndCreateLegalMoves(virtualBoard, selectedPiece, myColor, legalCastle); 

      temp.forEach((row, i) => row.forEach((field, j)=> { // place piece on each of the legalMoves squares
        if(field.legalMove){
          temp2[selectedPiece.i][selectedPiece.j].piece = null;
          temp2[selectedPiece.i][selectedPiece.j].pieceColor = null;

          if (selectedPiece.piece === "pawn" && i === 0)
            temp2[i][j].piece = "queen";
          else
            temp2[i][j].piece = selectedPiece.piece;

          temp2[i][j].pieceColor = selectedPiece.pieceColor;

          if (!fieldAttacked(temp2, myColor, "king")){ // if out king is NOT in check after nay of these legal moves, it's not checkmate
            checkmate = false;
          }

          temp2 = temp;
        }
      }))
    }
  }))

  return checkmate;
}
