"use client";

/**
 * InputBar (Client Component)
 *
 * Renders the user input area for the chat interface.
 *
 * Responsibilities:
 * - Render a text input for user messages
 * - Show filtered dropdown suggestions based on available options
 * - Provide submit button with loading indicator
 * - Perform basic client-side validation against allowed options
 * - Display transient error feedback via snackbar
 *
 * Notes:
 * - Marked as `"use client"` because it relies on React hooks and browser APIs
 * - This component currently mixes UI concerns with light domain logic
 *   (validation + message construction), which is flagged for future refactor
 */

import log from "@/utils/stdlog";
import { useEffect, useState } from "react";

/**
 * LoadingIcon
 *
 * Small inline spinner icon used inside the submit button
 * to indicate that a message is currently being processed.
 *
 * Styling:
 * - Tailwind-based animation and sizing
 * - Positioned absolutely to overlay button content
 */
function LoadingIcon() {
    return (
        <svg
            className="animate-spin h-5 w-5 text-white absolute"
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

function matchesOption(option: string, input: string): boolean {
    // Escape regex special chars except for {}
    const escaped = option.replace(/[-\/\\^$+?.()|[\]]/g, "\\$&");
    // Replace {...} with `.*` wildcard
    const pattern = "^" + escaped.replace(/\{.*?\}/g, ".*") + "$";
    const regex = new RegExp(pattern);
    return regex.test(input);
}

/**
 * InputBar Component
 *
 * Props:
 * - placeholder (string): Placeholder text for the input field
 * - sendText (string): Label for the submit button
 * - options (string[]): List of allowed message options
 * - onSendAction (Message => void): Callback invoked on successful submission
 */
export default function InputBar({
    placeholder,
    sendText,
    options,
    loading,
    onSendAction,
}: {
    placeholder: string;
    sendText: string;
    options: string[];
    loading: boolean;
    onSendAction: (content: string) => void;
}) {
    /**
     * Local input value state.
     * Represents the raw text entered by the user.
     */
    const [inputValue, setInputValue] = useState("");

    /**
     * Snackbar message state.
     * When set, triggers rendering of the snackbar component.
     */
    const [snackbar, setSnackbar] = useState<string | null>(null);

    /**
     * Snackbar visibility flag.
     * Used to drive enter/exit CSS transitions.
     */
    const [showSnackbar, setShowSnackbar] = useState(false);

    /**
     * Filter available options based on current input.
     *
     * Behavior:
     * - Case-insensitive substring match
     * - Used to power the dropdown suggestion list
     */
    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(inputValue.toLowerCase()),
    );

    /**
     * triggerSnackbar
     *
     * Shows a transient error message to the user.
     *
     * Implementation details:
     * - Resets visibility to restart animation
     * - Uses requestAnimationFrame to ensure transition is applied
     * - Automatically hides after a fixed timeout
     */
    const triggerSnackbar = (message: string) => {
        setSnackbar(message);
        setShowSnackbar(false);
        requestAnimationFrame(() => {
            // Trigger animation on next frame
            setShowSnackbar(true);
        });
        setTimeout(() => setShowSnackbar(false), 3000); // hide after 3s
    };

    /**
     * Cleanup effect for snackbar lifecycle.
     *
     * Once the exit animation completes, the message
     * is fully removed from state to avoid lingering DOM nodes.
     */
    useEffect(() => {
        if (!showSnackbar && snackbar) {
            // WARN: Delay needs testing
            const timer = setTimeout(() => setSnackbar(null), 3000); // match transition duration
            return () => clearTimeout(timer);
        }
    }, [showSnackbar, snackbar]);

    /**
     * handleSubmit
     *
     * Handles form submission.
     *
     * Flow:
     * - Prevent default browser form submission
     * - Validate input against allowed options
     * - Emit user message upward via onSendAction
     * - Reset input field
     */
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        /**
         * Guard against invalid options.
         * Displays a snackbar error instead of submitting.
         */
        const isValid = options.some((option) =>
            matchesOption(option, inputValue),
        );

        if (!isValid) {
            triggerSnackbar("Выбран недопустимый вариант!");
            return;
        }

        // Log submission for debugging / analytics
        log.debug("Submitted: ", { inputValue });

        /**
         * Emit a chat-domain Message object.
         * This is intentionally noted as a future refactor target.
         */
        onSendAction(inputValue);

        // Reset input after successful submission
        setInputValue("");
    };

    return (
        <>
            {/* Snackbar (error feedback) */}
            {snackbar && (
                <div
                    className={`fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-700 text-white px-6 py-3 rounded shadow-lg transition-all duration-300 ${
                        showSnackbar
                            ? "opacity-100 translate-y-0"
                            : "-translate-y-10 opacity-0"
                    }`}
                >
                    {snackbar}
                </div>
            )}

            {/* Input form */}
            <form
                className="border-t bg-gray-900 border-gray-700 flex p-4 items-start relativ"
                onSubmit={handleSubmit}
            >
                <div className="relative flex-1">
                    {/* Dropdown suggestions */}
                    {inputValue &&
                        filteredOptions.length > 0 &&
                        filteredOptions.length <= 10 && (
                            <ul className="absolute z-10 bottom-full mb-1 w-full bg-gray-800 border border-gray-700 rounded shadow-lg max-h-48 overflow-auto">
                                {filteredOptions.map((opt, index) => (
                                    <li
                                        key={opt}
                                        className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${
                                            index !== filteredOptions.length - 1
                                                ? "border-b border-gray-700"
                                                : ""
                                        }`}
                                        onClick={() => setInputValue(opt)}
                                    >
                                        {opt}
                                    </li>
                                ))}
                            </ul>
                        )}

                    {/* Text input */}
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={placeholder}
                        className="bg-gray-700 w-full px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        autoComplete="off"
                    />
                </div>

                {/* Submit button */}
                <button
                    type="submit"
                    className={`bg-linear-to-br font-semibold from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 ml-2 px-6 py-2 rounded shadow-md text-white transition-all duration-200 focus:outline-none focus:ring-0 flex items-center justify-center gap-2 cursor-pointer`}
                    disabled={loading}
                >
                    {/* 
                        Always render button text to reserve layout space.
                        Visibility is toggled when loading to avoid layout shift.
                    */}
                    <span className={loading ? "invisible" : ""}>
                        {sendText}
                    </span>

                    {/* Loading spinner */}
                    {loading && <LoadingIcon />}
                </button>
            </form>
        </>
    );
}
