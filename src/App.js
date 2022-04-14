import "./css/App.css";
import { useState } from "react";
import PausePlayButton from "./components/PausePlayButton";
import SecondsSettings from "./components/Settings";
import NSessionsSettings from "./components/nSessionsSettings";
import SecondsProgressIcon from "./components/SecondsProgressIcon";
import SessionsProgressIcon from "./components/SessionsProgressIcon";
import { useEffect, useRef } from "react";
import useSound from "use-sound";
import boopSfx from "./sounds/invalid_keypress.mp3";

function App() {
  const defaultSeconds = {
    work: 20 * 60,
    rest: 1 * 60,
  };
  const defaultMode = "work";
  const defaultSecondsLeft = defaultSeconds[defaultMode];
  const defaultIsPaused = true;
  const defaultNSessions = 2;

  const [isPaused, setIsPaused] = useState(defaultIsPaused);
  const [nSessions, setNSessions] = useState(defaultNSessions);
  const [workSeconds, setWorkSeconds] = useState(defaultSeconds.work);
  const [restSeconds, setRestSeconds] = useState(defaultSeconds.rest);
  const [mode, setMode] = useState(defaultMode);
  const [secondsLeft, setSecondsLeft] = useState(defaultSecondsLeft);

  const [totalSeconds, setTotalSeconds] = useState(defaultSecondsLeft);
  const [nSessionsLeft, setNSessionsLeft] = useState(defaultNSessions);

  const modeRef = useRef(defaultMode);
  const totalSecondsRef = useRef(defaultSecondsLeft);

  const [play] = useSound(boopSfx);
    // when there are 0 seconds left: 
  // play sound, change mode, decrement nSessions
  useEffect(() => {
    if (secondsLeft === 0) {
      if (modeRef.current === "rest") {
        setNSessionsLeft((n) => {
          return n - 1;
        });
      }
      setMode((m) => {return m === 'work' ? 'rest' : 'work'});
      play();
    }
  }, [secondsLeft, play]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && nSessionsLeft > 0) {
        console.log(nSessionsLeft);
        setSecondsLeft((s) => {
          return s - 1;
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, nSessionsLeft]);

  useEffect(() => {
    const newSeconds = mode === "work" ? workSeconds : restSeconds;
    setTotalSeconds(newSeconds);
    totalSecondsRef.current = newSeconds;
    setSecondsLeft(newSeconds);
    return;
  }, [mode, workSeconds, restSeconds]);

  return (
    <main>
      <SecondsProgressIcon
        secondsLeft={secondsLeft}
        workSeconds={workSeconds}
        restSeconds={restSeconds}
        mode={mode}
        nSessionsLeft={nSessionsLeft}
      />
      <SessionsProgressIcon
        nSessions={nSessions}
        nSessionsLeft={nSessionsLeft}
      />
      <PausePlayButton isPaused={isPaused} setIsPaused={setIsPaused} />
      <SecondsSettings
        seconds={workSeconds}
        setSeconds={setWorkSeconds}
        mode="work"
      />
      <SecondsSettings
        seconds={restSeconds}
        setSeconds={setRestSeconds}
        mode="rest"
      />
      <NSessionsSettings nSessions={nSessions} SetNSessions={setNSessions} />
      <SecondsSettings
        seconds={secondsLeft}
        setSeconds={setSecondsLeft}
        mode="left"
      />
    </main>
  );
}

export default App;
