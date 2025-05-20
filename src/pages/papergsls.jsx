import React, { useEffect, useRef, useState } from "react";
import { MessageCarousel } from "../components/game/message-carousel";
import { motion } from "motion/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import canvasbg from "@/assets/images/canvasbg.png";
import back from "@/assets/images/icons/back.png";
import zoom from "@/assets/images/icons/zoom.png";
import download from "@/assets/images/icons/download.png";

function ShaderPlane({ texture }) {
  const meshRef = useRef();
  const { viewport } = useThree();

  useFrame(() => {
    if (texture.current) texture.current.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={{
          uTexture: { value: texture.current },
        }}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          varying vec2 vUv;
          void main() {
            gl_FragColor = texture2D(uTexture, vUv);
          }
        `}
      />
    </mesh>
  );
}
function Scene({ texture }) {
  return <ShaderPlane texture={texture} />;
}

const Paper = ({
  setHideContainer,
  step,
  setStep,
  setHasDrawn,
  hideContainer,
}) => {
  const canvasRef = useRef(document.createElement("canvas"));
  const initialCanvasSnapshot = useRef(null);
  const messageImageRef = useRef(null);
  const containerRef = useRef(null);
  const ctxRef = useRef(null);
  const textureRef = useRef(null);
  const lastPos = useRef(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [ready, setReady] = useState(false);

  const loadImage = (src) =>
    new Promise((res) => {
      const img = new Image();
      img.src = src;
      img.onload = () => res(img);
    });

    

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = containerRef.current.clientWidth;
    canvas.height = containerRef.current.clientHeight;
    ctxRef.current = canvas.getContext("2d");

    loadImage(canvasbg).then((img) => {
      ctxRef.current.drawImage(img, 0, 0, canvas.width, canvas.height);
      textureRef.current = new THREE.CanvasTexture(canvas);
      setReady(true);
    });
  }, []);

  const draw = (x, y) => {
    if (step !== 5) return;
  
    setHasDrawn(true);
    setHideContainer(true);
    const canvas = canvasRef.current;

    const ctx = ctxRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / window.innerWidth;
    const scaleY = canvas.height / window.innerHeight;
    const mappedX = (x - rect.left) * scaleX;
    const mappedY = (y - rect.top) * scaleY;

    const radius = 32;
    const steps = 8;

    if (lastPos.current) {
      const dx = mappedX - lastPos.current.x;
      const dy = mappedY - lastPos.current.y;
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const ix = lastPos.current.x + dx * t;
        const iy = lastPos.current.y + dy * t;
        const pixel = ctx.getImageData(ix, iy, 1, 1).data;
        ctx.fillStyle = `rgba(${pixel[0] * 0.97}, ${pixel[1] * 0.97}, ${
          pixel[2] * 0.97
        }, 0.06)`;
        ctx.beginPath();
        ctx.arc(ix, iy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      setHasDrawn(true);
    }
    lastPos.current = { x: mappedX, y: mappedY };
  };

  const reset = () => {
    if (step !== 5) return;
    lastPos.current = null;
    setHideContainer(false);

    // Ovde snimamo canvas snapshot nakon završetka crtanja
    if (ctxRef.current && canvasRef.current) {
      initialCanvasSnapshot.current = ctxRef.current.getImageData(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.download = "my-drawing.png";

    // Kreiramo privremeni canvas za download
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    const tempCtx = tempCanvas.getContext("2d");

    // Kopiramo sadržaj originalnog canvas-a
    tempCtx.drawImage(canvasRef.current, 0, 0);

    // Konvertujemo u PNG sa transparentnom pozadinom
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (step === 6 && initialCanvasSnapshot.current) {
      ctx.putImageData(initialCanvasSnapshot.current, 0, 0);

      const img = new Image();
      img.src = `/message${activeSlide + 1}.png`;

      img.onload = () => {
        const imgWidth = img.width;
        const imgHeight = img.height;
        const padding = 32;

        const frameWidth = imgWidth + padding * 2;
        const frameHeight = imgHeight + padding * 2;

        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const frameX = (canvasWidth - frameWidth) / 2;
        const frameY = (canvasHeight - frameHeight) / 2;
        const imgX = frameX + padding;
        const imgY = frameY + padding;

        const ctx = canvas.getContext("2d");

        // 🧊 Glassmorphism background
        ctx.save();
        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;

        const borderRadius = 30;
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

        const gradient = ctx.createRadialGradient(
          frameX + frameWidth / 2,
          frameY + frameHeight / 2,
          0,
          frameX + frameWidth / 2,
          frameY + frameHeight / 2,
          frameWidth / 2
        );
        gradient.addColorStop(0.41, "rgba(180,180,180,0.1)");
        gradient.addColorStop(1, "rgba(180,180,180,0.3)");
        ctx.fillStyle = gradient;
        ctx.fill();

        // 📥 Draw the image exactly as-is
        ctx.drawImage(img, imgX, imgY);

        ctx.restore();

        messageImageRef.current = {
          x: imgX,
          y: imgY,
          width: imgWidth,
          height: imgHeight,
        };
      };
    }

    if (step === 5 && initialCanvasSnapshot.current) {
      ctx.putImageData(initialCanvasSnapshot.current, 0, 0);
      messageImageRef.current = null;
    }
  }, [step, activeSlide]);

  // if (!ready) return null;

  return (
    <div style={{ position: "relative", height: window.innerHeight }} ref={containerRef}>
      <Canvas
        onPointerDown={() => step === 5 && setHideContainer(true)}
        onPointerMove={(e) =>
          e.buttons === 1 && step === 5 && draw(e.clientX, e.clientY)
        }
        onPointerUp={reset}
        onPointerLeave={reset}
        onTouchMove={(e) =>
          step === 5 && draw(e.touches[0].clientX, e.touches[0].clientY)
        }
        onTouchEnd={reset}
        style={{ cursor: step === 5 ? "crosshair" : "default" }}
      >
        <Scene texture={textureRef} />
      </Canvas>

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
          className="absolute bottom-40 left-2 right-2 p-4 gap-4 rounded-3xl text-white  flex flex-col justify-center items-center cursor-pointer"
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
