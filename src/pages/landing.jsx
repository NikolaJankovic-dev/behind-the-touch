import React from "react";
import landing from "@/assets/images/landing.png";

const text1 = 'Swipe the screen to unveil the Touch \n features, then spread the message \n to your adult smokers!'
const text2 = 'Use your touch to create a custom \n design, apply a tagline and download \n it as a unique background!'

const Landing = ({ step }) => {
  return (
    <div
      className="w-full h-full"
      style={{
        backgroundImage: `url(${landing})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: window.innerHeight,
      }}
    >
      <div className="absolute bottom-34 left-0 right-0 p-4  flex flex-col justify-center items-center">
        <div className="flex justify-center items-center gap-10 -mb-5">
          <p
            className={`text-white text-2xl ${
              step === 0 ? "opacity-100" : "opacity-20"
            }`}
          >
            Level 1
          </p>
          <p
            className=" text-4xl hackney-vector "
            style={{
              background: "#ffffff",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            BEHIND
          </p>
          <p
            className={`text-white text-2xl ${
              step === 0 ? "opacity-20" : "opacity-100"
            }`}
          >
            Level 2
          </p>
        </div>
        <p
          className=" text-8xl hackney-vector  "
          style={{
            background: "#ffffff",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          THE TOUCH
        </p>
        <p className="text-white text-xl text-center w-full whitespace-pre-line">
         {step === 0 ? text1 : text2}
        </p>
      </div>
    </div>
  );
};

export default Landing;
