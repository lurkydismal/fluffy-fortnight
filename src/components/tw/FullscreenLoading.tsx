/**
 * LoadingIcon Component
 *
 * Renders a spinning SVG loader icon.
 * - `animate-spin` from TailwindCSS handles the rotation animation.
 * - Circle provides a light background ring.
 * - Path provides the solid foreground arc.
 *
 * Notes:
 * - This is a visual-only component, can be reused wherever a loading indicator is needed.
 */
function LoadingIcon() {
    return (
        <svg
            className="animate-spin h-10 w-10 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>

            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
        </svg>
    );
}

/**
 * FullscreenLoading Component
 *
 * Displays a full-page loading screen with a spinner and optional text.
 * Useful for blocking UI during async operations or server requests.
 *
 * Props:
 * - text (string): A short message to show below the loader, e.g., "Loading messages..."
 *
 * Notes:
 * - Fullscreen (`h-screen`) to cover entire viewport.
 * - Centers loader both horizontally and vertically.
 * - Background and text colors set for high contrast (dark mode).
 */
export default function FullscreenLoading({ text }: { text: string }) {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
            <div className="flex flex-col items-center gap-4">
                <LoadingIcon />

                <span className="text-lg">{text}</span>
            </div>
        </div>
    );
}
