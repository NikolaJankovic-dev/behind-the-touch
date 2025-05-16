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
    ></div>
  );
};

export default GoodJob;
