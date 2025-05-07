import React from "react";
import landing from "@/assets/images/landing.png";

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
    ></div>
  );
};

export default Landing;
