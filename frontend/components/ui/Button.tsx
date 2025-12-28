import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "ghost" | "outline";
}

export function Button({
    className = "",
    variant = "primary",
    ...props
}: ButtonProps) {
    const baseStyles =
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2";

    const variants = {
        primary: "bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 shadow",
        ghost: "hover:bg-zinc-100 hover:text-zinc-900",
        outline: "border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        />
    );
}
