import { Message } from "@/data/chat/Message";
import MessageBubble from "./MessageBubble";

/**
 * ChatArea
 *
 * Container for all chat messages.
 *
 * Props:
 *  - messages: Array of Message objects (user or bot messages)
 *
 * Layout:
 *  - Flex column, scrollable, padding and spacing between messages.
 *  - Uses `MessageBubble` for each message.
 *
 * Notes:
 *  - Currently uses index as key; consider using `message.id` if available
 *    to avoid key collisions when messages update asynchronously.
 */
export default function ChatArea({ messages }: { messages: Message[] }) {
    return (
        <div className="bg-gray-800 flex flex-1 flex-col overflow-y-auto p-6 leading-relaxed space-y-4 text-lg text-white">
            {messages.map((msg, index) => {
                return <MessageBubble key={index} message={msg} />;
            })}
        </div>
    );
}
