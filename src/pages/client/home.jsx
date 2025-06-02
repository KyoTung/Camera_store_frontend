import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../layouts/client/sidebar";
import SlideShow from "../../layouts/client/slide";
import Brands from "../../layouts/client/brands";
import ProductFilters from "../../layouts/client/filter";
import FeaturedProducts from "./featuredProducts";
import axiosClient from "../../axios-client";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../../compoments/Loading";
import { FaStar } from "react-icons/fa";
import AllProduct from './allProduct';

const Home = () => {
    
    return (
        <div
            className=""
            style={{ backgroundColor: "#fcfbfb " }}
        >
            <div className="mx-auto flex max-w-7xl gap-6 p-4 sm:px-6">
                <div className="hidden w-1/5 lg:block">
                    <Sidebar />
                </div>
                <div
                    className="lg:w-5/5 w-full lg:-ml-6"
                    
                >
                    <SlideShow />
                </div>
            </div>

            <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
                <Brands />
                <FeaturedProducts />
            </div>

            {/* All products section */}
            <AllProduct />
        </div>
    );
};

export default Home;
