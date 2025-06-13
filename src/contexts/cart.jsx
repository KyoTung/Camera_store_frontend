import { createContext, useState, useEffect, useMemo } from "react";

export const CartContext = createContext();
export const CartProvider = ({ children }) => {
    //const [cartData, setCartData] = useState(JSON.parse(localStorage.getItem("cart")) || []);

    const [cartData, setCartData] = useState(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });
    // Đồng bộ hóa với localStorage mỗi khi cartData thay đổi
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartData));
    }, [cartData]);

    const addToCart = (product) => {
        setCartData((prevCart) => {
            // Tìm sản phẩm đã tồn tại trong giỏ hàng
            const existingProductIndex = prevCart.findIndex((item) => item.product_id === product.id);

            // Nếu sản phẩm đã tồn tại
            if (existingProductIndex !== -1) {
                const updatedCart = [...prevCart];
                updatedCart[existingProductIndex] = {
                    ...updatedCart[existingProductIndex],
                    qty: updatedCart[existingProductIndex].qty + 1,
                };
                return updatedCart;
            }

            // Nếu sản phẩm chưa tồn tại - thêm mới
            return [
                ...prevCart,
                {
                    id: `${product.id}-${Date.now()}`, // ID duy nhất
                    product_id: product.id,
                    name: product.name,
                    price: product.price,
                    qty: 1,
                    image_url: product.image_url,
                },
            ];
        });
    };

    const removeFromCart = (cartItemId) => {
        setCartData((prevCart) => prevCart.filter((item) => item.id !== cartItemId));
    };

    const updateQuantity = (cartItemId, newQty) => {
        setCartData((prevCart) => prevCart.map((item) => (item.id === cartItemId ? { ...item, qty: Math.max(1, newQty) } : item)));
    };

    // Tính toán subtotal sử dụng useMemo để tối ưu hiệu năng
    const subTotal = useMemo(() => {
        return cartData.reduce((total, item) => total + item.price * item.qty, 0);
    }, [cartData]);

    // Tính toán grandtotal có thể mở rộng thêm các loại phí
    const grandTotal = (discount = 0, shipping = 0) => {
        const discountedAmount = subTotal * discount;
        return subTotal - discountedAmount + shipping;
    };

    const clearCart = () => setCartData([]);

    const totalQuantity = cartData.reduce((sum, item) => sum + item.qty, 0);

    return (
        <CartContext.Provider value={{ cartData, addToCart, removeFromCart, updateQuantity, subTotal, grandTotal, clearCart, totalQuantity }}>
            {children}
        </CartContext.Provider>
    );
};
