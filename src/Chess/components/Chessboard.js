import styles from "./Chessboard.module.scss";
import {useEffect, useState, useRef} from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

import Field from "./Field.js";
import {letters, numbers} from "../constants/lettersNumbers.js";
import {showAndCreateLegalMoves} from "../functions/legalMoves.js";
import { fieldAttacked } from "../functions/fieldAttacked";
import { getOpponentColor } from "../functions/getOpponentColor"
import { createShallowInstance } from "../functions/createShallowInstance"
import { checkmate } from "../functions/checkmate"

let P1_timer_interval, P2_timer_interval;

function Chessboard({boardColor, liveGame, setHistory}) {
  const [selectedPiece, setSelectedPiece] = useState();

  const [toMove, setToMove] = useState("white");
  const [P1_username, setP1Username] = useState("");
  const [P2_username, setP2Username] = useState("");
  const [P1_timer, setP1_timer] = useState();
  const [P2_timer, setP2_timer] = useState();
  const [P1_timer_should_countdown, setP1_timer_should_countdown] = useState(false);
  const [P2_timer_should_countdown, setP2_timer_should_countdown] = useState(false);
  const [increment, setIncrement] = useState();
  const [tempP2Username, setTempP2Username] = useState("");
  const [myColor, setMyColor] = useState(!liveGame ? "white" : null );
  const [board, setBoard] = useState(!liveGame ? initialBoardFill("white") : null);

  const [player1HasJoined, setPlayer1HasJoined] = useState(false);
  const [player2HasJoined, setPlayer2HasJoined] = useState(false);
  const [matchCanBegin, setMatchCanBegin] = useState(false);
  const [displayFinalScreen, setDisplayFinalScreen] = useState(false);
  const [winner, setWinner] = useState(null);

  const [clickedCopy, setClickedCopy] = useState(false);

  // castling
  const [legalCastle, setLegalCastle] = useState({
    kingMoved: false,
    leftRookMoved: false,
    rightRookMoved: false
  })

  const ref = useRef();
  const { matchID } = useParams();
  let location = useLocation().pathname;
  
  useEffect(()=> { 
    if (selectedPiece) 
      if (selectedPiece.pieceColor === myColor){
        try{
          setBoard(showAndCreateLegalMoves(board, selectedPiece, myColor, legalCastle));
        }
        catch(error){
          console.log("Something went wrong showing legal moves (most likely the field is out of bound)", error);
        }
      }
    //else deselect();
  }, [selectedPiece])

  useEffect(()=> { 
    if (P1_timer_should_countdown) 
      P1_timer_interval = setInterval(()=> setP1_timer(prev => prev-1), 1000)

    else {
      clearInterval(P1_timer_interval);
    }

    if (P2_timer_should_countdown) 
      P2_timer_interval = setInterval(()=> setP2_timer(prev => prev-1), 1000)

    if (!P2_timer_should_countdown && P2_timer_interval) 
      clearInterval(P2_timer_interval);
  }, [P1_timer_should_countdown, P2_timer_should_countdown])

  useEffect(()=> { 
    if (P1_timer <= 0){
      axios.put(`http://localhost:3000/api/match/end/${matchID}`, { winner: getOpponentColor(myColor) })
        .then(res => {
          if (res.data.status === "success")
            setWinner(getOpponentColor(myColor));
            setDisplayFinalScreen(true);
            setP1_timer_should_countdown(false);
        })
        .catch(err => {})
      }
  }, [P1_timer])

  useEffect(()=> {
    const socket = io('http://localhost:3000'); 

    if (liveGame){
      socket.on('connect', ()=> console.log("socket connected, socket ID:", socket.id));
      socket.on('disconnect',()=> console.log('socket disconnected'));

      socket.on('newMove', incoming => {
        // if this was our opponents move
        if (incoming.move.color !== myColor){
          // update board, this also checks for checkmate
          playOpponentsMove(incoming);
          // start our timer, stop opponents countdown
          setP1_timer_should_countdown(true);
          setP2_timer_should_countdown(false);
          // update opponents timer correctly (if they have bad connection)
          setP2_timer(incoming.timer)
        }

        // set history for every move
        setHistory(incoming.history);

        // set who is to move next
        setToMove(incoming.nextToMove);
      })

      // when game ends, set the winner, display winning screen and stop timers
      socket.on('gameEnded', ending => {
        setWinner(ending.winner);
        setDisplayFinalScreen(true);
        setP2_timer_should_countdown(false);
      })

      // when the 2nd player joins, all the players are joined and ready so the game can start
      socket.on('player2HasJoined', player2 => {
        if (P2_username === "") {
          setP2Username(player2.username);
          setMatchCanBegin(true);
        }
      })
    }
    return () => socket.off();
  }, [P2_username])

  useEffect(() => {
    if (liveGame){
      axios
        .get(`http://localhost:3000/api/match/getMatch/${matchID}`)
        .then(res => { 
          const { match } = res.data;
          // If the game status is NOT "waiting", redirect back home (means both players joined) or game has already concluded
          if (match.gameStatus !== "waiting"){
            window.location.href = `http://localhost:5000`;
            return;
          }
          // if no players joined, join player 1, set its username, piece color and board and wait for player 2
          if (!match.player1.hasJoined){
            axios.put(`http://localhost:3000/api/match/player1/join/${matchID}`)
            .then(res => {
              if (res.data.status === "success"){
                setPlayer1HasJoined(true);
                setP1Username(match.player1.username);
                setMyColor(match.player1.color);
                setP1_timer(match.time.totalAmount);
                setP2_timer(match.time.totalAmount);
                setIncrement(match.time.increment);
              }
            })
            .catch(err => {})

            return;
          }
        
          // if player 1 joined but player 2 didn't, join player 2, set myColor (as player 2) and set the username of the 1st player that joined
          if (!match.player2.hasJoined){
            axios.put(`http://localhost:3000/api/match/player2/join/${matchID}`)
              .then(res => {
                if (res.data.status === "success"){
                  setP2Username(match.player1.username); // setting username of the 1st player that joined before me
                  setMyColor(match.player2.color);
                  setPlayer2HasJoined(true);
                  setP1_timer(match.time.totalAmount);
                  setP2_timer(match.time.totalAmount);
                  setIncrement(match.time.increment);
                }
              })
              .catch(err => {})
          }
         
        })
        .catch(err => { 
          console.log(err)
        })
    }
  
    window.addEventListener("click", onClick); // on click listener to deselect piece and legal moves 
    if (liveGame) {window.addEventListener('beforeunload', abortGame)} // when closing tab, abort the game

    return () => {
      window.removeEventListener("click", onClick);
      if (liveGame) {
        window.removeEventListener('beforeunload', abortGame); 
      } 
    }; 
    // eslint-disable-next-line react-hooks/exhaustive-deps

  }, []);

  // this can be confusing, I am always player 1, as in - over the board (on bottom), but I joined 2nd, so I am technically and in the database, player 2
  function setPlayer2Username(name){
    setP1Username(name); 
    axios.put(`http://localhost:3000/api/match/player2/username/${matchID}`, { P2_username: name })
    .then(res => {
      if (res.data.status === "success")
        setMatchCanBegin(true);
    })
    .catch(err => {})
  }

  // can only set the board with correct PIECE COLOR once, can't change it later because of an error with deselect. 
  // This is why we only set the board once we know what bottom color (myColor) is
  useEffect(()=> {
    if (myColor) setBoard(initialBoardFill(myColor))
  }, [myColor])

  if (liveGame && !board) 
    return <div className={styles.placeholder}></div>
  else
    return (
      <div className={styles.overlay} ref={ref}> {/*this is so we can overflow username and clock, but keep field edges with border-radius*/}
      { // display winner or draw
        displayFinalScreen && 
          <div className={styles.popup}>
            <div className={styles.middle} style={{marginLeft: "34.9%"}}>

              <div>Match ended{winner === "draw" ? " in a draw" : `, ${winner} won`}</div>

              <div className={styles.okCancel}>
                <button className={styles.green} style={{width: "fit-content"}} onClick={()=> window.location.href = `http://localhost:5000`}>Home</button>
                <button className={styles.red} style={{width: "fit-content"}} onClick={()=> setDisplayFinalScreen(false)}>See board</button>
              </div>
              
            </div>
          </div>
      }
      { // if player 1 has joined and we join as player 2, ask for our username
          !player1HasJoined && player2HasJoined && P1_username === "" ? 

          <div className={styles.popup}>
            <form className={styles.middle} onSubmit={e => {e.preventDefault(); setPlayer2Username(tempP2Username);}}>
              <input placeholder="Choose Username" value={tempP2Username} onChange={e => {setTempP2Username(e.target.value)}}/>
              <button className={styles.green} type="submit">Ok</button>
              <button className={styles.red} onClick={()=> setPlayer2Username("Guest")}>Play as guest</button>
            </form>
          </div>
        // if we join as player 1 and we're waiting for player 2, display the share link popup
        : player1HasJoined && !P2_username ? 

          <div className={styles.popup}>
            <div className={styles.middle}>Share this link with your friend 
              <span>{`http://localhost:5000${location}`}</span>
              <button className={styles.copy} 
                onClick={() => {
                  setClickedCopy(true); 
                  navigator.clipboard.writeText(`http://localhost:5000${location}`);
                }}
                style={clickedCopy ? {background: "#54a55e", color: "#f6f6f6" } : {}}
              >{clickedCopy ? "Copied!" : "Copy"}</button>
            </div>
            
          </div>

        : null
      }
        <div className={styles.main}>
          {
            board.map((item, i) => item.map(({piece, pieceColor, square, legalMove, selected}, j) => 
            <Field 
              background={(i+j)%2==0 ? "white" : "black"} 
              boardColor={boardColor}
              pieceColor={pieceColor}
              piece={piece}
              square={square}
              onClickFunction={()=> move(i, j, piece, pieceColor, square)}
              i={i}
              j={j}
              legalMove={legalMove}
              selected={selected}
              key={square}
            />))
          }
        </div>
        {P2_username && <div className={styles.userNameTime} style={{top: "-35px"}}>{P2_username || "Player 2"}</div>}
        {P1_username && <div className={styles.userNameTime} style={{bottom: "-35px"}}>{P1_username || "Player 1"}</div>}
        {
          P1_timer != null && P2_timer != null ? 
            <>
              <div className={styles.player2Time}>{formatTime(P2_timer)}</div>
              <div className={styles.player1Time}>{formatTime(P1_timer)}</div>
            </>
          : null
        }
       
        <div className={styles.scoreWrapper}> 
        {/*for score*/}
        </div>
      </div> 
    );

  // board is initially colored the same for both white and black (pieces and orientation is flipped)
  function initialBoardFill(color){
    let temp = [[], [], [], [], [], [], [], []];

    for(let i=0; i<8; i++){
      for(let j=0; j<8; j++){
        temp[i][j] =  
          {
            square: `${letters[color][j]}${numbers[color][i]}`,
            pieceColor: i==6 || i==7 ? color : i==0 || i==1 ? getOpponentColor(color) : null,
            piece: setPiece(i, j),
          };
      }
    }

    return temp;
  }

  function setPiece(i, j){
    const letter = letters[myColor][j];

    if (i==6 || i==1)
      return "pawn";
    else if (i==0 || i==7){
      if (letter==="a") return "rook";
      if (letter==="b") return "knight";
      if (letter==="c") return "bishop";
      if (letter==="d") return "queen";
      if (letter==="e") return "king";
      if (letter==="f") return "bishop";
      if (letter==="g") return "knight";
      if (letter==="h") return "rook";
    }
    else return null;
  }

  function move(i, j, piece, pieceColor, square){
    // if match ended - deselect
    if (winner){
      deselect();
      return;
    }
    // if no pieces are selected - select a new piece
    if (!selectedPiece){
      setSelectedPiece({i, j, piece, pieceColor, square});
      return;
    }
    // if the selected piece is selected again - deselect
    if (selectedPiece.square === square){
      deselect();
      return;
    }
    // if a piece is already selected and we select a new piece - deselect then select the new piece
    if (pieceColor === myColor){
      deselect();
      setSelectedPiece({i, j, piece, pieceColor, square});
      return;
    }
    // if it's not out turn to move, deselect
    if (toMove !== myColor){
      deselect();
      return;
    }
    // if the move isn't legal, deselect
    if (!board[i][j].legalMove){
      deselect();
      return;
    }
    
    // create shallow version of state
    let temp = createShallowInstance(board);

    // on move - remove selected piece from square
    temp[selectedPiece.i][selectedPiece.j].piece = null;
    temp[selectedPiece.i][selectedPiece.j].pieceColor = null;
    
    // if we're at the end of the board, promote to queen, or else place the selected piece on the clicked field
    if (selectedPiece.piece === "pawn" && i === 0)
      temp[i][j].piece = "queen";
    else
      temp[i][j].piece = selectedPiece.piece;

    temp[i][j].pieceColor = selectedPiece.pieceColor;

    // check if king is in check
    if (fieldAttacked(temp, myColor, "king")){
      console.log("king in check");
      return;
    }

    deselect();
    
    // format the last move played
    const from = temp[selectedPiece.i][selectedPiece.j].square
    const to = temp[i][j].square 
    const move = {
      from,
      to,
      piece: temp[i][j].piece,
      color: selectedPiece.pieceColor,
      text: `${from} - ${to}`
    }

    if (liveGame && matchCanBegin){
      axios
        .post(`http://localhost:3000/api/match/newMove/${matchID}`, {board: temp, move, timer: P1_timer+increment})
        .then(res => { })
        .catch(err => { })

      // add increment, stop my timer and start opponents timer
      setP1_timer(prev => prev+increment);
      setP1_timer_should_countdown(false);
      setP2_timer_should_countdown(true);
    }

    // prevent future castling 
    if (selectedPiece.piece === "king" && !legalCastle.kingMoved){
      setLegalCastle({...legalCastle, kingMoved: true});
    }
    if (selectedPiece.piece === "rook" && selectedPiece.i === 7 && selectedPiece.j === 0 && !legalCastle.leftRookMoved){
      setLegalCastle({...legalCastle, leftRookMoved: true});
    }
    if (selectedPiece.piece === "rook" && selectedPiece.i === 7 && selectedPiece.j === 7 && !legalCastle.rightRookMoved){
      setLegalCastle({...legalCastle, rightRookMoved: true});
    }

    // throw the rook over king to complete castling
    throwRookOverKing(temp, j)
 
    setBoard(temp);
  }
   
  // on click outside of the chessboard
  function onClick(e) {
    if (!ref.current || !ref.current.contains(e.target)){
      deselect();
    }
  }
  // abort the game on leaving the component or closing tab
  function abortGame () {
    axios.put(`http://localhost:3000/api/match/abort/${matchID}`)
      .then(res => {})
      .catch(err => {})
  }
  // deselect selectedPiece, legalMoves and selected (highlighted) field
  function deselect(){
   setSelectedPiece();

    setBoard(prev=> prev.map(item => item.map(item => {
      item.legalMove = false;
      item.selected = false;
      return item;
     })))
  }

  function playOpponentsMove({move}){
    setBoard(prev => {
      let temp = prev;
      for (let i=0; i<8; i++)
      for(let j=0; j<8; j++){
        if (temp[i][j].square === move.from){
          temp[i][j].piece = null;
          temp[i][j].pieceColor = null;
        }
        if (temp[i][j].square === move.to){
          temp[i][j].piece = move.piece;
          temp[i][j].pieceColor = move.color;
        }
      }

      // throw over rook on castling
      if (move.piece === "king" && move.from === "e1" && move.to === "g1"){
        temp[0][0].piece = null;
        temp[0][0].pieceColor = null;
        temp[0][2].piece = "rook";
        temp[0][2].pieceColor = "white";
      }
      if (move.piece === "king" && move.from === "e1" && move.to === "c1"){
        temp[0][7].piece = null;
        temp[0][7].pieceColor = null;
        temp[0][4].piece = "rook";
        temp[0][4].pieceColor = "white";
      }
      if (move.piece === "king" && move.from === "e8" && move.to === "c8"){
        temp[0][0].piece = null;
        temp[0][0].pieceColor = null;
        temp[0][3].piece = "rook";
        temp[0][3].pieceColor = "black";
      }
      if (move.piece === "king" && move.from === "e8" && move.to === "g8"){
        temp[0][7].piece = null;
        temp[0][7].pieceColor = null;
        temp[0][5].piece = "rook";
        temp[0][5].pieceColor = "black";
      }

      if (checkmate(temp, myColor, legalCastle)){
        axios.put(`http://localhost:3000/api/match/end/${matchID}`, { winner: getOpponentColor(myColor) })
        .then(res => {
          if (res.data.status === "success")
            setWinner(getOpponentColor(myColor));
            setDisplayFinalScreen(true);
            setP1_timer_should_countdown(false);
        })
        .catch(err => {})
      }

      return temp;
    })
  }

  function throwRookOverKing(temp, j){
    if (selectedPiece.piece === "king" && selectedPiece.j === 4 && j === 2){
      temp[7][0].piece = null;
      temp[7][0].pieceColor = null;
      temp[7][3].piece = "rook";
      temp[7][3].pieceColor = "white";
      setLegalCastle({...legalCastle, kingMoved: true});
    }
    if (selectedPiece.piece === "king" && selectedPiece.j === 4 && j === 6){
      temp[7][7].piece = null;
      temp[7][7].pieceColor = null;
      temp[7][5].piece = "rook";
      temp[7][5].pieceColor = "white";
      setLegalCastle({...legalCastle, kingMoved: true});
    }
    if (selectedPiece.piece === "king" && selectedPiece.j === 3 && j === 1){
      temp[7][0].piece = null;
      temp[7][0].pieceColor = null;
      temp[7][2].piece = "rook";
      temp[7][2].pieceColor = "black";
      setLegalCastle({...legalCastle, kingMoved: true});
    }
    if (selectedPiece.piece === "king" && selectedPiece.j === 3 && j === 5){
      temp[7][7].piece = null;
      temp[7][7].pieceColor = null;
      temp[7][4].piece = "rook";
      temp[7][4].pieceColor = "black";
      setLegalCastle({...legalCastle, kingMoved: true});
    }
  }

  function formatTime(time){
    let returnString = "";
    
    let hours   = Math.floor(time / 3600); // get hours
    let minutes = Math.floor((time - (hours * 3600)) / 60); // get minutes
    let seconds = time - (hours * 3600) - (minutes * 60); //  get seconds

    if (hours > 0){
      if (hours < 10) returnString += `0${hours}:`;
      else returnString += `${hours}:`
    }
    if (minutes < 10) returnString += `0${minutes}:`;
    else returnString += `${minutes}:`;

    if (seconds < 10) returnString += `0${seconds}`;
    else returnString += `${seconds}`;

    if (hours === 0 && minutes === 0 && seconds === 0)
      returnString = "00:00"

    return returnString;
  }
}

export default Chessboard;