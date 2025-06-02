import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../contexts/cart";
import { RiDeleteBinLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/contextProvider";
import { ToastContainer, toast } from "react-toastify";
import axiosClient from "../../axios-client";

const Cart = () => {
    const { user } = useStateContext();
    const { cartData, removeFromCart, updateQuantity, subTotal, grandTotal } = useContext(CartContext);
    const [discountCodes, setDiscountCodes] = useState([]);
    const [discountCode, setDiscountCode] = useState("");
    const [discount, setDiscount] = useState(0);
    const [shipping, setShipping] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    // Handle discount codes
    useEffect(() => {
        getDiscountCode();
    }, []);

    const getDiscountCode = () => {
        axiosClient
            .get("/all-discount-code")
            .then(({ data }) => {
                setDiscountCodes(data.data || []);
            })
            .catch(() => {});
    };

    const applyDiscount = () => {
        const today = new Date();
        const found = discountCodes.find((dc) => {
            const start = new Date(dc.start_date);
            const end = new Date(dc.end_date);
            return dc.name === discountCode && today >= start && today <= end;
        });
        if (found) {
            setDiscount(found.value);
            setErrorMessage("");
            toast.success("Discount code applied successfully!");
        } else {
            setDiscount(0);
            setErrorMessage("Invalid or expired discount code");
        }
    };

    // Increase quantity
    const handleIncrease = (cartItemId) => {
        const currentItem = cartData.find((item) => item.id === cartItemId);
        if (currentItem) {
            updateQuantity(cartItemId, currentItem.qty + 1);
        }
    };

    // Decrease quantity
    const handleDecrease = (cartItemId) => {
        const currentItem = cartData.find((item) => item.id === cartItemId);
        if (currentItem && currentItem.qty > 1) {
            updateQuantity(cartItemId, currentItem.qty - 1);
        }
    };

    // Manual quantity update
    const handleQuantityChange = (cartItemId, newQuantity) => {
        const parsedQuantity = parseInt(newQuantity);
        if (!isNaN(parsedQuantity) && parsedQuantity >= 1) {
            updateQuantity(cartItemId, parsedQuantity);
        }
    };

    // Remove product
    const handleRemove = (productId) => {
        removeFromCart(productId);
    };

    const handleCheckout = () => {
        if (!user) {
            setTimeout(() => {
                toast.info("Please login to pay");
                navigate("/login");
            }, 1200);
        }
        navigate(`/checkout/${shipping}/${discount}`);
    };
    return (
        <div className="container mx-auto min-h-screen px-4 py-8">
            <ToastContainer />
            <h1 className="mb-8 text-center text-3xl font-bold">Shopping Cart</h1>

            {cartData.length === 0 ? (
                <div className="text-center">
                    <p className="mb-4 text-gray-600">Your cart is empty</p>
                    <img
                        className="mx-auto"
                        src="../../../src/assets/cart_null.png"
                    />
                    <Link
                        to="/"
                        className="text-blue-500 hover:underline"
                    >
                        Back to shopping
                    </Link>
                </div>
            ) : (
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Product list */}
                    <div className="space-y-4 lg:col-span-2">
                        {cartData.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center gap-4 rounded-lg border p-4"
                            >
                                <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="h-20 w-20 rounded-lg object-cover"
                                />

                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold">{item.name}</h3>
                                    <p className="text-gray-600">{item.price.toLocaleString()}₫</p>
                                </div>

                                {/* Quantity controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleDecrease(item.id)}
                                        className="rounded border px-3 py-1 hover:bg-gray-100"
                                        disabled={item.qty <= 1}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={item.qty}
                                        onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                                        className="w-16 rounded border py-1 text-center"
                                        min="1"
                                    />
                                    <button
                                        onClick={() => handleIncrease(item.id)}
                                        className="rounded border px-3 py-1 hover:bg-gray-100"
                                    >
                                        +
                                    </button>
                                </div>

                                {/* Total and remove button */}
                                <div className="min-w-[120px] text-right">
                                    <p className="font-semibold">{(item.price * item.qty).toLocaleString()}₫</p>
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="mt-1 text-sm text-red-600 hover:text-red-700"
                                    >
                                        <RiDeleteBinLine size="20" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Checkout section */}
                    <div className="sticky top-8 h-fit rounded-lg border-2 bg-gray-50 p-6">
                        <div className="mb-6">
                            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

                            <div className="mb-4">
                                <label className="mb-2 block text-sm font-medium">Discount code (if any)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        className="flex-1 rounded border px-3 py-2"
                                        placeholder="Enter discount code"
                                    />
                                    <button
                                        onClick={applyDiscount}
                                        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {errorMessage && <p className="mt-1 text-sm text-red-500">{errorMessage}</p>}
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{subTotal.toLocaleString()}₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount:</span>
                                    <span>{(subTotal * discount).toLocaleString()}₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping fee:</span>
                                    <span>{shipping.toLocaleString()}₫</span>
                                </div>
                                <div className="flex justify-between border-t pt-3 font-bold">
                                    <span>Total:</span>
                                    <span className="text-xl text-red-500">{grandTotal(discount).toLocaleString()}₫</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="w-full rounded-lg bg-red-700 py-3 text-white transition-colors hover:bg-red-800"
                        >
                            Checkout
                        </button>

                        <Link
                            to="/"
                            className="mt-4 block text-center text-blue-500 hover:underline"
                        >
                            Continue Shopping
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
