import { useState } from "react";
import "./App.css";
import Landing from "./pages/landing";
import { AnimatePresence, motion } from "motion/react";
import Info from "./pages/info";
import info from "@/assets/images/info.png";
import { Button } from "@/components/ui/button";
import GoodJob from "./pages/goodjob";
import Paper from "./pages/paper";
import forward from "@/assets/images/icons/forward.png";
import restart from "@/assets/images/icons/restart.png";
function App() {
  const [step, setStep] = useState(0);
  const [hideContainer, setHideContainer] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

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
          {(step === 5 || step === 6 || step === 7) && (
            <motion.div
              key="paper-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ position: "absolute", width: "100%", height: "100%" }}
            >
              <Paper step={step} hideContainer={hideContainer} setHideContainer={setHideContainer} setStep={setStep} setHasDrawn={setHasDrawn} />
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          // initial={{  }}
          animate={{ y: hideContainer ? "100%" : "0%" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute bottom-0 left-2 right-2 p-4 bg-[#151515] rounded-t-3xl  h-40 overflow-hidden"
          style={{
            boxShadow: "0px -14px 96px 0px #1580AF",
          }}
        >
          <div className="flex items-center justify-center">
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.button
                  key="start-now"
                  onClick={() => setStep(1)}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -500, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-white text-4xl  cursor-pointer flex items-center gap-4"
                >
                  Start Now <img src={forward} alt="forward" className="w-8 h-8" />
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
                  <div className="text-white text-xl  flex items-center gap-2">
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
                      className={`text-white text-xl  cursor-pointer hover:no-underline ${step === 2 ? "hover:cursor-pointer" : "hover:cursor-default"}`}
                      variant="link"
                    >
                      Next
                    </Button>
                  </motion.div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.button
                  key="next-button"
                  onClick={() => setStep(4)}
                  initial={{ x: 500, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -500, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-white text-4xl  cursor-pointer flex items-center gap-4"
                >
                  Next <img src={forward} alt="forward" className="w-8 h-8" />
                </motion.button>
              )}
              {step === 4 && (
                <motion.button
                  key="start-now-button"
                  onClick={() => setStep(5)}
                  initial={{ x: 500, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -500, opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="text-white text-4xl  cursor-pointer flex items-center gap-4"
                >
                  Start now <img src={forward} alt="forward" className="w-8 h-8" />
                </motion.button>
              )}
                {(step === 5 || step === 6) && (
                  <motion.button
                    key="finish-button"
                    initial={{ x: 500, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -500, opacity: 0 }}
                    onClick={() => setStep((prev) => prev + 1)}
                    className={`text-white text-4xl   flex items-center gap-4 ${!hasDrawn ? "!opacity-20" : "!opacity-100 cursor-pointer"}`}
                    disabled={!hasDrawn}
                  >
                    Finish <img src={forward} alt="forward" className="w-8 h-8" />
                  </motion.button>
                )}
                {step === 7 && (
                  <motion.button
                    key="restart-button"
                    initial={{ x: 500, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -500, opacity: 0 }}
                    onClick={() => {setStep(0); setHasDrawn(false);}}
                    className="text-white text-4xl  cursor-pointer flex items-center gap-4"
                  >
                    Restart <img src={restart} alt="restart" className="w-8 h-8" />
                  </motion.button>
                )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
