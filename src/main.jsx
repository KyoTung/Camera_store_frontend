import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ContextProvider } from "./contexts/contextProvider.jsx";
import { CartProvider } from "./contexts/cart.jsx";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <ContextProvider>
            <CartProvider>
                <App />
            </CartProvider>
        </ContextProvider>
    </StrictMode>,
);


