import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";
import { FaStar } from "react-icons/fa";
import "../../index.css";

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getProducts = () => {
            setLoading(true);
            axiosClient
                .get("/featured-products")
                .then(({ data }) => {
                    setProducts(data.data);
                    setLoading(false);
                })
                .catch(() => {
                    setLoading(false);
                });
        };

        getProducts();
    }, []);

    if (loading) {
        return <div className="py-8 text-center">Loading products...</div>;
    }

    return (
        <div className="mx-auto mt-6 w-full max-w-[1800px] rounded-md bg-red-500 p-4">
            <h1 className="mb-8 text-center text-3xl font-bold text-white">Featured Products</h1>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {products.map((product) => (
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
        </div>
    );
};

export default FeaturedProducts;
