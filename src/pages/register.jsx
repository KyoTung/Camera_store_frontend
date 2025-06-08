import React, { useState, useRef } from "react";
import { EyeOff, Eye } from "lucide-react";
import axiosClient from "./../axios-client";
import { useStateContext } from "../contexts/contextProvider";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const { setUser, setToken } = useStateContext();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if(passwordRef === confirmPasswordRef){
        // }
        const payLoad = {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: confirmPasswordRef.current.value,
            address: " ",
            phone: " ",
        };
        console.log(payLoad);

        try {
            const response = await axiosClient.post("/register", payLoad);
            const data = response.data;

            setUser(data.user);
            setToken(data.access_token);
            const shouldLogin = window.confirm("Registration successful. Do you want to log in now?");
            if (shouldLogin) {
                //navigate("/login", { replace: true });
                navigate("/", { replace: true });
            }
        } catch (err) {
            // Nếu là lỗi xác thực (422) thì err.response.data là 1 object các lỗi
            if (err.response && err.response.status === 422) {
                setError(err.response.data);
            } else if (err.response && err.response.data.error) {
                setError({ general: err.response.data.error });
            } else {
                setError({ general: "Register failed. Please try again." });
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
            >
                <h2 className="mb-10 text-center text-3xl font-bold text-gray-800">Register</h2>
                {error && typeof error === "object" && (
                    <ul className="mb-4 text-center text-red-500">
                        {Object.entries(error).map(([field, message], idx) =>
                            Array.isArray(message) ? message.map((msg, i) => <li key={field + i}>{msg}</li>) : <li key={field + idx}>{message}</li>,
                        )}
                    </ul>
                )}
                <div className="mb-4">
                    <label className="mb-2 block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        //value={user.name}
                        // onChange={handleChange}
                        ref={nameRef}
                        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        // value={user.email}
                        //onChange={handleChange}
                        ref={emailRef}
                        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            // value={user.password}
                            //onChange={handleChange}
                            ref={passwordRef}
                            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                </div>
                <div className="mb-4">
                    <label className="mb-2 block text-gray-700">Confirm Password</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            //  value={user.password_confirmation}
                            //  onChange={handleChange}
                            ref={confirmPasswordRef}
                            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full rounded-lg bg-green-500 py-2 text-white transition duration-300 hover:bg-green-600"
                >
                    Register
                </button>
            </form>
        </div>
    );
};

export default RegisterForm;
