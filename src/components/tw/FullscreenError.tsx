/**
 * FullscreenError Component
 *
 * Displays a full-page error screen with a message and a reload button.
 * Useful for handling critical UI or network errors in chat or tour pages.
 *
 * Props:
 * - messages (readonly string[]): Array of error messages to display.
 * - reload (): Callback function triggered when the user clicks "Повторить".
 *
 * Notes:
 * - Filters out empty messages and joins remaining messages with line breaks.
 * - If no messages remain, displays a default fallback message.
 * - Uses TailwindCSS for styling: full-screen layout, centered content, button styles.
 */
export default function FullscreenError({
    messages,
    reload,
}: {
    messages: readonly string[];
    reload: () => void;
}) {
    /**
     * Normalize messages:
     * - Remove empty values
     * - Join with line breaks for readability
     * - Fallback to a generic message if nothing is left
     */
    const message =
        messages.filter(Boolean).join("\n") || "Не удалось загрузить данные";

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white gap-4">
            <div className="max-w-6xl w-full text-center">
                <p className="text-lg">Ошибка при загрузке данных: {message}</p>
            </div>

            <button
                onClick={reload}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-4xl shadow-md text-white font-semibold cursor-pointer"
            >
                Повторить
            </button>
        </div>
    );
}
