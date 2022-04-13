import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import PlayButton from "./PlayButton";
import PauseButton from "./PauseButton";
import ProgressBar from "./ProgressBar";
import { useContext, useState, useEffect, useRef } from "react";
import SettingsContext from "../SettingsContext";
import useSound from "use-sound";
import boopSfx from "../sounds/invalid_keypress.mp3";

const red = "#f54e4e";
const green = "#4aec8c";

function Timer() {
  const settingsInfo = useContext(SettingsContext);

  const [isPaused, setIsPaused] = useState(true);
  const isPausedRef = useRef(isPaused);

  const [mode, setMode] = useState("work"); // work/break/null
  const [secondsLeft, setSecondsLeft] = useState(0);
  const secondsLeftRef = useRef(secondsLeft);
  const modeRef = useRef(mode);

  useEffect(() => {
    secondsLeftRef.current = settingsInfo.workMinutes * 60;
    setSecondsLeft(secondsLeftRef.current);

    const interval = setInterval(() => {
      if (isPausedRef.current) {
        return;
      }
      if (secondsLeftRef.current === 0) {
        // switch the mode
        const nextMode = modeRef.current === "work" ? "break" : "work";
        const nextSeconds =
          (nextMode === "work"
            ? settingsInfo.workMinutes
            : settingsInfo.breakMinutes) * 60;

        setMode(nextMode);
        modeRef.current = nextMode;
        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;
        return;
      }

      secondsLeftRef.current--;
      setSecondsLeft(secondsLeftRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, [settingsInfo]);

  const totalSeconds =
    mode === "work"
      ? settingsInfo.workMinutes * 60
      : settingsInfo.breakMinutes * 60;
  const percentage = Math.round((secondsLeft / totalSeconds) * 100);

  const minutes = Math.floor(secondsLeft / 60);
  let seconds = secondsLeft % 60;
  if (seconds < 10) seconds = "0" + seconds;

  const [play] = useSound(boopSfx);
  useEffect(() => {
    if (secondsLeft === 0) {
      play();
    }
  }, [secondsLeft, play]);

  // TODO: Split the progress timer from the progress bar
  return (
    <div>
      <CircularProgressbar
        value={percentage}
        text={minutes + ":" + seconds}
        styles={buildStyles({
          textColor: "#fff",
          pathColor: mode === "work" ? red : green,
          tailColor: "rgba(255,255,255,.2)",
        })}
      />
      <div style={{ marginTop: "20px" }}>
        {isPaused ? (
          <PlayButton
            onClick={() => {
              setIsPaused(false);
              isPausedRef.current = false;
            }}
          />
        ) : (
          <PauseButton
            onClick={() => {
              setIsPaused(true);
              isPausedRef.current = true;
            }}
          />
        )}
      </div>
    </div>
  );
}

export default Timer;
