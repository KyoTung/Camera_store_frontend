import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../../contexts/cart";
import { useStateContext } from "../../contexts/contextProvider";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "./../../axios-client";
import { ToastContainer, toast } from "react-toastify";

const Checkout = ({ total }) => {
    const { user } = useStateContext();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: user.name || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
        city: "",
        district: "",
        commune: "",
        payment_method: "",
    });

    const { cartData, subTotal, grandTotal, clearCart } = useContext(CartContext);
    const [errors, setErrors] = useState({});
    const { shipping, discount } = useParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Get user information
    if (user) {
        useEffect(() => {
            axiosClient.get("/user").then(({ data }) => {
                setUser(data);
            });
        }, []);
    }

    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) newErrors.name = "Please enter your name";
        if (!emailRegex.test(formData.email)) newErrors.email = "Invalid email";
        if (!formData.phone.trim()) newErrors.phone = "Please enter your phone number";
        if (!formData.address.trim()) newErrors.address = "Please enter your address";
        if (!formData.city.trim()) newErrors.city = "Please enter your city";
        if (!formData.district.trim()) newErrors.district = "Please enter your district";
        if (!formData.commune.trim()) newErrors.commune = "Please enter your commune";
        if (!formData.payment_method.trim()) newErrors.payment_method = "Please select a payment method";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newFormData = {
            ...formData,
            user_id: user.id,
            sub_total: subTotal,
            grand_total: grandTotal(),
            discount: discount,
            shipping: shipping,
            payment_status: formData.payment_method === "bank" ? "paid" : "not paid", // Simulate: When payment is successful, the payment gateway will callback and update to paid.
            status: "pending",
            cart: cartData,
        };
        if (!validateForm()) return;
        try {
            const response = await axiosClient.post("/save-order", newFormData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status === 200) {
                toast.success(response.data.message || "Payment successful");
                localStorage.removeItem("cart");
                clearCart();
                setTimeout(() => {
                    navigate(`/order-confirmation/${response.data.order_id}`);
                }, 1200);
            }
        } catch (error) {
            const msg = error?.response?.data?.message || "Payment error";
            toast.error(msg);
        }
    };
    return (
        <div className="container mx-auto min-h-screen px-4 py-8">
            <ToastContainer />
            <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Payment form */}
                    <div className="lg:col-span-2">
                        {/* Personal Info */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold">Personal Information</h2>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Full Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full rounded border px-3 py-2 ${errors.name ? "border-red-500" : ""}`}
                                    />
                                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Email *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className={`w-full rounded border px-3 py-2 ${errors.email ? "border-red-500" : ""}`}
                                    />
                                    {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Phone Number *</label>
                                    <input
                                        type="number"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className={`w-full rounded border px-3 py-2 ${errors.phone ? "border-red-500" : ""}`}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <h2 className="mb-4 text-xl font-semibold">Shipping Address</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Address *</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`w-full rounded border px-3 py-2 ${errors.address ? "border-red-500" : ""}`}
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                                </div>

                                <div className="flex justify-between">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">City *</label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full rounded border px-3 py-2 ${errors.city ? "border-red-500" : ""}`}
                                        />
                                        {errors.city && <p className="mt-1 text-sm text-red-500">{errors.city}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">District *</label>
                                        <input
                                            type="text"
                                            name="district"
                                            value={formData.district}
                                            onChange={handleInputChange}
                                            className={`w-full rounded border px-3 py-2 ${errors.district ? "border-red-500" : ""}`}
                                        />
                                        {errors.district && <p className="mt-1 text-sm text-red-500">{errors.district}</p>}
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium">Commune *</label>
                                        <input
                                            type="text"
                                            name="commune"
                                            value={formData.commune}
                                            onChange={handleInputChange}
                                            className={`w-full rounded border px-3 py-2 ${errors.commune ? "border-red-500" : ""}`}
                                        />
                                        {errors.commune && <p className="mt-1 text-sm text-red-500">{errors.commune}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="sticky top-8 h-fit rounded-lg bg-gray-50 p-6">
                        <h2 className="mb-4 text-xl font-bold">Your Order</h2>
                        <div className="space-y-4">
                            {cartData &&
                                cartData.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {item.qty} x {item.price.toLocaleString()}₫
                                            </p>
                                        </div>
                                        <p className="font-medium">{(item.price * item.qty).toLocaleString()}₫</p>
                                    </div>
                                ))}

                            <div className="space-y-2 border-t pt-4">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span>{subTotal?.toLocaleString()}₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Discount:</span>
                                    <span className="text-red-500">-{(discount * subTotal)?.toLocaleString()}₫</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping Fee:</span>
                                    <span className="text-red-500">{shipping?.toLocaleString()}₫</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-green-600">{grandTotal()?.toLocaleString()}₫</span>
                                </div>
                            </div>

                            <div>
                                <p className="mb-1 block text-lg font-bold">Payment Method</p>

                                <div className="mb-2 flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="bankTransfer"
                                        name="payment_method"
                                        value="bank"
                                        onChange={handleInputChange}
                                        checked={formData.payment_method === "bank"}
                                        className={`h-4 w-4 ${errors.paymentMethod ? "border-red-500" : ""}`}
                                    />

                                    <label
                                        htmlFor="bankTransfer"
                                        className="cursor-pointer"
                                    >
                                        Bank Transfer
                                    </label>
                                    {errors.payment_method && <p className="mt-1 text-sm text-red-500">{errors.payment_method}</p>}
                                </div>
                                <span>Make payment directly to our bank account.</span>
                                <span className="font-bold">
                                    Please enter your order code in the payment note and your name in the transfer note.
                                    <br />
                                    <span> (Example: 4 John Doe) </span>
                                </span>
                                <span> Order will be shipped after payment is confirmed.</span>
                                <br />
                                <br />
                                <span>Vietinbank: 1929429924924 - P T C</span>
                                <div className="mt-5 flex items-center gap-2">
                                    <input
                                        type="radio"
                                        id="cod"
                                        name="payment_method"
                                        value="cod"
                                        onChange={handleInputChange}
                                        checked={formData.payment_method === "cod"}
                                        className={`h-4 w-4 ${errors.paymentMethod ? "border-red-500" : ""}`}
                                    />

                                    <label
                                        htmlFor="cod"
                                        className="cursor-pointer"
                                    >
                                        Cash on Delivery
                                    </label>
                                    {errors.payment_method && <p className="mt-1 text-sm text-red-500">{errors.payment_method}</p>}
                                </div>

                                {errors.paymentMethod && <p className="mt-1 text-sm text-red-500">{errors.paymentMethod}</p>}
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="mt-5 w-full rounded-lg bg-green-600 py-3 text-white transition-colors hover:bg-green-700"
                        >
                            Confirm Payment
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Checkout;
