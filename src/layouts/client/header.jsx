import { useState, useEffect, useRef, useContext } from "react";
import { FiShoppingCart, FiUser, FiSearch, FiX } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useStateContext } from "../../contexts/contextProvider";
import axiosClient from "../../axios-client";
import { CartContext } from "../../contexts/cart";
import Search from "./search";
import SearchMobile from "./searchMobile";
import "../../styles/base.css";
import "../../styles/header.css";
import SidebarModal from "./sidebar";
import { useClickOutside } from "../../hooks/use-click-outside";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Header = () => {
    const navigate = useNavigate();
    const { totalQuantity } = useContext(CartContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showSidebarModal, setShowSidebarModal] = useState(false);
    const menuRef = useRef(null);
    const modalRef = useRef(null);
    const showAccountRef = useRef(null);
    const { user, token, setToken, setUser } = useStateContext();
    const [showAccountModal, setShowAccountModal] = useState(false);
    const [editData, setEditData] = useState({
        id: "",
        email: "",
        name: "",
        phone: "",
        address: "",
    });
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data } = await axiosClient.get("/user");
                setUser(data);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        if (token) fetchUser();
    }, [setUser, token]);

    const handleLogout = async () => {
        try {
            await axiosClient.post("/logout");
            setUser(null);
            setToken(null);
            toast.success("Logout successfully!", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setUser(null);
                setToken(null);
                toast.info("Logout successfully!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                setTimeout(() => {
                    navigate("/");
                }, 2000);
            } else {
                toast.error("Logout faild!", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "colored",
                });
                console.error("Logout failed:", error);
            }
        }
    };

    const fetchUserData = async () => {
        try {
            const { data } = await axiosClient.get("/user");
            setUser(data);
            setEditData({
                name: data.name,
                phone: data.phone || "",
                address: data.address || "",
            });
        } catch (error) {
            console.error("Error fetching user:", error);
        }
    };

    // Fetch user data khi mở modal
    useEffect(() => {
        if (showAccountModal && user) {
            setEditData({
                id: user.id,
                email: user.email,
                name: user.name,
                phone: user.phone || "",
                address: user.address || "",
            });
        }
    }, [showAccountModal, user]);

    // Xử lý cập nhật thông tin
    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const response = await axiosClient.put(`update-user/${user.id}`, editData);
            setUser(response.data.data);
            setMessage("Update successfully!");
            setTimeout(() => setMessage(""), 3000);
            setIsEditing(false);
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value,
        });
    };

    useClickOutside([modalRef], () => {
        setIsMenuOpen(false);
    });
    useClickOutside([showAccountRef], () => {
        setShowAccountModal(false);
    });

    return (
        <header className="header-bg-color sticky top-0 z-50 shadow-md">
            <ToastContainer />
            {/* Top Navigation */}
            <div className="py-2 text-white shadow-sm">
                <nav className="container relative mx-auto flex flex-wrap items-center justify-between px-4 md:flex-row md:px-1">
                    <ul className="flex gap-4">
                        <li>
                            <Link
                                to="/"
                                className="hover:bg-opacity-80"
                            >
                                Home
                            </Link>
                        </li>
                        <li className="">
                            {/* Nút Danh mục chỉ hiện trên mobile */}
                            <button
                                className="font-medium text-white"
                                onClick={() => setShowSidebarModal(true)}
                            >
                                Categories
                            </button>
                        </li>

                        <li>
                            <Link
                                to="#brands"
                                className=""
                            >
                                Brands
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="#contact"
                                className=""
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>

                    {/* User Section */}
                    <div className="flex items-center">
                        {user ? (
                            <div
                                className="relative"
                                ref={menuRef}
                            >
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center"
                                    aria-label="User menu"
                                >
                                    <FiUser className="h-6 w-6" />
                                    <span className="ml-2">{user.name}</span>
                                </button>

                                {isMenuOpen && (
                                    <div
                                        ref={modalRef}
                                        className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5"
                                    >
                                        <Link
                                            to="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setShowAccountModal(true);
                                            }}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My account
                                        </Link>
                                        <Link
                                            to={`/order-history/${user.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Order
                                        </Link>
                                        {(user.role === 1 || user.role === 2) && (
                                            <Link
                                                to="/admin"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Access admin page
                                            </Link>
                                        )}
                                        <div className="mt-2 border-t">
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                <FiUser className="mr-2 h-4 w-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    to="/register"
                                    className="rounded-md px-3 py-2 text-sm font-medium"
                                >
                                    Sign Up
                                </Link>
                                <Link
                                    to="/login"
                                    className="rounded-md px-3 py-2 text-sm font-medium"
                                >
                                    Login
                                </Link>
                            </div>
                        )}
                    </div>
                </nav>
            </div>

            {/* Main Header */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="container mx-auto flex items-center justify-between px-2 py-4 md:py-2">
                    {/* Logo */}
                    <Link
                        to="/"
                        className="text-2xl font-bold text-white"
                    >
                        Nest Store
                    </Link>

                    {/* Desktop Search */}
                    <Search />

                    {/* Cart */}
                    <div className="flex items-center space-x-6">
                        <Link
                            to="/cart"
                            className="relative"
                        >
                            <FiShoppingCart className="h-6 w-6 text-white" />
                            {totalQuantity > 0 ? (
                                <span className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 text-xs text-red-600">
                                    {totalQuantity}
                                </span>
                            ) : (
                                <span className="absolute -right-2 -top-2 rounded-full bg-white px-2 py-1 text-xs text-red-600">0</span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Mobile Search */}
                <SearchMobile />
            </div>
            {/* Modal tài khoản */}
            {showAccountModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div
                        className="relative w-full max-w-md rounded-lg bg-white p-6"
                        ref={showAccountRef}
                    >
                        <button
                            onClick={() => setShowAccountModal(false)}
                            className="absolute right-2 top-2 p-1 hover:text-gray-600"
                        >
                            <FiX className="h-6 w-6" />
                        </button>

                        <h2 className="mb-4 text-2xl font-bold">Account information</h2>

                        <form onSubmit={handleUpdateInfo}>
                            <div className="space-y-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium">Full name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={editData.name || ""}
                                        onChange={handleInputChange}
                                        className="w-full rounded border p-2"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Email</label>
                                    <input
                                        type="email"
                                        value={user?.email}
                                        className="w-full rounded border bg-gray-100 p-2"
                                        disabled
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Phone number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={editData.phone || ""}
                                        onChange={handleInputChange}
                                        className="w-full rounded border p-2"
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div>
                                    <label className="mb-1 block text-sm font-medium">Address</label>
                                    <textarea
                                        name="address"
                                        value={editData.address || ""}
                                        onChange={handleInputChange}
                                        className="w-full rounded border p-2"
                                        disabled={!isEditing}
                                        rows="3"
                                    />
                                </div>

                                {message && (
                                    <div className={`rounded p-2 ${message.includes("thành công") ? "bg-green-100" : "bg-red-100"}`}>{message}</div>
                                )}

                                <div className="flex justify-end gap-2">
                                    {isEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => setIsEditing(false)}
                                                className="rounded bg-gray-200 px-4 py-2 text-sm"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
                                                disabled={loading}
                                            >
                                                {loading ? "Đang lưu..." : "Lưu thay đổi"}
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(true)}
                                            className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <SidebarModal
                show={showSidebarModal}
                onClose={() => setShowSidebarModal(false)}
            />
        </header>
    );
};

export default Header;
