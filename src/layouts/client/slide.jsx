import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const slideImages = [
    {
        url: "https://luaviettech.vn/upload/images/lap-dat-camera-an-ninh-tan-noi-tphcm.jpg"
    },
    {
        url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/Artboard%201%20copy.jpg",
    },

    {
        url: "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:80/plain/https://dashboard.cellphones.com.vn/storage/Tp-linik-new.jpg",
    },
];

const SlideShow = () => {
    return (
        <div className="slide-container overflow-hidden rounded-xl border">
            <Slide>
                {slideImages.map((slideImage, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-center"
                    >
                        <img
                            src={slideImage.url}
                            alt={`Slide ${index}`}
                            className="h-[200px] w-full rounded-xl object-cover md:h-[300px] lg:h-[400px]"
                        />
                    </div>
                ))}
            </Slide>
        </div>
    );
};

export default SlideShow;
