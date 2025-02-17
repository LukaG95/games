import styles from "./OptionSidebar.module.scss";
import {useState, useRef, useEffect} from "react";
import axios from "axios";

import {timeOptions} from "../constants/timeOptions";
import { getOpponentColor } from "../functions/getOpponentColor"

function OptionSidebar() {
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedColor, setSelectedColor] = useState("random");
  const [selectedTime, setSelectedTime] = useState({
    hours: 0,
    minutes: 3,
    seconds: 2,
    increment: 2
  });
  const [open, setOpen] = useState(false)
  const ref = useRef();

  useEffect(() => {
    window.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("click", onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  return (
    <div className={styles.main}>

      <div className={styles.options}>

        <input placeholder="Choose Username" value={selectedUsername} onChange={(e)=> setSelectedUsername(e.target.value)} className={styles.chooseUsernameWrapper} />

        <div ref={ref} className={styles.timeDropdown} onClick={()=> setOpen(!open)}>
          <span className={styles.selectTime}>{formatTime(selectedTime)}</span>
          <div className={`${styles.arrow} ${open ? styles.open : ""}`}></div>
          {open && (
          <div className={styles.dropdown}> 

            <div className={styles.items}>
              {timeOptions.map((item, index) => (
                <div
                  data-type="dropdown-item"
                  className={styles.item}
                  onClick={() => {
                    setSelectedTime(item);
                    setOpen(!open);
                  }}
                  key={index}
                >
                  {formatTime(item)}
                </div>
              ))}
            </div>
          </div>
        )}
        </div>
        
        <div className={styles.chooseColorWrapper}>
          <div onClick={()=> setSelectedColor("black")} className={selectedColor === "black" ? styles.highlighted : undefined}>
            <img className="noUserInteraction" width="50" height="50" src={"/images/chess/chooseColor/black king.png"} alt=""></img>
          </div>
          <div onClick={()=> setSelectedColor("random")} className={selectedColor === "random" ? styles.highlighted : undefined}>
            <img className="noUserInteraction" width="50" height="50" src={"/images/chess/chooseColor/random king.png"} alt=""></img>
          </div>
          <div onClick={()=> setSelectedColor("white")} className={selectedColor === "white" ? styles.highlighted : undefined}>
            <img className="noUserInteraction" width="50" height="50" src={"/images/chess/chooseColor/white king.png"} alt=""></img>
          </div>
        </div>

      </div>

      <div className={styles.buttonWrapper}>
        <button className={styles.playOnline} style={selectedColor!=="this should just be random" ? {opacity: "0.20", cursor: "default"} : {}}>PLAY ONLINE</button>
        <button className={styles.playWithFriend} onClick={()=> createMatch()}>PLAY WITH A FRIEND</button>
      </div>
    </div>
  );

  function formatTime(time){
    let timeString = "";
    if (time.hours > 0) timeString+= time.hours + "h ";
    if (time.minutes > 0) timeString+= time.minutes + "m ";
    if (time.seconds > 0) timeString+= time.seconds + "s ";
    if (time.increment > 0) timeString+= "+ " + time.increment + "s";
    return timeString;
  }

  function onClick(e) {
    if (!ref.current || !ref.current.contains(e.target)){
      setOpen(false);
    }
  }

  function createMatch(){
    let formatedTime = selectedTime.hours * 3600 + selectedTime.minutes * 60 + selectedTime.seconds;
    let formatedColor;

    if (selectedColor === "random"){
      const random = Math.round(Math.random());
      random === 1 ? formatedColor = "black" : formatedColor = "white";
    }
    else formatedColor = selectedColor;

    let finalColor = selectedColor;
    if (finalColor === "random"){
      if (Math.floor(Math.random() * 2) === 1) 
        finalColor = "white";
      else
        finalColor = "black";
    }

    let matchDetails = {
      player1: {
        username: selectedUsername === "" ? "Guest" : selectedUsername,
        color: finalColor
      },
      player2:{
        color: getOpponentColor(finalColor)
      },
      time: {
        totalAmount: formatedTime,
        increment: selectedTime.increment
      }
    };

    axios
      .post('http://localhost:3000/api/match/create', matchDetails)
      .then((res) => {
        if (res.data.status === "success"){
          const matchID = res.data.info.matchID;
          window.location.href = `http://localhost:5000/chess/live/${matchID}`
        }
      })
      .catch((err) => {console.log(err)});
  }
}

export default OptionSidebar;