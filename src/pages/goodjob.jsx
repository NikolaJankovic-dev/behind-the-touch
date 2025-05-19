import React from "react";
import goodjob from "@/assets/images/goodjob.png";

const GoodJob = ({ step }) => {
  return (
    <div
      className="w-full h-full"
      style={{
        backgroundImage: `url(${goodjob})`,
        backgroundSize: "cover",
        backgroundPosition: "top",
        height: window.innerHeight,
      }}
    >
      <div className="absolute bottom-[180px] left-0 right-0 p-4 gap-4 flex flex-col justify-center items-center">
        <p className=" text-8xl hackney-vector"    style={{
            background: "#ffffff",
            webkitBackgroundClip: "text",
            webkitTextFillColor: "transparent",
          }}>Good Job!</p>
          <p className="text-white text-xl text-center w-2/3"> Now show your eye for style and design your own background...</p>
      </div>
    </div>
  );
};

export default GoodJob;
