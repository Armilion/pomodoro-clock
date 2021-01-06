import TimerType from "./TimerType";
import {useState, useEffect, useRef} from 'react';

const Clock = () => {
  const [sessionCounter, setSessionCounter] = useState(25);
  const [breakCounter, setBreakCounter] = useState(5);
  const [timerType, setTimerType] = useState("Session");
  const [timer, setTimer] = useState(25 * 60);
  const [isPlaying, play] = useState(false);
  const beep = useRef();
  const canvasRef = useRef();
     
  useEffect(() => {
    if(isPlaying){
      let interval = setInterval(() => {
        setTimer(timer - 1);
        if(timer === 1){
          beep.current.play();
          beep.current.currentTime = 0;
        }else if(timer === 0){
          if(timerType === "Session"){
            setTimerType("Break");
            setTimer(breakCounter * 60)
          }else{
            setTimerType("Session");
            setTimer(sessionCounter * 60)    
          }
        }
      }, 1000);
      return () => clearInterval(interval);
    }else{
      beep.current.pause();
      beep.current.currentTime = 0;
    }
  });
      
  useEffect(() => {
    let currentCanvas = canvasRef.current;
    let ctx = canvasRef.current.getContext("2d");
    let radius = (canvasRef.current.height / 2) * 0.90;
    draw(ctx, radius, currentCanvas);
    return () => ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);
  });

  const draw = (ctx, radius, currentCanvas) => {
    let ang; 
    var myImage = new Image(200,200);
    myImage.src = "https://freefrontend.com/assets/img/css-background-patterns/css-lattice-pattern.png";
    myImage.onload = () => { // execute folllowing code after the image is loaded
      ctx.save();
      ctx.beginPath();
      ctx.arc(currentCanvas.height/2, currentCanvas.height/2, radius-50, 0, 2*Math.PI); //draw a circle that will cut through the image
      ctx.clip();
      ctx.drawImage(myImage, 0, 0); 
      ctx.restore(); // restore context before drawing the image
      ctx.save();
      // The following is the drawing of the sixty bars representing each a minute on the clock
      ctx.translate(currentCanvas.height/2, currentCanvas.height/2);
      ctx.font = radius*0.3 + "px Iceland";
      if(timer < 60)
        ctx.fillStyle = "red";
      else  
        ctx.fillStyle = "white";
      ctx.fillText(formatTime(), -44, 7);
      for(let i = 0; i < 60; i++){
        ang = i * Math.PI / 30;
        ctx.rotate(-ang);
        ctx.translate(0, -radius*0.7);
        if(timer % 60 <= i)
          ctx.fillStyle = "red";
        else
          ctx.fillStyle = "white";
        ctx.rotate(Math.PI);
        ctx.fillRect(0,0,5,30+ Math.cos(5*i + Math.PI/3)*8);
        ctx.rotate(-Math.PI);
        ctx.translate(0, radius*0.7);
        ctx.rotate(ang);
      }
      ctx.restore();
    }
  }
  
  const resetTimer = () => {
    beep.current.pause();
    beep.current.currentTime = 0;
    setTimerType("Session");
    setTimer(25 * 60);
    setSessionCounter(25);
    setBreakCounter(5);
    play(false);
  }
  
  const formatTime = () => {
    let minutes = Math.floor(timer / 60).toString().padStart(2,'0');
    let seconds = (timer % 60).toString().padStart(2,'0');
    return `${minutes}:${seconds}`;
  }
  
  return(
    <div id="clock-container">
      <TimerType title="break" counter={breakCounter} updateCounter={setBreakCounter} setTimer={setTimer} isPlaying={isPlaying} currentTimerType={timerType}/>
      <TimerType title="session" counter={sessionCounter} updateCounter={setSessionCounter} setTimer={setTimer} isPlaying={isPlaying} currentTimerType={timerType}/>
      <div id="timer">
        <div>
          <span id="timer-label">{timerType}</span>
          <span id="time-left" style={timer<60?{"color":"red"}:{"color":"white"}} >{formatTime()}</span>
          <canvas id="canvas" ref={canvasRef} width="300" height="300" time={formatTime()} draw={draw} />
          <button id="start_stop" onClick={() => {
              play(!isPlaying);
            }}>
            <i class={isPlaying?"fa fa-pause fa-2x":"fa fa-play fa-2x"}></i>
          </button>
          <button id="reset" onClick={resetTimer}>
            <i class="fa fa-refresh fa-2x"></i>
          </button>
        </div>
      </div>
      <audio id="beep" preload="auto" src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" ref={beep}></audio>
    </div>);
};

export default Clock;