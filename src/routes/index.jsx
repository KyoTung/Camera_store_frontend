import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "@/layouts/admin/layout";
import DashboardPage from "@/pages/admin/dashboard/page";
import LoginForm from "@/pages/login";
import RegisterForm from "../pages/register";
import GuestLayout from "../layouts/client/layout";
import User from "../pages/admin/user/users";
import EditUser from "../pages/admin/user/editUser";
import NewUser from "../pages/admin/user/newUser";
import Categories from "../pages/admin/categories/categories";
import Brands from "../pages/admin/brands/brands";
import Products from "../pages/admin/products/Product";
import NewProduct from "../pages/admin/products/newProduct";
import EditProduct from "../pages/admin/products/editProduct";
import Orders from "../pages/admin/orders/orders";
import OrderDetail from "../pages/admin/orders/orderDetail";
import ProductDetail from "../pages/client/productDetail";
import Home from "../pages/client/home";
import Cart from "../pages/client/cart";
import Checkout from "../pages/client/checkOut";
import OrderConfirmation from "../pages/client/orderConfirmation"
import OrderHistory from "../pages/client/orderHistory";
import DetailOrder from "../pages/client/orderDetail";
import ProductCategory from "../pages/client/productCategory";
import Sidebar from "../layouts/client/sidebar"
import ProductSearch from "../pages/client/searchProduct"
import ProductBrand from "../pages/client/productBrand";
import DiscountCode from "../pages/admin/discountCode/discountCode";

export const router = createBrowserRouter([
    { path: "/login", element: <LoginForm /> },
    { path: "/register", element: <RegisterForm /> },
    {
        path: "/",
        element: <GuestLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "product-search",
                element: <ProductSearch />,
            },
            {
                path: "product-category/:id",
                element: <ProductCategory />,
            },
            {
                path: "product-brand/:id",
                element: <ProductBrand />,
            },
            {
                path: "product-detail/:id",
                element: <ProductDetail />,
            },
            {
                path: "cart",
                element: <Cart />,
            },
            {
                path: "checkout/:shipping/:discount",
                element: <Checkout />,
            },
            {
                path: "order-confirmation/:id",
                element: <OrderConfirmation />,
            },
            {
                path: "order-history/:id",
                element: <OrderHistory />,
            },
            {
                path: "detail-order/:id",
                element: <DetailOrder />,
            },
        ],
    },
    {
        path: "/admin",
        element: <Layout />,
        children: [
            {
                index: true,
                element: <DashboardPage />,
            },
            {
                path: "users",
                element: <User />,
            },
            {
                path: "edit-user/:id",
                element: <EditUser />,
            },
            {
                path: "new-user",
                element: <NewUser />,
            },
            {
                path: "categories",
                element: <Categories />,
            },
            {
                path: "discount-code",
                element: <DiscountCode />,
            },
            {
                path: "brands",
                element: <Brands />,
            },
            {
                path: "products",
                element: <Products />,
            },
            {
                path: "new-product",
                element: <NewProduct />,
            },
            {
                path: "edit-product/:product_id",
                element: <EditProduct />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
            {
                path: "order-detail/:id",
                element: <OrderDetail />,
            },
            {
                path: "settings",
                element: <h1 className="title">Settings</h1>,
            },
        ],
    },
]);
