import React from "react";
import { Slide } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";

const slideImages = [
    {
        url: "https://static.vecteezy.com/system/resources/previews/008/291/063/non_2x/photo-equipment-banner-horizontal-cartoon-style-vector.jpg",
    },
    {
        url: "https://luaviettech.vn/upload/images/lap-dat-camera-an-ninh-tan-noi-tphcm.jpg",
    },
    {
        url: "https://img.freepik.com/free-vector/modern-sale-banner-with-abstract-shapes_1361-1641.jpg",
    },
];

const SlideShow = () => {
    return (
        <div className="slide-container overflow-hidden rounded-xl border">
            <Slide>
                {slideImages.map((slideImage, index) => (
                    <div key={index}>
                        <div
                            className="flex h-[200px] w-full items-center justify-center bg-cover bg-center md:h-[300px] lg:h-[400px]"
                            style={{ backgroundImage: `url(${slideImage.url})` }}
                        />
                    </div>
                ))}
            </Slide>
        </div>
    );
};

export default SlideShow;
