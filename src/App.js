import styles from "./App.module.scss";
import { useState } from "react";
import { Route, Routes } from 'react-router-dom';

import Chessboard from "./components/Chessboard";
import OptionSidebar from "./components/OptionSidebar";
import HistorySidebar from "./components/HistorySidebar";
import "./styles.css";

function App() {
  const [history, setHistory] = useState([]);

  return ( 
    <div className={styles.main}>
      <div className={styles.boardSidebarWrapper}>
        <Routes>
          <Route exact path="/" element={
              <>
                <Chessboard boardColor="default" /> 
                <OptionSidebar />
              </>
            }
          />
          <Route path="/live/:matchID" element={
            <>
              <Chessboard boardColor="default" liveGame={true} setHistory={setHistory}/> 
              <HistorySidebar history={history} />
            </>
          }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;