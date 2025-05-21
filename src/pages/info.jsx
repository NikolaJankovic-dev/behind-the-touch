import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import pack from "@/assets/images/pack.png";
import lines from "@/assets/images/lines.png";
import vector from "@/assets/images/vector.png";
import Card from "../info/card";
import cigarete from "@/assets/images/cigarete.png";

const text = [
  "NEW Contemporary \n Pack Design",
  "SAME \n Rich Taste",
  "NEW Fingerprint \n Stick Design",
  "SAME \n Slim Format",
  "NEW \n Filter Design",
  "SAME \n Recessed Filter",
];

const Info = ({ step, setStep, setShowNext }) => {
  const [api, setApi] = useState(null);
  const [disableSwipe, setDisableSwipe] = useState(false);
  const lastIndex = React.useRef(0);

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const current = api.selectedScrollSnap();
      setStep(current + 1);
      lastIndex.current = current;

      // Kada smo na drugom slajdu, blokiramo swipe
      setDisableSwipe(current === 1);
    };

    api.on("select", onSelect);
    onSelect();

    return () => {
      api.off("select", onSelect);
    };
  }, [api, setStep]);

  return (
    <div
      style={{
        backgroundImage: step < 3 ? `url(${lines})` : `none`,
        backgroundSize: "contain",
        backgroundPosition: "top",
        backgroundRepeat: "no-repeat",
        position: "relative",
        width: "100%",
        height: window.innerHeight,
      }}
    >
      <img
        src={vector}
        alt="vector"
        className="absolute top-0 left-0 w-full mt-10 object-contain"
      />
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: false,
        }}
        className={`${disableSwipe ? "pointer-events-none" : ""} `}
        style={{
          height: window.innerHeight,
        }}
      >
        <CarouselContent className="h-full">
          <CarouselItem>
            <div className="w-full">
              <img
                src={pack}
                alt="pack"
                className="h-[76vh] absolute bottom-28 right-0 object-contain"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="relative " style={{
              height: window.innerHeight,
            }}>
              {" "}
              <img
                src={cigarete}
                alt="cigarete"
                className=" object-contain absolute bottom-30 left-0 max-h-[70vh]"
              />
              <div className="w-fit mx-auto  relative flex flex-col items-center justify-center gap-2  mt-4" style={{
                height: window.innerHeight - 160,
              }}>
                {text.map((item, index) => (
                  <Card
                    key={index}
                    item={item}
                    index={index}
                    step={step}
                    setShowNext={setShowNext}
                  />
                ))}
              </div>
            </div>
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Info;
