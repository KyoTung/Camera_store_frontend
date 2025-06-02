import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import Loading from "../../compoments/Loading";
import { FaStar, FaChevronDown } from "react-icons/fa";
import "../../index.css";

const ProductBrand = () => {
    const { id } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visibleProducts, setVisibleProducts] = useState(10);
    const [brand, setBrand] = useState([]);
    const [sortBy, setSortBy] = useState("newest");
    const [originalProducts, setOriginalProducts] = useState([]); // Store original product list

    useEffect(() => {
        getBrand();
        getProducts();
    }, [id]); // Reload products when brand changes

    const getBrand = () => {
        setLoading(true);
        axiosClient
            .get(`/get-brand/${id}`)
            .then(({ data }) => {
                setBrand(data.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const getProducts = () => {
        setLoading(true);
        axiosClient
            .get(`/brand-product/${id}`)
            .then(({ data }) => {
                setOriginalProducts(data.data); // Save original list
                setProducts(data.data);
                setVisibleProducts(10);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    const loadMoreProducts = () => {
        setVisibleProducts((prev) => prev + 20);
    };

    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortBy(value);

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
                sortedProducts = [...originalProducts]; // Keep original order
                break;
        }

        setProducts(sortedProducts);
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
                <div className="mb-8">
                    <h1 className="mb-10 mt-8 text-center text-3xl font-bold uppercase">Products: {brand.name}</h1>
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
                {products.length === 0 ? (
                    <div className="-mt-10 flex items-center justify-center">
                        <img
                            className="text-center"
                            src="https://xe2banh.com.vn/img/no-products.png"
                            alt="No products"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {products.slice(0, visibleProducts).map((product) => (
                            <div
                                key={product.id}
                                className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-2 shadow-sm transition-all hover:shadow-lg"
                            >
                                <div className="flex flex-col">
                                    <Link to={`/product-detail/${product.id}`}>
                                        <div className="flex items-center justify-center text-center">
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="product-image"
                                                style={{
                                                    aspectRatio: "1 / 1.2",
                                                    overflowClipMargin: "content-box",
                                                }}
                                            />
                                        </div>

                                        <div className="p-3">
                                            <h4 className="mb-2 line-clamp-2 text-sm font-medium text-gray-800">{product.name}</h4>

                                            <div className="mb-2 flex flex-wrap gap-1">{/* Optional: product specs */}</div>

                                            <div className="flex items-end justify-between">
                                                <p className="text-lg font-bold text-red-600">{product.price.toLocaleString()}₫</p>
                                            </div>

                                            <div className="mt-2 flex items-center justify-between">
                                                <div className="flex">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar
                                                            key={i}
                                                            className="h-4 w-4 text-yellow-500"
                                                        />
                                                    ))}
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500">In stock: {product.quantity}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {products.length > visibleProducts && (
                    <div className="mt-8 text-center">
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

export default ProductBrand;
