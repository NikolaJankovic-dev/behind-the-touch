import React, { useEffect, useRef, useState } from "react";
import { MessageCarousel } from "../components/game/message-carousel";
import { motion } from "motion/react";
import back from "@/assets/images/icons/back.png";
import zoom from "@/assets/images/icons/zoom.png";
import download from "@/assets/images/icons/download.png";

const Paper = ({
  setHideContainer,
  step,
  setStep,
  setHasDrawn,
  hideContainer,
}) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const [activeSlide, setActiveSlide] = useState(0);
  const stepRef = useRef(step);
  const initialCanvasSnapshot = useRef(null);
  const messageImageRef = useRef(null);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // 🔁 Nacrtaj pozadinu direktno u canvas

  // 🖼️ Skini kao PNG (sa pozadinom + crtežom)
  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "my-drawing.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!canvas || !ctx) return;
  
    const container = canvas.parentElement;
    const displayWidth = container.clientWidth;
    const displayHeight = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;
  
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  
    const img = new Image();
    img.src = "/canvasbg.png";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
  
      ctx.fillStyle = "#001790";
      ctx.globalAlpha = 0.02;
      ctx.globalCompositeOperation = "multiply";
  
      initialCanvasSnapshot.current = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );
  
      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        return {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        };
      };
  
      const startDrawing = (e) => {
        if (stepRef.current !== 5) return;
        const { x, y } = getPos(e);
        isDrawing.current = true;
        lastPoint.current = { x, y };
        ctx.beginPath();
        ctx.moveTo(x, y);
        setHideContainer(true);
        setHasDrawn(true);
      };
  
      const draw = (e) => {
        if (!isDrawing.current || stepRef.current !== 5) return;
  
        const { x, y } = getPos(e);
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
      };
  
      const stopDrawing = () => {
        if (isDrawing.current && stepRef.current === 5) {
          ctx.closePath();
  
          initialCanvasSnapshot.current = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
        }
  
        isDrawing.current = false;
        setHideContainer(false);
      };
  
      canvas.addEventListener("pointerdown", startDrawing);
      canvas.addEventListener("pointermove", draw);
      canvas.addEventListener("pointerup", stopDrawing);
      canvas.addEventListener("pointerleave", stopDrawing);
      canvas.addEventListener("pointercancel", stopDrawing);
  
      return () => {
        canvas.removeEventListener("pointerdown", startDrawing);
        canvas.removeEventListener("pointermove", draw);
        canvas.removeEventListener("pointerup", stopDrawing);
        canvas.removeEventListener("pointerleave", stopDrawing);
        canvas.removeEventListener("pointercancel", stopDrawing);
      };
    };
  }, []);
  

  useEffect(() => {
    if (step !== 6 || !initialCanvasSnapshot.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const container = canvas.parentElement;
    const displayWidth = container.clientWidth;
    const displayHeight = container.clientHeight;

    const frameWidth = displayWidth * 0.98;
    const frameHeight = displayHeight * 0.35;
    const frameX = (displayWidth - frameWidth) / 2;
    const frameY = (displayHeight - frameHeight) / 2;
    const borderRadius = 30;

    // 🎯 Vrati početno stanje canvas-a
    ctx.putImageData(initialCanvasSnapshot.current, 0, 0);

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;

    // ✅ Rounded dark frame
    ctx.beginPath();
    ctx.moveTo(frameX + borderRadius, frameY);
    ctx.lineTo(frameX + frameWidth - borderRadius, frameY);
    ctx.quadraticCurveTo(
      frameX + frameWidth,
      frameY,
      frameX + frameWidth,
      frameY + borderRadius
    );
    ctx.lineTo(frameX + frameWidth, frameY + frameHeight - borderRadius);
    ctx.quadraticCurveTo(
      frameX + frameWidth,
      frameY + frameHeight,
      frameX + frameWidth - borderRadius,
      frameY + frameHeight
    );
    ctx.lineTo(frameX + borderRadius, frameY + frameHeight);
    ctx.quadraticCurveTo(
      frameX,
      frameY + frameHeight,
      frameX,
      frameY + frameHeight - borderRadius
    );
    ctx.lineTo(frameX, frameY + borderRadius);
    ctx.quadraticCurveTo(frameX, frameY, frameX + borderRadius, frameY);
    ctx.closePath();

    ctx.fillStyle = "rgba(21, 21, 21, 0.7)";
    ctx.fill();

    // 🌫️ Radial overlay
    const gradient = ctx.createRadialGradient(
      frameX + frameWidth / 2,
      frameY + frameHeight / 2,
      0,
      frameX + frameWidth / 2,
      frameY + frameHeight / 2,
      frameWidth / 2
    );
    gradient.addColorStop(0.4, "rgba(180, 180, 180, 0.1)");
    gradient.addColorStop(1, "rgba(180, 180, 180, 0.3)");
    ctx.fillStyle = gradient;
    ctx.fill();

    // 🖼️ Učitaj i nacrtaj poruku
    const img = new Image();
    img.src = `/message${activeSlide + 1}.png`;

    img.onload = () => {
      const scale = Math.min(
        (frameWidth * 0.9) / img.width,
        (frameHeight * 0.9) / img.height
      );
      const imgWidth = img.width * scale;
      const imgHeight = img.height * scale;
      const imgX = frameX + (frameWidth - imgWidth) / 2;
      const imgY = frameY + (frameHeight - imgHeight) / 2;

      ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
      ctx.restore();

      messageImageRef.current = {
        x: frameX,
        y: frameY,
        width: frameWidth,
        height: frameHeight,
      };
    };
  }, [step, activeSlide]);

  useEffect(() => {
    if (
      step === 5 &&
      messageImageRef.current &&
      initialCanvasSnapshot.current
    ) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      // Vraćamo canvas u stanje pre poruke
      ctx.putImageData(initialCanvasSnapshot.current, 0, 0);

      // Očistimo referencu na poruku
      messageImageRef.current = null;
    }
  }, [step]);

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{
          //   width: "100%",
          height: "100vh",
          touchAction: "none",
          cursor: stepRef.current === 5 ? "crosshair" : "default",
        }}
      ></canvas>
      {step === 6 && (
        <MessageCarousel
          activeSlide={activeSlide}
          setActiveSlide={setActiveSlide}
        />
      )}
      <motion.div
        initial={{ y: "0%" }}
        animate={{ y: hideContainer ? "-100%" : "0%" }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="absolute top-0 left-0 right-0 p-4  rounded-b-3xl  h-40 flex justify-start items-end"
        style={{
          background: "radial-gradient(circle, #b4b4b410, #b4b4b430)",
          backdropFilter: "blur(20px)",
          boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        {" "}
        {step < 7 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onClick={() => setStep((prev) => prev - 1)}
            className="flex items-center gap-2 font-bold  text-xl cursor-pointer"
          >
            <img src={back} alt="back" className="w-8 h-8" />
            Back
          </motion.button>
        )}
        {step === 7 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex items-center gap-2 font-bold  text-xl text-white cursor-pointer"
          >
            <img src={zoom} alt="zoom" className="w-8 h-8" />
            Zoom-in
          </motion.button>
        )}
      </motion.div>
      {step === 7 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute bottom-[170px] left-2 right-2 p-4 gap-4 rounded-3xl text-white  flex flex-col justify-center items-center cursor-pointer"
          style={{
            background:
              "radial-gradient(circle at center, #0A578C 0%, #0E2843 100%)",
            backdropFilter: "blur(20px)",
            boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.1)",
          }}
          onClick={handleDownload}
        >
          <img src={download} alt="download" className="w-8 h-8" />
          Download item image
        </motion.div>
      )}
    </div>
  );
};

export default Paper;
