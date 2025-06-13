import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../index.css";

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        getBrands();
    }, []);

    const getBrands = () => {
        setLoading(true);
        axiosClient
            .get("/all-brands")
            .then(({ data }) => {
                setBrands(data.data);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: "smooth" });
                // Thêm class highlight
                element.classList.add("highlight");
                // Sau 1.5s thì xóa class
                setTimeout(() => {
                    element.classList.remove("highlight");
                }, 1500);
            }
        }
    }, [location]);

    if (loading) {
        return <div className="py-8 text-center">Loading...</div>;
    }

    return (
        <div
            id="brands"
            className="pb-6 pt-4"
        >
            <div className="mx-auto flex max-w-7xl justify-start px-4">
                {brands.map((brand, i) => (
                    <Link
                        key={i}
                        to={`/product-brand/${brand.id}`}
                        className="px-4 py-4"
                    >
                        <img
                            src={`/assets/${brand.name}.jpg`}
                            className="h-12 w-24 rounded border"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Brands;
