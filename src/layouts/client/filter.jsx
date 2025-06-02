import { useState } from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowUpShortWide } from "react-icons/fa6";
import { FaArrowDownWideShort } from "react-icons/fa6";
import "../../index.css"

const ProductFilters = ({ products, onFilter }) => {
    const [sortBy, setSortBy] = useState("");

    // Xử lý thay đổi bộ lọc
    const handleSortChange = (type) => {
        setSortBy(type);
        let sortedProducts = [...products];

        switch (type) {
            case "price_asc":
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case "popular":
                sortedProducts.sort((a, b) => b.rating - a.rating);
                break;
            case "newest":
                sortedProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            default:
                sortedProducts = [...products];
        }

        onFilter(sortedProducts);
    };

    return (
        <div className="mx-auto mb-6 max-w-7xl rounded-lg p-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-4">
                <h1 className="text-xl font-bold text-black">Sắp xếp theo:</h1>

                <Link
                    to="/"
                    onClick={() => handleSortChange("popular")}
                    className={`sort flex items-center justify-center rounded-md bg-slate-200 px-4 py-2 text-black ${
                        sortBy === "popular" ? "sort-by-active bg-red-100 text-red-600" : " "
                    }`}
                >
                    Bán chạy nhất
                </Link>

                <Link
                    to="/"
                    onClick={() => handleSortChange("newest")}
                    className={`sort flex items-center justify-center rounded-md bg-slate-200 px-4 py-2 text-black ${sortBy === "newest" ? "sort-by-active bg-red-100 text-red-600" : ""}`}
                >
                    Mới nhất
                </Link>
                <Link
                    to="/"
                    onClick={() => handleSortChange("price_asc")}
                    className={`sort flex items-center justify-center rounded-md bg-slate-200 px-4 py-2 text-black ${
                        sortBy === "price_asc" ? "sort-by-active bg-red-100 text-red-600" : " "
                    }`}
                >
                    <FaArrowUpShortWide className="mr-2" />
                    <span> Giá thấp đến cao</span>
                </Link>

                <Link
                    to="/"
                    onClick={() => handleSortChange("price_desc")}
                    className={`sort flex items-center justify-center rounded-md bg-slate-200 px-4 py-2 text-black${
                        sortBy === "price_desc" ? "sort-by-active bg-red-100 text-red-600" : ""
                    }`}
                >
                    <FaArrowDownWideShort className="mr-2" />
                    <span>Giá cao đến thấp</span>
                </Link>
            </div>
        </div>
    );
};

export default ProductFilters;