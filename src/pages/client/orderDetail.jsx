import React, { useEffect, useState } from "react";
import { PencilLine, Trash } from "lucide-react";
import axiosClient from "../.././axios-client";
import { useNavigate, Link, useParams } from "react-router-dom";
import Loading from "../.././compoments/Loading";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DetailOrder = () => {
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [items, setTtems] = useState(null);
    const [product, setProduct] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { id } = useParams();

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    useEffect(() => {
        getOrder();
    }, []);

    const getOrder = () => {
        setIsLoading(true);
        axiosClient
            .get(`/order-confirmation/${id}`)
            .then(({ data }) => {
                setOrder(data.data);
                setTtems(data.data.items);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error("Failed to load order details");
            });
    };
    const getProduct = () => {
        setIsLoading(true);
        axiosClient
            .get(`/products/${id}`)
            .then(({ data }) => {
                setOrder(data.data);
                setTtems(data.data.items);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
                toast.error("Failed to load order details");
            });
    };

    // Cancel order handler
    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await axiosClient.put(`/cancel-order/${orderId}`);
                setOrder({ ...order, status: "cancelled" });
                toast.success("Order cancelled successfully.");
            } catch (error) {
                toast.error("Failed to cancel order.");
            }
        }
    };

    // Mark as shipped handler
    const handleShippedOrder = async (orderId) => {
        try {
            await axiosClient.put(`/shipped-order/${orderId}`);
            setOrder({ ...order, status: "shipped" });
            toast.success("Order status updated successfully.");
        } catch (error) {
            toast.error("Failed to update order status.");
        }
    };

    if (isLoading || !order) {
        return (
            <div className="py-8 text-center">
                Loading...
                <Loading />
            </div>
        );
    }

    return (
        <div>
            <h1 className="mb-6 mt-10 text-center text-2xl font-bold">Order Details</h1>
            {!order ? (
                <div className="text-center">
                    <p className="mb-4">No orders yet</p>
                    <Link
                        to="/products"
                        className="text-blue-500 hover:underline"
                    >
                        Continue Shopping
                    </Link>
                </div>
            ) : (
                <div className="container mx-auto bg-white px-4 py-8">
                    <div className="mb-6 flex justify-start">
                        <button
                            onClick={() => navigate(-1)}
                            className="btn rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
                        >
                            ← Back
                        </button>
                    </div>
                    <ToastContainer />
                    <div className="mx-auto max-w-7xl">
                        <div className="mb-6">
                            <h1 className="mb-2 text-2xl font-bold text-gray-900">Order ID #{order.id}</h1>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>Order Date: {formatDate(order.created_at)}</span>
                            </div>
                        </div>

                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Product List */}
                            <div className="space-y-6">
                                <h2 className="text-lg font-semibold">Product List</h2>
                                <div className="space-y-4">
                                    {items?.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-start gap-4 border-b pb-4"
                                        >
                                            <div className="h-20 w-20 overflow-hidden rounded-lg bg-gray-100">
                                                <img
                                                    src={item.product.image_url || "/placeholder-product.jpg"}
                                                    alt={item.name}
                                                    className="h-full w-full object-contain"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium">Order Name: {item.name}</h3>
                                                <h3 className="font-medium">Product Information</h3>
                                                <div className="mt-1 text-sm text-gray-600">
                                                    <p>{item.product.name}</p>
                                                </div>
                                                <div className="mt-2 flex items-center justify-between">
                                                    <span className="text-gray-600">Quantity: {item.qty}</span>
                                                    <span className="font-medium">{formatPrice(item.unit_price * item.qty)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Customer Information */}
                            <div className="space-y-6 border-l-2 pl-6">
                                <h2 className="text-lg font-semibold">Customer Information</h2>
                                <div className="space-y-4">
                                    <div className="rounded-lg border p-4">
                                        <h3 className="mb-2 font-medium">Contact Details</h3>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>Name: {order.name}</p>
                                            <p>Email: {order.email}</p>
                                            <p>Phone: {order.phone}</p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border p-4">
                                        <h3 className="mb-2 font-medium">Shipping Address</h3>
                                        <div className="space-y-1 text-sm text-gray-600">
                                            <p>{order.address}</p>
                                            <p>
                                                {order.commune}, {order.district}, {order.city}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="rounded-lg border p-4">
                                        <h3 className="mb-2 font-medium">Payment Summary</h3>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span>Subtotal:</span>
                                                <span>{formatPrice(order.sub_total)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Shipping Fee:</span>
                                                <span>{formatPrice(order.shipping)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Discount:</span>
                                                <span>-{formatPrice(order.discount)}</span>
                                            </div>
                                            <div className="flex justify-between border-t pt-2 font-semibold">
                                                <span>Total:</span>
                                                <span>{formatPrice(order.grand_total)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Management */}
                            <div className="space-y-6 border-l-2 pl-6">
                                <h2 className="text-lg font-semibold">Order Management</h2>
                                <div className="space-y-4">
                                    <div className="rounded-lg border p-4">
                                        <div className="flex justify-between">
                                            <h3 className="mb-2 font-medium">Payment Method</h3>
                                            <h3 className="mb-2 font-medium">{order.payment_method}</h3>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="mb-2 font-medium">Order Status</h3>
                                            <span
                                                className={`btn rounded-md p-2 text-white ${
                                                    order.status === "pending"
                                                        ? "bg-yellow-600"
                                                        : order.status === "processing"
                                                          ? "bg-cyan-600"
                                                          : order.status === "shipped"
                                                            ? "bg-blue-600"
                                                            : order.status === "cancelled"
                                                              ? "bg-red-600"
                                                              : order.status === "delivered"
                                                                ? "bg-teal-600"
                                                                : order.status === "completed"
                                                                  ? "bg-green-600"
                                                                  : order.status === "refunded"
                                                                    ? "bg-orange-600"
                                                                    : ""
                                                }`}
                                            >
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="mt-6 flex items-center justify-between">
                                            <h3 className="mb-2 font-medium">Payment Status</h3>
                                            <span
                                                className={`text-nowrap rounded-md px-4 py-2 text-white ${
                                                    order.payment_status === "paid" ? "bg-green-600" : "bg-red-600"
                                                }`}
                                            >
                                                {order.payment_status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {order.status === "pending" || order.status === "processing" ? (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="w-full rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                            >
                                                Cancel Order
                                            </button>
                                        ) : order.status === "delivered" ? (
                                            <button
                                                onClick={() => handleShippedOrder(order.id)}
                                                className="w-full rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                                            >
                                                Mark as Received
                                            </button>
                                        ) : (
                                            <span></span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DetailOrder;
