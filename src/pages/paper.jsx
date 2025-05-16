import React, { useEffect, useRef } from "react";
import canvasbg from "@/assets/images/canvasbg.png"; // ili "/canvasbg.png" ako koristiš public folder

const Paper = () => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  const dpr = window.devicePixelRatio || 1;
  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight - 176;

  // 🔁 Crtaj pozadinu na canvas
  const drawBackground = (ctx) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = canvasbg;
      img.onload = () => {
        ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
        resolve();
      };
    });
  };

  // 🖼️ Skini kao PNG
  const handleDownload = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    const dpr = window.devicePixelRatio || 1;
    const scaledWidth = canvas.width / dpr;
    const scaledHeight = canvas.height / dpr;
  
    // 1. Napravi novi "export" canvas
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext('2d');
    exportCtx.scale(dpr, dpr);
  
    // 2. Učitaj pozadinsku sliku i nacrtaj je
    const bgImage = new Image();
    bgImage.src = canvasbg;
  
    bgImage.onload = () => {
      // nacrtaj pozadinu
      exportCtx.drawImage(bgImage, 0, 0, scaledWidth, scaledHeight);
  
      // 3. Nacrtaj originalni canvas sadržaj PREKO (sve što si crtao)
      exportCtx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);
  
      // 4. Skini kao PNG
      const link = document.createElement("a");
      link.download = "my-drawing.png";
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    };
  };
  
  
  

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // ✅ Pravilno skaliranje
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);

    // 1. Nacrtaj pozadinu
    // drawBackground(ctx);

    // 2. Podešavanja četke
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.lineWidth = 30;
    ctx.globalAlpha = 0.03; // flomaster efekat
    ctx.strokeStyle = "#001790";
    ctx.globalCompositeOperation = 'multiply';

    // Utility
    const getPos = (e) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const startDrawing = (e) => {
      const { x, y } = getPos(e);
      isDrawing.current = true;
      lastPoint.current = { x, y };
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e) => {
      if (!isDrawing.current) return;
      const { x, y } = getPos(e);
      ctx.lineTo(x, y);
      ctx.stroke();
    };

    const stopDrawing = () => {
      if (isDrawing.current) {
        ctx.closePath();
      }
      isDrawing.current = false;
    };

    // Event listeners
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
  }, []);

  return (
    <div
      style={{
        position: "relative",
        backgroundImage: `url(${canvasbg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100%",
        height: "100%",
      }}
    >
      <canvas
        ref={canvasRef}
        id="canvas"
        style={{
          width: "100%",
          height: "calc(100vh - 11rem)",
          touchAction: "none",
          cursor: "crosshair",
        }}
      ></canvas>
      <button
        onClick={handleDownload}
        style={{
          position: "absolute",
          top: "1rem",
          right: "1rem",
          zIndex: 10,
          padding: "0.5rem 1rem",
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Download
      </button>
    </div>
  );
};

export default Paper;
