import React, { useState, useEffect } from "react";
import axiosClient from "./../../axios-client";
import { toast, ToastContainer } from "react-toastify";
import { useParams, Link, useNavigate } from "react-router-dom";
import Loading from "../../compoments/Loading";

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch order history
    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            const response = await axiosClient.get(`/order-history/${id}`);
            setOrders(response.data.data);
            setLoading(false);
        } catch (error) {
            toast.error("Failed to load order history");
            setLoading(false);
        }
    };

    // Cancel order
    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Are you sure you want to cancel this order?")) {
            try {
                await axiosClient.put(`/cancel-order/${orderId}`);
                setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "cancelled" } : order)));
                toast.success("Order cancelled successfully");
            } catch (error) {
                toast.error("Failed to cancel order");
            }
        }
    };

    // Mark as shipped (received)
    const handleShippedOrder = async (orderId) => {
        try {
            await axiosClient.put(`/shipped-order/${orderId}`);
            setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "shipped" } : order)));
            toast.success("Order status updated successfully");
        } catch (error) {
            toast.error("Failed to update order status");
        }
    };

    // Refund order
    const handleRefundedOrder = async (orderId) => {
        try {
            await axiosClient.put(`/refunded-order/${orderId}`);
            setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: "refunded" } : order)));
            toast.success("Order refunded successfully");
        } catch (error) {
            toast.error("Failed to refund order");
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    // Format date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        });
    };

    // Render order status
    const renderStatus = (status) => {
        const statusStyles = {
            pending: "bg-yellow-600 text-white",
            processing: "bg-cyan-600 text-white",
            shipped: "bg-blue-600 text-white",
            delivered: "bg-teal-600 text-white",
            completed: "bg-green-600 text-white ",
            cancelled: "bg-red-600 text-white",
            refunded: "bg-orange-600 text-white",
        };

        const statusText = {
            pending: "Pending",
            processing: "Confirmed",
            shipped: "Shipping",
            delivered: "Delivered",
            completed: "Completed",
            cancelled: "Cancelled",
            refunded: "Refunded",
        };

        return <span className={`rounded px-2 py-1 text-sm ${statusStyles[status]}`}>{statusText[status]}</span>;
    };

    if (loading) {
        return (
            <div className="py-8 text-center">
                Loading...
                <Loading />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-6 text-center text-2xl font-bold">Order History</h1>

            {orders.length === 0 ? (
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
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div
                            onClick={() => navigate(`/detail-order/${order.id}`)}
                            key={order.id}
                            className="rounded-lg border bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-2xl"
                        >
                            <div className="mb-2 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                                <div className="mb-2 sm:mb-0">
                                    <p className="font-semibold">Order ID: {order.id}</p>
                                    <p className="text-sm text-gray-600">Order date: {formatDate(order.created_at)}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    {renderStatus(order.status)}
                                    <p className="font-semibold">Total: {order.grand_total.toLocaleString()}₫</p>
                                </div>
                            </div>

                            <div className="mt-2 border-t pt-2">
                                <p className="mb-2 text-sm font-medium">Products:</p>
                                <div className="grid gap-2">
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center"
                                        >
                                            <img
                                                src={item.product.image_url}
                                                alt={item.name}
                                                className="mr-2 h-12 w-12 rounded object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">Quantity: {item.qty}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {order.status === "pending" ? (
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCancelOrder(order.id);
                                        }}
                                        className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            ) : order.status === "delivered" ? (
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleShippedOrder(order.id);
                                        }}
                                        className="rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600"
                                    >
                                        Mark as Received
                                    </button>
                                </div>
                            ) : order.status === "completed" ? (
                                <div className="mt-4 text-right">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRefundedOrder(order.id);
                                        }}
                                        className="rounded bg-orange-600 px-4 py-2 text-white hover:bg-orange-700"
                                    >
                                        Refund
                                    </button>
                                </div>
                            ) : (
                                <span></span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
