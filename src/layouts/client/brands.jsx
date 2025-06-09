import { Link } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../../index.css"

const Brands = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();

     useEffect(() => {
         getBrands()
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
        <div id="brands" className="rounded bg-red-900 pb-6 pt-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                    {brands.map((brand, i) => (
                        <Link
                            key={i}
                            to={`/product-brand/${brand.id}`}
                            className="group rounded-lg border bg-white p-2 shadow-sm transition-shadow duration-200 hover:shadow-md"
                        >
                            <img src={`../../../public/asssets${brand.name}.png`} />
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Brands;
