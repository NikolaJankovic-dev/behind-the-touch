import { useState } from "react";
import "./App.css";
import Landing from "./pages/landing";
import { AnimatePresence, motion } from "motion/react";
import Info from "./pages/info";
import info from "@/assets/images/info.png";
import { Button } from "@/components/ui/button";
import GoodJob from "./pages/goodjob";
import Paper from "./pages/paper";
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
        <AnimatePresence initial={false}>
          {(step === 0 || step === 4) && (
            <motion.div
              key="landing-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <Landing step={step} />
            </motion.div>
          )}
          {(step === 1 || step === 2) && (
            <motion.div
              key="info-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <Info step={step} setStep={setStep} />
            </motion.div>
          )}
          {step === 3 && (
            <motion.div
              key="goodjob-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <GoodJob step={step} />
            </motion.div>
          )}
          {step === 5 && (
            <motion.div
              key="paper-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <Paper step={step} />
            </motion.div>
          )}
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

              {(step === 1 || step === 2) && (
                <motion.div
                  key="next"
                  // onClick={() => setStep((prev) => prev + 1)}
                  initial={{ x: 500, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -500, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="flex flex-col justify-center items-center gap-2"
                >
                  <div className="text-white text-xl font-semibold flex items-center gap-2">
                    <motion.span
                      className="w-4 h-4 rounded-full  block border border-white"
                      initial={{ backgroundColor: "#ffffffff" }}
                      animate={{
                        backgroundColor: step === 1 ? "#ffffffff" : "#ffffff00",
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    ></motion.span>
                    <motion.span
                      className="w-4 h-4 rounded-full  block border border-white"
                      initial={{ backgroundColor: "#ffffff00" }}
                      animate={{
                        backgroundColor: step === 2 ? "#ffffff" : "#ffffff00",
                      }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    ></motion.span>
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: step === 2 ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Button
                      onClick={() => {
                        if (step === 2) {
                          setStep(3);
                        } 
                      }}
                      className={`text-white text-xl font-semibold cursor-pointer hover:no-underline ${step === 2 ? "hover:cursor-pointer" : "hover:cursor-default"}`}
                      variant="link"
                    >
                      Next
                    </Button>
                  </motion.div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.button
                  onClick={() => setStep(4)}
                  initial={{ x: 500, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -500, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-white text-xl font-semibold cursor-pointer"
                >
                  Next
                </motion.button>
              )}
              {step === 4 && (
                <motion.button
                  onClick={() => setStep(5)}
                  initial={{ x: 500, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -500, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-white text-xl font-semibold cursor-pointer"
                >
                  Start now
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
