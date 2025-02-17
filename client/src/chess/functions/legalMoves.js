import {fieldAttacked} from "./fieldAttacked"
import {createShallowInstance} from "./createShallowInstance"

export function showAndCreateLegalMoves(incomingBoard, selectedPiece, myColor, legalCastle){
  let i = selectedPiece.i;
  let j = selectedPiece.j;
  
  // highlight selected item
  let board = createShallowInstance(incomingBoard);
      
  board = board.map(item => item.map(item => {
    if (item.square===selectedPiece.square && item.piece)
      item.selected=true;
    return item
  }))

  /* -------- pawn --------- */
  if (selectedPiece.piece === "pawn"){

    // if there is an opposite colored piece on the diagonal of the pawn we can capture
    if (!fieldOutOfBound(i-1, j+1))
      if (board[i-1][j+1].piece && board[i-1][j+1].pieceColor !== myColor) board[i-1][j+1].legalMove = true;
    if (!fieldOutOfBound(i-1, j-1))
      if (board[i-1][j-1].piece && board[i-1][j-1].pieceColor !== myColor) board[i-1][j-1].legalMove = true;

    // if no piece blocking, it can move by 1
    if (!board[i-1][j].piece) 
      board[i-1][j].legalMove = true
    else return board;

    // if no piece blocking and it's on starting position it can move by 2
    if (board[i-2]) // for when pawn is about to promote (and there is no piece blocking it) i-2 is out of bound
    if (!board[i-2][j].piece && selectedPiece.i === 6)  
      board[i-2][j].legalMove = true;
  }
  
  /* -------- bishop --------- */
  if (selectedPiece.piece === "bishop"){
    // 4 loops for each diagonal
    for(let x=1;;x++){
      if (fieldOutOfBound(i+x, j+x)) break;
      let boardSquare = board[i+x][j+x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    } 
    for(let x=1;;x++){
      if (fieldOutOfBound(i-x, j-x)) break;
      let boardSquare = board[i-x][j-x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
    for(let x=1;;x++){
      if (fieldOutOfBound(i+x, j-x)) break;
      let boardSquare = board[i+x][j-x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
    for(let x=1;;x++){
      if (fieldOutOfBound(i-x, j+x)) break;
      let boardSquare = board[i-x][j+x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
  }

  /* -------- rook --------- */
  if (selectedPiece.piece === "rook"){
    // 4 loops for each file
    for(let x=1;;x++){
      if (fieldOutOfBound(i+x, j)) break;
      let boardSquare = board[i+x][j];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    } 
    for(let x=1;;x++){
      if (fieldOutOfBound(i-x, j)) break;
      let boardSquare = board[i-x][j];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
    for(let x=1;;x++){
      if (fieldOutOfBound(i, j-x)) break;
      let boardSquare = board[i][j-x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
    for(let x=1;;x++){
      if (fieldOutOfBound(i, j+x)) break;
      let boardSquare = board[i][j+x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
  }

  /* -------- knight --------- */
  if (selectedPiece.piece === "knight"){

    if (!fieldOutOfBound(i-1, j+2)) 
      if (board[i-1][j+2].pieceColor !== myColor)
        board[i-1][j+2].legalMove = true;
    if (!fieldOutOfBound(i+1, j+2)) 
      if (board[i+1][j+2].pieceColor !== myColor)
        board[i+1][j+2].legalMove = true;
    if (!fieldOutOfBound(i-1, j-2)) 
      if (board[i-1][j-2].pieceColor !== myColor)
        board[i-1][j-2].legalMove = true;
    if (!fieldOutOfBound(i-2, j-1))
      if (board[i-2][j-1].pieceColor !== myColor)
        board[i-2][j-1].legalMove = true;
    if (!fieldOutOfBound(i-2, j+1)) 
      if (board[i-2][j+1].pieceColor !== myColor)
       board[i-2][j+1].legalMove = true;
    if (!fieldOutOfBound(i+1, j-2)) 
      if (board[i+1][j-2].pieceColor !== myColor)
        board[i+1][j-2].legalMove = true;
    if (!fieldOutOfBound(i+2, j-1)) 
      if (board[i+2][j-1].pieceColor !== myColor)
        board[i+2][j-1].legalMove = true;
    if (!fieldOutOfBound(i+2, j+1)) 
      if (board[i+2][j+1].pieceColor !== myColor)
        board[i+2][j+1].legalMove = true;
  }

  /* -------- queen and king --------- */
  if (selectedPiece.piece === "queen" || selectedPiece.piece === "king"){
    // limit king moves to just 1 in each direction
    let y;
    if (selectedPiece.piece === "king") y = 2;
    else y=10;
    
    // 4 loops for each diagonal and 4 loops for each file
    for(let x=1;x<y;x++){
      if (fieldOutOfBound(i+x, j+x)) break;
      let boardSquare = board[i+x][j+x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    } 
    for(let x=1;x<y;x++){
      if (fieldOutOfBound(i-x, j-x)) break;
      let boardSquare = board[i-x][j-x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
    for(let x=1;x<y;x++){
      if (fieldOutOfBound(i+x, j-x)) break;
      let boardSquare = board[i+x][j-x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
    for(let x=1;x<y;x++){
      if (fieldOutOfBound(i-x, j+x)) break;
      let boardSquare = board[i-x][j+x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
    for(let x=1;x<y;x++){
      if (fieldOutOfBound(i+x, j)) break;
      let boardSquare = board[i+x][j];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    } 
    for(let x=1;x<y;x++){
      if (fieldOutOfBound(i-x, j)) break;
      let boardSquare = board[i-x][j];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
    for(let x=1;x<y;x++){
      if (fieldOutOfBound(i, j-x)) break;
      let boardSquare = board[i][j-x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
    for(let x=1;x<y;x++){
      if (fieldOutOfBound(i, j+x)) break;
      let boardSquare = board[i][j+x];
      if (boardSquare.piece && boardSquare.pieceColor === myColor) break;
      if (boardSquare.piece && boardSquare.pieceColor !== myColor) {boardSquare.legalMove = true; break;}
      if (!boardSquare.piece) boardSquare.legalMove = true;
    }
  }
   
   /* -------- king (castling) --------- */
  if (legalCastle){
    let newShallowBoard = createShallowInstance(board);
    if (selectedPiece.piece === "king" && !legalCastle.kingMoved && !fieldAttacked(newShallowBoard, myColor, "king")){
      
      if (myColor === "white"){
        if (!board[7][1].piece && !board[7][2].piece && !board[7][3].piece && !legalCastle.leftRookMoved && !fieldAttacked(newShallowBoard, myColor, "", "b1") && !fieldAttacked(newShallowBoard, myColor, "", "c1")){
          board[7][2].legalMove = true;
        }
        if (!board[7][5].piece && !board[7][6].piece && !legalCastle.rightRookMoved && !fieldAttacked(newShallowBoard, myColor, "", "f1") && !fieldAttacked(newShallowBoard, myColor, "", "g1")){
          board[7][6].legalMove = true;
        }
      }
      if (myColor === "black"){
        if (!board[7][1].piece && !board[7][2].piece && !legalCastle.leftRookMoved && !fieldAttacked(newShallowBoard, myColor, "", "g8") && !fieldAttacked(newShallowBoard, myColor, "", "f8")){
          board[7][1].legalMove = true;
        }
        if (!board[7][4].piece && !board[7][5].piece && !board[7][6].piece && !legalCastle.rightRookMoved && !fieldAttacked(newShallowBoard, myColor, "", "b8") && !fieldAttacked(newShallowBoard, myColor, "", "c8")){
          board[7][5].legalMove = true;
        }
      }
      
    }
  }

  return board;
}

function fieldOutOfBound(i, j){
  if (i<0 || i>7 || j<0 || j>7) return true;
  return false;
}