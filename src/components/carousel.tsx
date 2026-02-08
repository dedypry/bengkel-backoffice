import { Button } from "@heroui/react";
import "keen-slider/keen-slider.min.css";
import { KeenSliderPlugin, useKeenSlider } from "keen-slider/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  children: any;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: any;
  onSlideChange?: (index: number) => void;
  contentRight?: ReactNode;
  contentCenter?: ReactNode;
}
export default function Carousel({
  children,
  autoPlay = false,
  autoPlayInterval = 5000,
  className,
  onSlideChange,
  contentRight,
  contentCenter,
}: Props) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const ResizePlugin: KeenSliderPlugin = (slider) => {
    const observer = new ResizeObserver(function () {
      slider.update();
    });

    slider.on("created", () => {
      observer.observe(slider.container);
    });
    slider.on("destroyed", () => {
      observer.unobserve(slider.container);
    });
  };
  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
        onSlideChange?.(slider.track.details.rel);
      },
      created(slider) {
        onSlideChange?.(slider.track.details.rel);
      },
    },
    [ResizePlugin],
  );

  useEffect(() => {
    if (!autoPlay || !instanceRef.current) return;

    const interval = setInterval(() => {
      instanceRef.current?.next();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, instanceRef]);

  return (
    <div className={`group relative rounded-sm ${className}`}>
      <div ref={sliderRef} className="keen-slider h-auto w-full">
        {children.map((element: ReactNode, i: number) => (
          <div
            key={`carousel-${i}`}
            className="keen-slider__slide sm flex h-auto w-full min-w-full justify-center"
          >
            {element}
          </div>
        ))}
      </div>
      {children.length > 1 ? (
        <Button
          isIconOnly
          className="group absolute left-2 top-1/2 -translate-y-1/2 transform bg-gray-100 text-gray-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100 hover:bg-white"
          radius="full"
          size="sm"
          onPress={() => instanceRef.current?.prev()}
        >
          <ChevronLeft />
        </Button>
      ) : null}
      {children.length > 1 ? (
        <Button
          isIconOnly
          className="group absolute right-2 top-1/2 -translate-y-1/2 transform bg-gray-100 text-gray-500 opacity-0 transition-opacity duration-500 group-hover:opacity-100 hover:bg-white"
          radius="full"
          size="sm"
          onPress={() => instanceRef.current?.next()}
        >
          <ChevronRight />
        </Button>
      ) : null}
      {children.length > 1 ? (
        <div className="absolute bottom-2 left-2 flex gap-1">
          {children.map((_: any, i: number) => (
            <div
              key={i}
              className={`self-center rounded-full bg-gray-200 transition-all ${
                currentSlide === i ? "h-1 w-4" : "h-1 w-1 bg-opacity-50"
              }`}
            />
          ))}
        </div>
      ) : null}

      {contentRight && (
        <div className="absolute right-12 top-1/2 flex -translate-y-1/2 flex-col gap-2">
          {contentRight}
        </div>
      )}
      {contentCenter && (
        <div className="absolute h-full top-0 w-full">{contentCenter}</div>
      )}
    </div>
  );
}
