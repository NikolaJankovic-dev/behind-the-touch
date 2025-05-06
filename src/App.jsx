import { useState } from "react";
import "./App.css";
import Landing from "./pages/landing";
import { AnimatePresence, motion } from "motion/react";
import Info from "./pages/info";
import info from "@/assets/images/info.png";
function App() {
  const [step, setStep] = useState(0);

  return (
    <div
      className="  flex items-center justify-center bg-gray-700 overflow-hidden"
      style={{ height: window.innerHeight }}
    >
      <div
        className=" sm:rounded-lg rounded-none shadow-lg  sm:aspect-[9/16] aspect-auto w-full sm:w-auto relative overflow-hidden"
        style={{
          height: window.innerHeight,
          backgroundImage: `url(${info})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <AnimatePresence mode="wait">
          {step === 0 && <Landing step={step} />}
          {step === 1 && <Info step={step} />}
        </AnimatePresence>
        <div
          className="absolute bottom-0 left-2 right-2 p-4 bg-[#151515] rounded-t-3xl  h-40"
          style={{
            boxShadow: "0px -14px 96px 0px #1580AF",
          }}
        >
          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.button
                  onClick={() => setStep(1)}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -500, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-white text-xl font-semibold cursor-pointer"
                >
                  Start now
                </motion.button>
              )}

              {step === 1 && (
                <motion.button
                  key="next"
                  onClick={() => setStep((prev) => prev + 1)}
                  initial={{ x: 500, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -500, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-white text-xl font-semibold"
                >
                  Next
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
