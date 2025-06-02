import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../axios-client";
import { FaTimes } from "react-icons/fa";

const SidebarModal = ({ show, onClose }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (show) {
            setLoading(true);
            axiosClient
                .get("/all-categories")
                .then(({ data }) => {
                    setCategories(data.data);
                    setLoading(false);
                })
                .catch(() => setLoading(false));
        }
    }, [show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 ml-10 flex rounded">
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black opacity-40"
                onClick={onClose}
            />
            {/* Content */}
            <div className="animate-slideInLeft relative z-10 mt-8 max-h-[80vh] w-56 max-w-full self-start overflow-y-auto rounded-r-lg bg-white p-2 shadow-lg">
                <button
                    className="absolute right-2 top-2"
                    onClick={onClose}
                >
                    <FaTimes size={24} />
                </button>
                <h2 className="mb-4 mt-2 text-lg font-bold">Categories</h2>
                <ul className="space-y-2">
                    {loading ? (
                        <span>Loading...</span>
                    ) : (
                        categories.map((c) => (
                            <li key={c.id}>
                                <Link
                                    to={`/product-category/${c.id}`}
                                    className="block p-2 text-gray-700 hover:text-red-600"
                                    onClick={onClose}
                                >
                                    {c.name}
                                </Link>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
};

export default SidebarModal;
