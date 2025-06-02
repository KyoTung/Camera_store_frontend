import React from "react";
import { Link, Outlet } from "react-router-dom";
import { useStateContext } from "../../contexts/contextProvider";
import { Navigate } from "react-router-dom";
import Header from "./header";
import Sidebar from "./sidebar";
import SlideShow from "./slide";
import Brands from "./brands";
import ProductFilters from './filter'
import FeaturedProducts from '../../pages/client/featuredProducts'
import Footer from "./footer";
const GuestLayout = () => {
    return (
        <div className="">
            <Header />
            <div >
               <Outlet/>
            </div>
            <Footer/>
        </div>
    );
};

export default GuestLayout;
