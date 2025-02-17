import styles from "./Chess.module.scss";
import { useState } from "react";
import { Route, Routes } from 'react-router-dom';

import Chessboard from "./components/Chessboard";
import OptionSidebar from "./components/OptionSidebar";
import HistorySidebar from "./components/HistorySidebar";

function Chess() {
  const [history, setHistory] = useState([]);

  return ( 
    <div className={styles.main}>
      <div className={styles.wrapper}>
       <Routes>
          <Route path="/" element={
              <> 
                <Chessboard boardColor="default" /> 
                <OptionSidebar />
              </>
            }/>
          <Route path="/live/:matchID" element={
            <>
              <Chessboard boardColor="default" liveGame={true} setHistory={setHistory}/> 
              <HistorySidebar history={history} />
            </>
          }/> 
          <Route path="*" element={<div>404 Oops this page doesn't exist</div>} />
        </Routes>
      </div>
    </div>
  );
}

export default Chess;