import { useState } from "react";

interface DropDownMenuProps {
    OnSortTypeChange: (value: number) => void;
}

export default function DropDownMenu({ OnSortTypeChange }: DropDownMenuProps) {
    const [open, setOpen] = useState(false);
    const [sortText, setSortText] = useState("Sort by");
    const [arrow, setArrow] = useState(false);

    const sortChange = (text: string, value: number) => {
        setSortText(text);
        setArrow(value % 2 == 0 ? false : true);
        OnSortTypeChange(value);
        setOpen(false);
    };

    /* ================= STYLES ================= */

    const buttonStyle: React.CSSProperties = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#d0d0d0",
        color: "#000",
        borderRadius: "15px",
        width: "200px",
        height: "40px",
        padding: "8px 12px",
        cursor: "pointer",
        border: "none",
    };

    const dropdownStyle: React.CSSProperties = {
        position: "absolute",
        top: "210px",
        zIndex: 10,
        backgroundColor: "#d0d0d0",
        borderRadius: "15px",
        boxShadow: "0 6px 14px rgba(0,0,0,0.25)",
        width: "200px",
    };

    const ulStyle: React.CSSProperties = {
        padding: "8px",
        fontSize: "14px",
        fontWeight: 500,
        listStyle: "none",
        margin: 0,
    };

    const liStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "40px",
        padding: "4px 8px",
        color: "#000",
        cursor: "pointer",
        borderBottom: "1px solid #000",
    };

    const liHoverStyle: React.CSSProperties = {
        backgroundColor: "#9ca3af", // gray-400
    };

    /* ================= JSX ================= */

    return (
        <div>
            <button
                type="button"
                style={buttonStyle}
                onClick={() => setOpen(!open)}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9ca3af")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#d0d0d0")}
            >
                <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
                    {sortText}
                    {sortText !== "Sort by" && (
                        <svg
                            width="14"
                            height="14"
                            viewBox="0 0 16 16"
                            style={{
                                transform: arrow ? "rotate(0deg)" : "rotate(180deg)",
                                transition: "transform 0.2s ease"
                            }}
                            fill="currentColor"
                        >
                            <path d="M6 8L2 8L2 6L8 0L14 6L14 8L10 8L10 16L6 16L6 8Z" />
                        </svg>
                    )}
                </span>
                <svg
                    width={16}
                    height={16}
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m19 9-7 7-7-7"
                    />
                </svg>
            </button>

            {open && (
                <div style={dropdownStyle}>
                    <ul style={ulStyle}>
                        <li style={liStyle}>Sort by</li>

                        <li
                            style={liStyle}
                            onClick={(e) => sortChange(e.currentTarget.innerText, 1)}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, liHoverStyle)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <span>Source</span>
                            <span><svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                            >
                                <path d="M6 8L2 8L2 6L8 0L14 6L14 8L10 8L10 16L6 16L6 8Z" />
                            </svg>
                            </span>
                        </li>

                        <li
                            style={liStyle}
                            onClick={(e) => sortChange(e.currentTarget.innerText, 2)}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, liHoverStyle)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <span>Source</span>
                            <span>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 16 16"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                >
                                    <path d="M10 8L14 8V10L8 16L2 10V8H6V0L10 4.76995e-08V8Z" />
                                </svg>
                            </span>
                        </li>

                        <li
                            style={liStyle}
                            onClick={(e) => sortChange(e.currentTarget.innerText, 3)}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, liHoverStyle)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <span>Date and time</span>
                            <span><svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                            >
                                <path d="M6 8L2 8L2 6L8 0L14 6L14 8L10 8L10 16L6 16L6 8Z" />
                            </svg>
                            </span>
                        </li>

                        <li
                            style={liStyle}
                            onClick={(e) => sortChange(e.currentTarget.innerText, 4)}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, liHoverStyle)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <span>Date and time</span>
                            <span>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 16 16"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                >
                                    <path d="M10 8L14 8V10L8 16L2 10V8H6V0L10 4.76995e-08V8Z" />
                                </svg>
                            </span>
                        </li>

                        <li
                            style={liStyle}
                            onClick={(e) => sortChange(e.currentTarget.innerText, 5)}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, liHoverStyle)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <span>Type</span>
                            <span><svg
                                width="14"
                                height="14"
                                viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                            >
                                <path d="M6 8L2 8L2 6L8 0L14 6L14 8L10 8L10 16L6 16L6 8Z" />
                            </svg>
                            </span>
                        </li>

                        <li
                            style={liStyle}
                            onClick={(e) => sortChange(e.currentTarget.innerText, 6)}
                            onMouseEnter={(e) => Object.assign(e.currentTarget.style, liHoverStyle)}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                        >
                            <span >
                                Type
                            </span>
                            <span>
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 16 16"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                >
                                    <path d="M10 8L14 8V10L8 16L2 10V8H6V0L10 4.76995e-08V8Z" />
                                </svg>
                            </span>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
