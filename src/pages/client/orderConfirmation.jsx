import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "./../../axios-client";

const OrderConfirmation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [items, setTtems] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        getOrder();
    }, []);

    const getOrder = () => {
        setLoading(true);
        axiosClient
            .get(`/order-confirmation/${id}`)
            .then(({ data }) => {
                setOrder(data.data);
                setTtems(data.data.items);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setError("Failed to load order details");
            });
    };

    if (loading) {
        return <div className="py-8 text-center">Loading order details...</div>;
    }

    if (error) {
        return (
            <div className="mx-auto max-w-4xl p-4">
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-100 p-4">
                    <p className="text-red-600">{error}</p>
                </div>
                <Link
                    to="/"
                    className="text-blue-500 hover:underline"
                >
                    Back to home
                </Link>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-4xl p-4">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="mb-2 text-2xl font-bold">Order placed successfully!</h1>
                <p className="text-gray-600">Thank you for shopping with us.</p>
            </div>

            {/* Order Summary */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold">Order Information</h2>

                <div className="mb-6 grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Order ID</p>
                        <p className="font-medium">{order.id}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Order Date</p>
                        <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Payment Status</p>
                        <p className={`font-medium ${order.payment_status === "paid" ? "text-green-500" : "text-yellow-500"}`}>
                            {order.payment_status === "paid" ? "Paid" : "Pending"}
                        </p>
                    </div>
                    <div>
                        <p className="text-gray-600">Payment Method</p>
                        <p className="font-medium">{order.payment_method === "bank" ? "Bank Transfer" : "Cash on Delivery"}</p>
                    </div>
                </div>

                {/* Order Items */}
                <div className="border-t pt-4">
                    <h3 className="mb-4 text-lg font-semibold">Product Details</h3>
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center gap-4 border-b py-3"
                        >
                            {/* <img
                                src={item.image_url}
                                alt={item.name}
                                className="h-16 w-16 rounded object-cover"
                            /> */}
                            <div className="flex-1">
                                <p className="font-medium">{item.product.name}</p>
                                <p className="text-gray-600">Quantity: {item.qty}</p>
                                <p className="text-gray-600"> {item.unit_price.toLocaleString()}₫ / 1</p>
                            </div>
                            <p className="font-medium">{(item.unit_price * item.qty).toLocaleString()}₫</p>
                        </div>
                    ))}
                </div>

                {/* Order Totals */}
                <div className="pt-6">
                    <div className="mb-2 flex justify-between">
                        <span>Subtotal:</span>
                        <span>{order.sub_total.toLocaleString()}₫</span>
                    </div>
                    <div className="mb-2 flex justify-between">
                        <span>Discount:</span>
                        <span className="text-red-500">-{(order.discount * order.sub_total).toLocaleString()}₫</span>
                    </div>
                    <div className="mb-2 flex justify-between">
                        <span>Shipping:</span>
                        <span>{order.shipping.toLocaleString()}₫</span>
                    </div>
                    <div className="flex justify-between border-t pt-3 font-bold">
                        <span>Total:</span>
                        <span>{order.grand_total.toLocaleString()}₫</span>
                    </div>
                </div>
            </div>

            {/* Customer Info */}
            <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
                <h2 className="mb-4 text-xl font-semibold">Customer Information</h2>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-gray-600">Full Name</p>
                        <p className="font-medium">{order.name}</p>
                    </div>
                    <div>
                        <p className="text-gray-600">Phone Number</p>
                        <p className="font-medium">{order.phone}</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-gray-600">Shipping Address</p>
                        <p className="font-medium">{order.address}</p>
                    </div>
                </div>
            </div>

            <div className="text-center">
                <Link
                    to="/"
                    className="inline-block rounded bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
