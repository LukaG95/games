import styles from "./Field.module.scss";
import {useState} from "react"

import { boardColors } from "../constants/boardColor";

function Field({background, boardColor, square, pieceColor, piece, onClickFunction, legalMove, selected, i, j}) {

  return (
    <div className={styles.main} style={styling()} onClick={()=> onClickFunction()}>
      
      {/*show board orientation*/}
      <div className={styles.letter} style={boardColors[boardColor][background]}>{i === 7 && square[0]}</div>
      <div className={styles.number} style={boardColors[boardColor][background]}>{j === 0 && square[1]}</div>
    
      {/*show piece*/}
      {piece && <img className="noUserInteraction" width="100" height="100" src={`http://localhost:5000/images/pieces/${pieceColor} ${piece}.png`} alt="" />}
   
      {/*show legal moves*/}
      {legalMove && <div className={piece ? styles.showLegalMove : styles.showLegalMove2}></div>}

      {/*<div style={{position: "absolute", right: "0px"}}>{i}{j}</div>*/}

    </div>
  );

  function styling(){
    let styling = {};

    if (piece || legalMove) styling = {...styling, cursor: "pointer"};

    if (selected) styling =  {...styling, background: "#bbca2a"};
    else styling = {...styling, ...boardColors[boardColor][background]};

    return styling;
  }
}

export default Field;
