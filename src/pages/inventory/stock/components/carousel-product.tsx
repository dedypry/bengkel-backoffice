import { Image } from "@heroui/react";

import Carousel from "@/components/carousel";

interface Props {
  images: any[];
}
export default function CarouselProduct({ images }: Props) {
  return (
    <Carousel autoPlay={true}>
      {images?.map((img) => (
        <div key={img.id}>
          <Image
            alt={img.filename}
            className="object-contain w-full h-full max-h-[500px]"
            radius="none"
            src={img.path}
          />
        </div>
      ))}
    </Carousel>
  );
}
