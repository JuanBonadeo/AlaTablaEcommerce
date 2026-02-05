'use client';

import Image from 'next/image';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Pagination } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';



interface Props {
  images: string[];
  title: string;
  className?: string;
}



export const ProductMobileSlideshow = ({ images, title, className }: Props) => {


  return (
    <div className={className}>

      <Swiper
        style={{
          width: '100%',
          height: '400px',
          maxHeight: '500px'
        }}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 2500
        }}
        modules={[FreeMode, Autoplay, Pagination]}
        className="mySwiper2"
      >

        {
          images.map((image, index) => (
            <SwiperSlide key={image + index} className="bg-[#0a0a0a] flex items-center justify-center">
              <Image
                width={600}
                height={600}
                src={`${image}`}
                alt={title}
                className="object-contain w-full h-full"
              />
            </SwiperSlide>

          ))
        }
      </Swiper>



    </div>
  );
};