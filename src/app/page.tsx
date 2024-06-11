"use client";
import PlayButton from "@/components/PlayButton";
import { useState } from "react";
import "./page.scss";

const COLOURS = ["green", "red", "yellow", "blue"];

const Home = () => {
  //states
  const [isStart, setIsStart] = useState(false);
  const [level, setLevel] = useState({ value: 0, title: "Click Here to Start", bg: "bg" });
  const [gamePattern, setGamePattern] = useState<string[]>([]);
  const [userPattern, setUserPattern] = useState<string[]>([]);
  const [animatingButton, setAnimatingButton] = useState("");

  //functions
  const handleStart = () => {
    if (isStart === false) {
      StartOver();
      nextSequence();
      setIsStart(true);
      console.log("start");
    } else {
      StartOver();
    }
  };

  const checkAns = (idx: number) => {
    console.log(gamePattern[idx] === userPattern[idx]);
    console.log(userPattern.length);
    if (gamePattern[idx] === userPattern[idx]) {
      console.log(gamePattern.length === userPattern.length);
      console.log(gamePattern.length);
      console.log(userPattern.length);
      if (userPattern.length === gamePattern.length) {
        setTimeout(() => {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound("wrong");
      setIsStart(false);
      setLevel(_ => {
        return {
          value: 0,
          title: "Game Over, Click Here to Restart",
          bg: "game-over",
        };
      });
    }
  };

  const handleBtnClick = (e: React.MouseEvent) => {
    if (!isStart) return;

    const btnId = e.currentTarget.id;
    console.log(btnId);
    setUserPattern([...userPattern, btnId]);
    playSound(btnId);
    checkAns(userPattern.length - 1);
  };

  const nextSequence = () => {
    setUserPattern([]);
    setLevel(pv => {
      return {
        value: pv.value + 1,
        title: `Level ${pv.value + 1}`,
        bg: "bg",
      };
    });
    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = COLOURS[randomNumber];
    setGamePattern(pv => [...pv, randomChosenColour]);
    playSound(randomChosenColour);
    animate(randomChosenColour);
  };

  const StartOver = () => {
    setIsStart(false);
    setLevel({
      value: 0,
      title: "Click Here to Start",
      bg: "bg",
    });
    setGamePattern([]);
    setUserPattern([]);
  };

  const animate = (btn: string) => {
    setAnimatingButton(btn);
    setTimeout(() => setAnimatingButton(""), 200);
  };

  const playSound = (name: string) => {
    const audio = new Audio(`/sounds/${name}.mp3`);
    audio.play();
  };

  return (
    <section className={level.bg}>
      <section className="container">
        {/* <NavBar /> */}
        <div className="main">
          <button
            id="level-title"
            onClick={handleStart}
          >
            {level.title}
          </button>
          {/* <h3 id="high">
            High Score:<span id="high_value"> 0</span>
          </h3> */}
          <div className="btn-wrapper">
            {COLOURS.map((col, idx) => (
              <PlayButton
                key={idx}
                btn={col}
                onClick={(e: React.MouseEvent) => handleBtnClick(e)}
                disabled={!isStart}
                isAnimating={animatingButton === col}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Home;
