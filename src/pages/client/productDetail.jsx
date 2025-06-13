import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../axios-client";
import ProductDescription from "./../../compoments/productDescription";
import { CartContext } from "../../contexts/cart";
import { ToastContainer, toast } from "react-toastify";
import { LiaCartPlusSolid } from "react-icons/lia";
import { useStateContext } from "../../contexts/contextProvider";

const ProductDetail = () => {
    const [product, setProduct] = useState(null);
    const [productImages, setProductImages] = useState([]);
    const [selectedImage, setSelectedImage] = useState("");
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    const { addToCart } = useContext(CartContext);
    const { user } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        getProduct();
    }, [id]);

    const getProduct = async () => {
        try {
            const { data } = await axiosClient.get(`/product-detail/${id}`);
            setProduct(data.data);
            setProductImages(data.data.product_images);
            // Set first image when data is available
            if (data.data.product_images?.length > 0) {
                setSelectedImage(data.data.product_images[0].image_url);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching product:", error);
            setLoading(false);
        }
    };

    const handleAddToCart = () => {
        addToCart(product);
        toast.success("Product added to cart successfully");
    };

    if (loading) {
        return <div className="mt-10 text-center">Loading...</div>;
    }

    if (!product) {
        return <div className="mt-10 text-center">Product not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                {/* Product Images */}
                <div className="w-10/12 space-y-4">
                    {/* Main Image */}
                    <div className="relative aspect-square overflow-hidden rounded-lg">
                        {selectedImage ? (
                            <img
                                src={selectedImage}
                                alt={product.name}
                                className="absolute inset-0 h-full w-full object-contain"
                                loading="lazy"
                                style={{
                                    aspectRatio: "1 / 1",
                                }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gray-200">
                                <span>No image</span>
                            </div>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {productImages.map((productImage) => (
                            <button
                                key={productImage.id}
                                onClick={() => setSelectedImage(productImage.image_url)}
                                className={`h-20 min-w-[80px] rounded border-2 transition-colors ${
                                    selectedImage === productImage.image_url ? "border-blue-500" : "border-gray-200 hover:border-gray-300"
                                }`}
                                style={{ aspectRatio: "1 / 1" }}
                            >
                                <img
                                    src={productImage.image_url}
                                    alt={`Thumbnail ${productImage.id}`}
                                    className="h-full w-full object-contain"
                                    loading="lazy"
                                    style={{ aspectRatio: "1 / 1" }}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="space-y-6">
                    <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                    <div className="text-2xl font-semibold text-red-600">{product.price?.toLocaleString() + "₫" || "Contact"}</div>

                    {/* Specifications */}
                    <div className="mb-10 space-y-3 rounded-md bg-white shadow-md">
                        <h2 className="px-4 pt-4 text-xl font-semibold">Specifications</h2>
                        <div className="px-4 pb-4">
                            <table className="min-w-full table-auto rounded border">
                                <tbody>
                                    {[
                                        { label: "Resolution", value: product.resolution },
                                        { label: "Infrared", value: product.infrared },
                                        { label: "Audio", value: product.sound },
                                        { label: "Smart Function", value: product.smart_function },
                                        { label: "AI Feature", value: product.AI_function },
                                        { label: "Network", value: product.network },
                                        { label: "Other Features", value: product.other_features },
                                    ].map(
                                        (spec, index) =>
                                            spec.value && (
                                                <tr
                                                    key={index}
                                                    className="border-b last:border-b-0"
                                                >
                                                    <td className="w-1/3 bg-gray-50 px-3 py-2 text-gray-600">{spec.label}</td>
                                                    <td className="px-3 py-2 font-medium">{spec.value}</td>
                                                </tr>
                                            ),
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <div className="flex items-center">
                        <button
                            onClick={handleAddToCart}
                            className="flex w-full items-center justify-center rounded-lg bg-red-700 py-3 text-white transition-colors hover:bg-red-800"
                        >
                            <LiaCartPlusSolid className="mr-4 text-white" />
                            Add to Cart
                        </button>
                    </div>

                    <div className="mt-8 flex items-center justify-around border-t-2">
                        <div className="product_more_info_exchange mt-4 flex items-center">
                            <img
                                width={15}
                                className="oZtSFx"
                                src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/2bcf834c40468ebcb90b.svg"
                                alt="15 days free return"
                            />
                            <span>15 days free return</span>
                        </div>
                        <div className="product_more_info_origin mt-4 flex items-center">
                            <img
                                width={15}
                                className="oZtSFx"
                                src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/productdetailspage/511aca04cc3ba9234ab0.png"
                                alt="100% Authentic"
                            />
                            <span>100% Authentic Products</span>
                        </div>
                    </div>
                    {/* Product Description */}
                    <div className="prose max-w-none">
                        <ProductDescription htmlContent={product.description} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
