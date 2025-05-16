import React, { useEffect, useRef } from "react";

const Paper = () => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });

  const dpr = window.devicePixelRatio || 1;
  const displayWidth = window.innerWidth;
  const displayHeight = window.innerHeight - 176;

  // 🔁 Nacrtaj pozadinu direktno u canvas
  const drawBackground = (ctx) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = "/canvasbg.png"; // ✅ koristi sliku iz public foldera
      img.onload = () => {
        ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
        resolve();
      };
      img.onerror = () => {
        console.error("❌ Greška pri učitavanju pozadinske slike");
        resolve();
      };
    });
  };

  // 🖼️ Skini kao PNG (sa pozadinom + crtežom)
  const handleDownload = async () => {
    const canvas = canvasRef.current;

    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const exportCtx = exportCanvas.getContext("2d");
    exportCtx.scale(dpr, dpr);

    const img = new Image();
    img.src = "/canvasbg.png";
    img.onload = () => {
      const scaledWidth = canvas.width / dpr;
      const scaledHeight = canvas.height / dpr;

      exportCtx.drawImage(img, 0, 0, scaledWidth, scaledHeight);
      exportCtx.drawImage(canvas, 0, 0, scaledWidth, scaledHeight);

      const link = document.createElement("a");
      link.download = "my-drawing.png";
      link.href = exportCanvas.toDataURL("image/png");
      link.click();
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
  
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctx.scale(dpr, dpr);
  
    // 1. Prvo crtaj pozadinu — sada će biti vidljiva i odmah
    const img = new Image();
    img.src = "/canvasbg.png";
    img.onload = () => {
      ctx.drawImage(img, 0, 0, displayWidth, displayHeight);
  
      // 2. Kada je pozadina nacrtana, postavi podešavanja za crtanje
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 30;
      ctx.globalAlpha = 0.03;
      ctx.strokeStyle = "#001790";
      ctx.globalCompositeOperation = "multiply";
  
      // Aktiviraj slušanje tek nakon što je sve spremno
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
        if (isDrawing.current) ctx.closePath();
        isDrawing.current = false;
      };
  
      canvas.addEventListener("pointerdown", startDrawing);
      canvas.addEventListener("pointermove", draw);
      canvas.addEventListener("pointerup", stopDrawing);
      canvas.addEventListener("pointerleave", stopDrawing);
      canvas.addEventListener("pointercancel", stopDrawing);
  
      // Clean up
      return () => {
        canvas.removeEventListener("pointerdown", startDrawing);
        canvas.removeEventListener("pointermove", draw);
        canvas.removeEventListener("pointerup", stopDrawing);
        canvas.removeEventListener("pointerleave", stopDrawing);
        canvas.removeEventListener("pointercancel", stopDrawing);
      };
    };
  }, []);
  

  return (
    <div style={{ position: "relative" }}>
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
