/**
 * MidscreenText Component
 *
 * A simple presentational component to render a large, stylized text
 * in the center of the screen. Useful for splash screens, status messages,
 * or any mid-screen notifications in the chat interface.
 *
 * Props:
 * - text (string): The text string to display in the middle of the screen.
 *
 * Notes:
 * - Uses TailwindCSS for styling.
 * - `pointer-events-none` ensures it doesn't interfere with user interactions.
 * - `drop-shadow` adds a glowing effect behind the text.
 */
export default function MidscreenText({ text }: { text: string }) {
    return (
        <div className="absolute flex inset-0 items-center justify-center pointer-events-none z-0">
            <h1 className="drop-shadow-[0_0_40px_rgba(59,130,246,1)] font-extrabold opacity-50 select-none text-7xl text-blue-500">
                {text}
            </h1>
        </div>
    );
}
