import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "search_history";

const SearchMobile = () => {
    const [query, setQuery] = useState("");
    const [history, setHistory] = useState([]);
    const [showHistory, setShowHistory] = useState(false);
    const inputRef = useRef();
    const navigate = useNavigate();

    // Load history on mount
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        setHistory(data);
    }, []);

    // Save history to localStorage when it changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }, [history]);

    // Search submit
    const handleSearch = (e) => {
        e.preventDefault();
        const val = query.trim();
        if (!val) return;
        setHistory((prev) => [val, ...prev.filter((item) => item !== val)].slice(0, 10));
        setShowHistory(false);
        setQuery("");
        navigate(`/product-search?q=${encodeURIComponent(val)}`);
    };

    // Remove one history item
    const handleRemove = (text) => {
        setHistory(history.filter((item) => item !== text));
    };

    // Show history when focus
    const handleFocus = () => {
        if (history.length > 0) setShowHistory(true);
    };

    // Hide history after blur
    const handleBlur = () => {
        setTimeout(() => setShowHistory(false), 100);
    };

    // Select an item in history
    const handleSelectHistory = (text) => {
        setQuery(text);
        setShowHistory(false);
        navigate(`/product-search?q=${encodeURIComponent(text)}`);
    };

    const handleClearInput = () => {
        setQuery("");
    };

    return (
        <form
            onSubmit={handleSearch}
            className="relative mt-4 pb-4 md:hidden"
            autoComplete="off"
        >
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search products..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-10 text-black focus:outline-none"
                />
                <button
                    type="submit"
                    className="absolute left-3 top-3"
                    aria-label="Search"
                >
                    <FiSearch className="text-gray-400" />
                </button>
                {query && (
                    <button
                        type="button"
                        className="absolute right-3 top-2 p-1 text-gray-400 hover:text-red-600"
                        onClick={handleClearInput}
                        aria-label="Clear search"
                    >
                        <FiX className="h-5 w-5" />
                    </button>
                )}
            </div>
            {/* Search History */}
            {showHistory && (
                <ul className="absolute left-0 right-0 top-full z-50 mt-2 max-h-64 overflow-auto rounded border bg-white shadow">
                    {history.length === 0 && <li className="px-4 py-2 text-gray-500">Không có lịch sử</li>}
                    {history.map((item) => (
                        <li
                            key={item}
                            className="group flex cursor-pointer items-center px-4 py-2 hover:bg-blue-100"
                        >
                            <span
                                className="flex-1 truncate"
                                onClick={() => handleSelectHistory(item)}
                            >
                                {item}
                            </span>
                            <button
                                className="p-1 text-gray-400 opacity-0 transition hover:text-red-600 group-hover:opacity-100"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(item);
                                }}
                                aria-label="Xóa lịch sử"
                                tabIndex={-1}
                            >
                                <FiX className="h-4 w-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default SearchMobile;
