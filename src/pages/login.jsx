import React, { useState, useRef } from "react";
import { EyeOff, Eye } from "lucide-react";
import axiosClient from "./../axios-client";
import { useStateContext } from "../contexts/contextProvider";
import { useNavigate } from "react-router-dom";
const LoginForm = () => {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef();
    const passwordRef = useRef();
    const [error, setError] = useState("");

    const { setUser, setToken, user, token } = useStateContext();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payLoad = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        console.log(payLoad);
        try {
            const response = await axiosClient.post("/login", payLoad);
            const data = response.data;

            setUser(data.user);
            setToken(data.access_token);

            navigate("/");
        } catch (err) {
            if (err.response && err.response.status === 422) {
                setError(err.response.data);
            } else if (err.response && err.response.data.error) {
                setError({ general: err.response.data.error });
            } else {
                setError({ general: "Login failed. Please try again." });
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
            >
                <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">Login</h2>
                {error && typeof error === "object" && (
                    <ul className="mb-4 text-center text-red-500">
                        {Object.entries(error).map(([field, message], idx) =>
                            Array.isArray(message) ? message.map((msg, i) => <li key={field + i}>{msg}</li>) : <li key={field + idx}>{message}</li>,
                        )}
                    </ul>
                )}
                <div className="mb-4">
                    <label className="mb-2 block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        // value={user.email}
                        // onChange={handleChange}
                        ref={emailRef}
                        className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="mb-2 block text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            //  value={user.password}
                            // onChange={handleChange}
                            ref={passwordRef}
                            className="w-full rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-500 py-2 text-white transition duration-300 hover:bg-blue-600"
                >
                    Login
                </button>
                <p className="mt-4 text-center text-gray-600">
                    Don't have an account?{" "}
                    <a
                        href="/register"
                        className="text-blue-500 hover:underline"
                    >
                        Register
                    </a>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;
