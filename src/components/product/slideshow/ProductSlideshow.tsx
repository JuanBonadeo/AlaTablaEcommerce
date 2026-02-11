'use client';

import { useState } from 'react';

import { Swiper as SwiperObject } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';
import { ProductImage } from '../prduct-image/ProductImage';



interface Props {
  images: string[];
  title: string;
  className?: string;
}



export const ProductSlideshow = ({ images, title, className }: Props) => {

  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperObject>();


  return (
    <div className={className}>

      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        } as React.CSSProperties
        }
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 2500
        }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
        }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2 aspect-square rounded-xl overflow-hidden mb-4"
      >

        {
          images.map((image, index) => (
            <SwiperSlide key={image + index} className="bg-[#0a0a0a] flex items-center justify-center aspect-square">
              <ProductImage
                width={1024}
                height={1024}
                src={image}
                alt={title}
                className="w-full h-full object-contain p-4"
              />
            </SwiperSlide>

          ))
        }
      </Swiper>


      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {
          images.map((image, index) => (
            <SwiperSlide key={image + index} className="rounded-lg overflow-hidden cursor-pointer opacity-60 hover:opacity-100 transition-opacity aspect-square bg-[#0a0a0a]">
              <ProductImage
                width={300}
                height={300}
                src={image}
                alt={title}
                className="w-full h-full object-contain rounded-lg p-2"
              />
            </SwiperSlide>

          ))
        }
      </Swiper>

    </div>
  );
};