import React, { useState, useContext } from "react";
import { CartContext } from "../../contexts/cart";
import { useStateContext } from "../../contexts/contextProvider";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "./../../axios-client";
import { ToastContainer, toast } from "react-toastify";

const Checkout = () => {
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
            payment_status: formData.payment_method === "bank" ? "paid" : "not paid",
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
                toast.success("Payment successful");
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
        <div className="min-h-screen bg-gray-50 p-2">
            <ToastContainer />
            <div className="mx-auto max-w-md">
                <h1 className="py-4 text-center text-2xl font-bold text-green-700">Checkout</h1>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* Personal Information */}
                    <div className="rounded-lg bg-white p-4 shadow">
                        <h2 className="mb-3 text-lg font-semibold text-gray-800">Personal Information</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Full Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-lg border p-2 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Your full name"
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
                                    className={`w-full rounded-lg border p-2 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="your@email.com"
                                />
                                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-lg border p-2 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Phone number"
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="rounded-lg bg-white p-4 shadow">
                        <h2 className="mb-3 text-lg font-semibold text-gray-800">Shipping Address</h2>
                        <div className="space-y-3">
                            <div>
                                <label className="mb-1 block text-sm font-medium">Address *</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className={`w-full rounded-lg border p-2 ${errors.address ? "border-red-500" : "border-gray-300"}`}
                                    placeholder="Street address"
                                />
                                {errors.address && <p className="mt-1 text-sm text-red-500">{errors.address}</p>}
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className={`w-full rounded-lg border p-2 ${errors.city ? "border-red-500" : "border-gray-300"}`}
                                        placeholder="City"
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
                                        className={`w-full rounded-lg border p-2 ${errors.district ? "border-red-500" : "border-gray-300"}`}
                                        placeholder="District"
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
                                        className={`w-full rounded-lg border p-2 ${errors.commune ? "border-red-500" : "border-gray-300"}`}
                                        placeholder="Commune"
                                    />
                                    {errors.commune && <p className="mt-1 text-sm text-red-500">{errors.commune}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="rounded-lg bg-white p-4 shadow">
                        <h2 className="mb-3 text-lg font-bold text-gray-800">Your Order</h2>

                        <div className="mb-4 space-y-2">
                            {cartData &&
                                cartData.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between py-1"
                                    >
                                        <div>
                                            <p className="font-medium">{item.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {item.qty} × {item.price.toLocaleString()}₫
                                            </p>
                                        </div>
                                        <p className="font-medium">{(item.price * item.qty).toLocaleString()}₫</p>
                                    </div>
                                ))}
                        </div>

                        <div className="space-y-2 border-t pt-3">
                            <div className="flex justify-between">
                                <span className="text-sm">Subtotal:</span>
                                <span className="text-sm">{subTotal?.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Discount:</span>
                                <span className="text-sm text-red-500">-{(discount * subTotal)?.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-sm">Shipping Fee:</span>
                                <span className="text-sm text-red-500">{shipping?.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between pt-2 text-base font-bold">
                                <span>Total:</span>
                                <span className="text-green-600">{grandTotal()?.toLocaleString()}₫</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div className="rounded-lg bg-white p-4 shadow">
                        <h2 className="mb-3 text-lg font-bold text-gray-800">Payment Method</h2>

                        <div className="space-y-4">
                            <div className="flex items-start">
                                <input
                                    type="radio"
                                    id="bankTransfer"
                                    name="payment_method"
                                    value="bank"
                                    onChange={handleInputChange}
                                    checked={formData.payment_method === "bank"}
                                    className="mr-2 mt-1 h-4 w-4"
                                />
                                <div>
                                    <label
                                        htmlFor="bankTransfer"
                                        className="block font-medium"
                                    >
                                        Bank Transfer
                                    </label>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Make payment directly to our bank account. Please enter your order code in the payment note.
                                        <span className="mt-1 block font-semibold">(Example: 4 John Doe)</span>
                                        <span className="mt-1 block">Vietinbank: 1929429924924 - P T C</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <input
                                    type="radio"
                                    id="cod"
                                    name="payment_method"
                                    value="cod"
                                    onChange={handleInputChange}
                                    checked={formData.payment_method === "cod"}
                                    className="mr-2 mt-1 h-4 w-4"
                                />
                                <div>
                                    <label
                                        htmlFor="cod"
                                        className="block font-medium"
                                    >
                                        Cash on Delivery
                                    </label>
                                    <p className="mt-1 text-sm text-gray-600">Pay when you receive the goods at your doorstep.</p>
                                </div>
                            </div>

                            {errors.payment_method && <p className="mt-1 text-sm text-red-500">{errors.payment_method}</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-green-600 py-3 font-bold text-white shadow-lg transition duration-300 hover:bg-green-700"
                    >
                        Confirm Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
