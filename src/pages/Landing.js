import styles from './Landing.module.scss';

import {Link} from 'react-router-dom';

const Landing = () => {
  return (
    <div className={[styles.main, 'noUserInteraction'].join(" ")}>
      <Link to="/tic-tac-toe"><div className={styles.gameButton}><p>Tic Tac Toe</p><img src={"images/general/tic-tac-toe.png"}/></div></Link>
      <Link to="/chess"><div className={styles.gameButton}><p>Chess</p><img src={"images/general/chess.png"}/></div></Link>
      <Link to="/connect-four"><div className={styles.gameButton}><p>Connect Four</p><img src={"images/general/connect-four.png"}/></div></Link>
    </div>
  )
}

export default Landing