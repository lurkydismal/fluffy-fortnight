"use client";

import { useCopyToClipboard } from "@/utils/stdhook";

/**
 * CopyIcon
 * Simple clipboard icon (SVG).
 */
function CopyIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
        >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
    );
}

/**
 * CheckIcon
 * Shown after a successful copy action.
 */
function CheckIcon() {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className="w-4 h-4"
        >
            <path d="M20 6L9 17l-5-5" />
        </svg>
    );
}

/**
 * CopyButton
 *
 * Props:
 *  - text: string to copy
 *  - side: "left" | "right" (position relative to message bubble)
 *
 * Features:
 *  - Shows copy icon by default, check icon after copy.
 *  - Fades in on mount using local `mounted` state.
 *  - Tooltip shows on hover/focus (with translation-ready text).
 *
 * Notes:
 *  - Uses Tailwind transitions.
 *  - Positioned absolutely relative to parent container; make sure parent is `relative`.
 *  - Accessible via `aria-label`.
 *  - Can be reused in other chat bubbles.
 */
export function CopyButton({
    text,
    side = "right",
}: {
    text: string;
    side?: "left" | "right";
}) {
    const { copy, copied } = useCopyToClipboard(); // custom hook

    const sideClass = side === "left" ? "left-0.5" : "right-0.5";

    const tooltipAlign = side === "left" ? "left-0" : "right-0";

    return (
        <button
            onClick={() => copy(text)}
            aria-label="Copy message"
            className={`group cursor-pointer select-none
                absolute top-0.5 ${sideClass} z-20
                rounded-md p-0.5
                text-white/70
                fade-in
                hover:text-white
                hover:bg-black/40`}
        >
            {copied ? <CheckIcon /> : <CopyIcon />}

            {/* Tooltip */}
            <span
                className={`pointer-events-none z-30
                    absolute ${tooltipAlign} -top-7
                    rounded bg-black/80 px-2 py-0.5
                    text-[11px] text-white whitespace-nowrap
                    opacity-0 scale-95
                    group-hover:opacity-100 group-hover:scale-100
                    group-focus-visible:opacity-100 group-focus-visible:scale-100
                    transition`}
            >
                {copied ? "Скопировано" : "Скопировать"}
            </span>
        </button>
    );
}
