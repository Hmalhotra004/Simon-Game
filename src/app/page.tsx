"use client";
import NavBar from "@/components/NavBar";
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
  const [scale, setScale] = useState(1);

  //functions
  const handleStart = () => {
    if (isStart === false) {
      StartOver();
      nextSequence();
      setIsStart(true);
      console.log("start");
    } else {
      StartOver();
      nextSequence();
    }
  };

  const checkAns = (currlevel: number) => {
    if (gamePattern[currlevel] === userPattern[currlevel]) {
      if (userPattern.length === gamePattern.length) {
        setTimeout(() => {
          nextSequence();
        }, 1000);
      }
    } else {
      playSound("wrong");
      setIsStart(false);
      setLevel(pv => {
        return {
          value: 0,
          title: "Game Over, Click Here to Restart",
          bg: "game-over",
        };
      });
    }
  };

  const nextSequence = () => {
    setLevel(pv => {
      return {
        value: pv.value + 1,
        title: `Level ${level.value + 1}`,
        bg: "bg",
      };
    });
    const randomNumber = Math.floor(Math.random() * 4);
    const randomChosenColour = COLOURS[randomNumber];
    setGamePattern(pv => [...pv, randomChosenColour]);
    console.log(gamePattern);
    playSound(randomChosenColour);
    animate(randomChosenColour);
  };

  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btnId = e.currentTarget.id;
    setUserPattern(pv => [...pv, btnId]);
    playSound(btnId);
    checkAns(userPattern.length - 1);
  };

  const playSound = (name: string) => {
    var audio = new Audio(`/sounds/${name}.mp3`);
    audio.play();
  };

  const animate = (btn: string) => {
    // setScale(0.6);
  };

  const StartOver = () => {
    setLevel(pv => {
      return {
        value: 0,
        title: `Level ${0}`,
        bg: "bg",
      };
    });
    setGamePattern([]);
    setUserPattern([]);
    console.log("start over");
  };

  return (
    <section className={level.bg}>
      <section className="container">
        <NavBar />
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
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleBtnClick(e)}
                scale={scale}
              />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Home;
