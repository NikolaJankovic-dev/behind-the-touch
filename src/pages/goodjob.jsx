import React from "react";
import goodjob from "@/assets/images/goodjob3.png";
import gjpack from "@/assets/images/pack-mobile.png";

const GoodJob = ({ step }) => {
  return (
    <div
      className="w-full h-full overflow-x-hidden"
      style={{
        backgroundImage: `url(${goodjob})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        height: window.innerHeight,
      }}
    >
      <img
        src={gjpack}
        alt="gjpack"
        className="absolute top-20 left-[50%] translate-x-[-50%] h-[36vh] w-auto object-cover object-center"
      />
      <div className="absolute bottom-32 left-0 right-0 p-4 gap-2 flex flex-col justify-center items-center">
        <p
          className=" text-8xl hackney-vector text-center"
          style={{
            background: "#ffffff",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Good Job!
        </p>
        <p className="text-white text-xl text-center w-3/4">
          {" "}
          Now show your eye for style and design your own background...
        </p>
      </div>
    </div>
  );
};

export default GoodJob;
