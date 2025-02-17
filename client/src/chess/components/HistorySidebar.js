import React from "react";
import styles from "./HistorySidebar.module.scss";

function HistorySidebar({history}){

  return (
    <div className={styles.main}>

      <div className={styles.historyGrid}>
        { displayHistory() }
      </div>
  
    </div>
  )

  function displayHistory(){
    let counter = 0;
    const History = history.map((move, i) => {
      if (i%2 === 0 || i === 0){
        counter++;
        return (
          <React.Fragment key={i}>
            <div>{counter}.</div>
            <div className={styles.historyWhite}>{move}</div>
          </React.Fragment>
        )
      }
      else 
        return <div key={i} className={styles.historyBlack}>{move}</div>

    })

    return History;
  }
}

export default HistorySidebar;