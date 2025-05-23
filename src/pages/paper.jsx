import React, { useEffect, useRef, useState } from "react";
import { MessageCarousel } from "../components/game/message-carousel";
import { AnimatePresence, motion } from "motion/react";
import back from "@/assets/images/icons/back.png";
import download from "@/assets/images/icons/download.png";
import hand from "@/assets/images/hand.png";
import ellipse from "@/assets/images/ellipse.png";

const Paper = ({
  setHideContainer,
  step,
  setStep,
  hideContainer,
  setHasDrawn,
  hasDrawn,
  undoSignal,
  setUndoDisabled,
}) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef({ x: 0, y: 0 });
  const [activeSlide, setActiveSlide] = useState(0);
  const stepRef = useRef(step);
  const initialCanvasSnapshot = useRef(null);
  const messageImageRef = useRef(null);
  const [showHand, setShowHand] = useState(true);
  const ctxRef = useRef(null);
  const undoStack = useRef([]);
  const [undoStackSize, setUndoStackSize] = useState(0);


  let snapshot = null;
  let offscreenCanvas = null;
  let offscreenCtx = null;

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHand(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

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
    ctxRef.current = canvas.getContext("2d");
    if (!canvas || !ctxRef.current) return;

    const container = canvas.parentElement;
    const displayWidth = container.clientWidth;
    const displayHeight = container.clientHeight;
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    canvas.width = displayWidth * dpr;
    canvas.height = displayHeight * dpr;
    ctxRef.current.setTransform(1, 0, 0, 1, 0, 0);
    ctxRef.current.scale(dpr, dpr);

    const img = new Image();
    img.src = "/canvasbg.png";
    img.onload = () => {
      ctxRef.current.drawImage(img, 0, 0, displayWidth, displayHeight);
      undoStack.current.push(
        ctxRef.current.getImageData(0, 0, canvas.width, canvas.height)
      );
      // Inicijalizuj offscreen canvas
      offscreenCanvas = document.createElement("canvas");
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      offscreenCtx = offscreenCanvas.getContext("2d");
      offscreenCtx.drawImage(img, 0, 0, displayWidth, displayHeight);

      const getPixelColor = (x, y) => {
        if (!offscreenCtx) return { r: 0, g: 0, b: 0, a: 255 };
        const pixel = offscreenCtx.getImageData(x, y, 1, 1).data;
        return {
          r: pixel[0],
          g: pixel[1],
          b: pixel[2],
          a: pixel[3],
        };
      };

      const darkenColor = (color) => {
        // Ako je boja već dosta tamna (manje od 50), ne potamnjuj je više
        if (color.r < 50 && color.g < 50 && color.b < 50) {
          return color;
        }

        return {
          r: Math.max(0, Math.floor(color.r * 0.8)),
          g: Math.max(0, Math.floor(color.g * 0.8)),
          b: Math.max(0, Math.floor(color.b * 0.8)),
          a: color.a,
        };
      };

      initialCanvasSnapshot.current = ctxRef.current.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if (e.touches && e.touches.length > 0) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }
        return {
          x: clientX - rect.left,
          y: clientY - rect.top,
        };
      };

      const startDrawing = (e) => {
        if (e.touches) e.preventDefault();
        if (stepRef.current !== 5) return;
        const { x, y } = getPos(e);
        isDrawing.current = true;
        lastPoint.current = { x, y };

        const color = getPixelColor(x, y);
        const darkenedColor = darkenColor(color);
        ctxRef.current.fillStyle = `rgba(${darkenedColor.r}, ${darkenedColor.g}, ${darkenedColor.b}, 0.8)`;

        ctxRef.current.beginPath();
        ctxRef.current.moveTo(x, y);
        setHideContainer(true);
        setHasDrawn(true);
      };

      const draw = (e) => {
        if (e.touches) e.preventDefault();
        if (!isDrawing.current || stepRef.current !== 5) return;
        const { x, y } = getPos(e);
        window.requestAnimationFrame(() => {
          // Interpolacija između prethodne i nove tačke
          const dx = x - lastPoint.current.x;
          const dy = y - lastPoint.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const steps = Math.ceil(distance / 1);
          for (let i = 0; i < steps; i++) {
            const t = i / steps;
            const ix = lastPoint.current.x + dx * t;
            const iy = lastPoint.current.y + dy * t;
            const color = getPixelColor(ix, iy);
            // Tamni više r/g, manje b, i malo pojačaj plavu
            const darkenedColor = {
              r: Math.max(0, Math.floor(color.r * 0.92)),
              g: Math.max(0, Math.floor(color.g * 0.92)),
              b: Math.min(255, Math.floor(color.b * 0.97) + 4),
              a: color.a,
            };
            ctxRef.current.fillStyle = `rgba(${darkenedColor.r}, ${darkenedColor.g}, ${darkenedColor.b}, 0.09)`;
            ctxRef.current.beginPath();
            ctxRef.current.arc(ix, iy, 96, 0, Math.PI * 2);
            ctxRef.current.fill();
            // Crtaj i na offscreen canvas
            offscreenCtx.fillStyle = ctxRef.current.fillStyle;
            offscreenCtx.beginPath();
            offscreenCtx.arc(ix, iy, 96, 0, Math.PI * 2);
            offscreenCtx.fill();
          }
          // update snapshot posle svakog poteza
          snapshot = ctxRef.current.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          );
          lastPoint.current = { x, y };
        });
      };

      const stopDrawing = (e) => {
        if (e && e.touches) e.preventDefault();
        if (isDrawing.current && stepRef.current === 5) {
          ctxRef.current.closePath();

          // Snimi poslednji potez za undo
          if (undoStack.current.length >= 20) {
            undoStack.current.shift(); // limit
          }
          undoStack.current.push(
            ctxRef.current.getImageData(0, 0, canvas.width, canvas.height)
          );
          setUndoDisabled(false);
          setUndoStackSize(undoStack.current.length);
          initialCanvasSnapshot.current = ctxRef.current.getImageData(
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
      canvas.addEventListener("touchstart", startDrawing, { passive: false });
      canvas.addEventListener("touchmove", draw, { passive: false });
      canvas.addEventListener("touchend", stopDrawing, { passive: false });
      canvas.addEventListener("touchcancel", stopDrawing, { passive: false });

      return () => {
        canvas.removeEventListener("pointerdown", startDrawing);
        canvas.removeEventListener("pointermove", draw);
        canvas.removeEventListener("pointerup", stopDrawing);
        canvas.removeEventListener("pointerleave", stopDrawing);
        canvas.removeEventListener("pointercancel", stopDrawing);
        canvas.removeEventListener("touchstart", startDrawing, {
          passive: false,
        });
        canvas.removeEventListener("touchmove", draw, { passive: false });
        canvas.removeEventListener("touchend", stopDrawing, { passive: false });
        canvas.removeEventListener("touchcancel", stopDrawing, {
          passive: false,
        });
      };
    };
  }, []);

  const handleUndo = () => {
    if (undoStack.current.length > 1) {
      undoStack.current.pop();
      const prevImage = undoStack.current[undoStack.current.length - 1];
      ctxRef.current.putImageData(prevImage, 0, 0);
      initialCanvasSnapshot.current = prevImage;
      setUndoStackSize(undoStack.current.length);
    } 
  };

  useEffect(() => {
    console.log("undoStack length", undoStackSize);
    if (undoStackSize === 1) {
      setUndoDisabled(true);
      setHasDrawn(false);
    }
  }, [undoStackSize]);

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

  useEffect(() => {
    handleUndo();
  }, [undoSignal]);

  return (
    <div style={{ position: "relative", height: window.innerHeight }}>
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
      {step === 7 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute bottom-32  left-2 right-2 p-4 gap-4 rounded-3xl text-white  flex flex-col justify-center items-center cursor-pointer"
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
      <AnimatePresence>
        {!hasDrawn && showHand && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 aspect-square   rounded-full   flex l justify-center items-center pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, #B4B4B410 0%, #B4B4B430 100%), radial-gradient(circle at center, transparent 0%, #ffffff20 44%, #ffffff66 100%)",
              backdropFilter: "blur(20px)",
              boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.3)",
            }}
          >
            <div className="w-full h-full flex justify-center items-center relative">
              <img
                src={ellipse}
                alt="elipse"
                className="w-1/2 h-1/2 absolute top-3 left-3 "
              />
              <motion.img
                src={hand}
                alt="hand"
                className="w-1/2 h-1/2"
                // rotate 90 degrees and back in loop
                animate={{
                  rotate: -40,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Paper;
