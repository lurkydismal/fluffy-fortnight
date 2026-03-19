"use client";

import { Message } from "@/data/chat/Message";
import { CopyButton } from "./CopyButton";
import { ProgressiveMessage } from "@/components/tw/ProgressiveMessage";
import { useEffect, useRef } from "react";

const BASE_CLASSES =
    "relative break-words font-medium leading-relaxed max-w-[70%] px-5 py-3 rounded-xl shadow text-lg text-white whitespace-pre-line z-10";

const VARIANTS = {
    user: "self-end bg-blue-600",
    bot: "self-start bg-gray-700",
};

function UserMessage({ text }: { text: string }) {
    return (
        <>
            {text}
            <CopyButton text={text} side="left" />
        </>
    );
}

function BotMessage({ text }: { text: string }) {
    return <ProgressiveMessage key={text} text={text} side="right" />;
}

/**
 * MessageBubble
 *
 * Renders a single chat message.
 *
 * Features:
 *  - Differentiates between user and bot messages.
 *  - Supports copy button for user messages.
 *  - ProgressiveMessage for bot typing animation.
 *  - Scrolls into view on mount.
 *
 * Notes:
 *  - `base` & `variants` memoized for performance (avoids re-computation each render).
 *  - `side` determines tooltip/copy button alignment.
 *  - Ref-based scrolling ensures new messages are visible.
 *  - Currently supports only 2 message types: "user" and "bot".
 *  - Could be extended for system messages or errors in the future.
 */
export default function MessageBubble({ message }: { message: Message }) {
    const bubbleRef = useRef<HTMLDivElement | null>(null);

    // Scroll to new message when bubble mounts
    useEffect(() => {
        bubbleRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, []);

    return (
        <div
            ref={bubbleRef}
            className={`${BASE_CLASSES} ${VARIANTS[message.who]}`}
        >
            {message.who === "bot" ? (
                <BotMessage text={message.content} />
            ) : (
                <UserMessage text={message.content} />
            )}
        </div>
    );
}
