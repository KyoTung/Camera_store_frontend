import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../layouts/client/sidebar";
import SlideShow from "../../layouts/client/slide";
import Brands from "../../layouts/client/brands";
import FeaturedProducts from "./featuredProducts";
import axiosClient from "../../axios-client";
import Loading from "../../compoments/Loading";
import { FaStar } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import "../../index.css";
import { CartContext } from "../../contexts/cart";

const AllProduct = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleProducts, setVisibleProducts] = useState(10); // Default to show 10 products (4 rows)
    const [originalProducts, setOriginalProducts] = useState([]); // Store original product list
    const [sortBy, setSortBy] = useState("newest");

    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = () => {
        setLoading(true);
        axiosClient
            .get("all-products")
            .then(({ data }) => {
                setOriginalProducts(data.data); // Save the original list
                setProducts(data.data);
                setVisibleProducts(10);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const loadMoreProducts = () => {
        setVisibleProducts((prev) => prev + 20); // Show 20 more products when clicking
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);

        // Copy the original array to work with
        let sortedProducts = [...originalProducts];

        switch (value) {
            case "price_asc":
                sortedProducts.sort((a, b) => a.price - b.price);
                break;
            case "price_desc":
                sortedProducts.sort((a, b) => b.price - a.price);
                break;
            case "newest":
            default:
                sortedProducts = [...originalProducts]; // Keep the original order
                break;
        }

        setProducts(sortedProducts);
    };

    const handleAddToCart = () => {
        addToCart(product);
        toast.success("Product added to cart successfully");
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loading className="h-12 w-12" />
            </div>
        );
    }
    return (
        <div>
            <div className="mx-auto max-w-7xl p-4">
                <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="text-xl font-bold">Sort by:</span>
                        <select
                            onChange={handleSortChange}
                            value={sortBy}
                            className="rounded border p-2"
                        >
                            <option value="newest">Newest</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {products.slice(0, visibleProducts).map((product) => (
                        <Link
                            to={`/product-detail/${product.id}`}
                            className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-sm transition-all hover:shadow-lg"
                            key={product.id}
                        >
                            <div className="flex flex-col">
                                <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="product-image"
                                    style={{
                                        aspectRatio: "1 / 1.2",
                                        overflowClipMargin: "content-box",
                                    }}
                                />
                                <div className="">
                                    <h2 className="mb-6 line-clamp-2 text-lg font-bold text-zinc-700">{product.name}</h2>

                                    <div className="mt-4 flex items-center justify-between">
                                        <p className="text-xl font-semibold text-red-600">{product.price.toLocaleString()}₫</p>
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <FaStar
                                                    key={i}
                                                    className="h-4 w-4 text-yellow-500"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {products.length > visibleProducts && (
                    <div className="mt-8 flex items-center justify-center text-center">
                        <button
                            onClick={loadMoreProducts}
                            className="flex items-center justify-center rounded bg-red-600 px-6 py-3 font-medium text-white hover:bg-red-700"
                        >
                            <FaChevronDown className="mr-4" />
                            <p> Show more products</p>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllProduct;
