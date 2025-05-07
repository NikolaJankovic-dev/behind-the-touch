import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import pack from "@/assets/images/pack.png";
import lines from "@/assets/images/lines.png";
import vector from "@/assets/images/vector.png";

const text = [
  "NEW Contemporary \n Pack Design",
  "SAME \n Rich Taste",
  "NEW Fingerprint \n Stick Design",
  "SAME \n Slim Format",
  "NEW \n Filter Design",
  "SAME \n Recessed Filter",
];

const Info = ({step, setStep }) => {
  const [api, setApi] = useState(false);
  React.useEffect(() => {
    if (!api) {
      return
    }

    api.on("select", () => {
      const currentSlide = api.selectedScrollSnap();
      setStep(currentSlide + 1);
    })
  }, [api, setStep])
  return (
    <div
      style={{
        backgroundImage: step < 3 ? `url(${lines})` : `none`,
        backgroundSize: "contain",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      <img
        src={vector}
        alt="vector"
        className="absolute top-0 left-0 w-full mt-10 object-contain"
      />

      <Carousel setApi={setApi}>
        <CarouselContent>
          <CarouselItem>
            <div className="w-full">
              <img
                src={pack}
                alt="pack"
                className="w-[90%] ml-auto mt-32 h-full object-contain"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="w-fit mx-auto h-full relative flex flex-col items-center justify-center gap-4">
              {text.map((item, index) => (
                <div
                  key={index}
                  className="text-2xl text-[#05164E] whitespace-pre-line text-center rounded-2xl p-5 min-w-full"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #C4C4C4 0%, #FFFFFF 50%, #C4C4C4 100%)`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Info;
