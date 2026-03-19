"use client";

/**
 * ProgressiveMessage
 *
 * Client-side component that progressively reveals a message word-by-word,
 * simulating a "typing" effect commonly used in chat UIs.
 *
 * Responsibilities:
 * - Tokenize text into plain text and links
 * - Reveal tokens gradually with randomized delays
 * - Auto-scroll into view as content grows
 * - Render a copy button once the full message is visible
 */

import { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "@/components/plain/Link";
import { CopyButton } from "./Chat/CopyButton";

/**
 * Token types used by the tokenizer.
 * This allows us to render links and text differently while
 * keeping the original message structure intact.
 */
type TextToken = {
    type: "text";
    value: string;
};

type LinkToken = {
    type: "link";
    value: string;
    href: string;
};

type Token = TextToken | LinkToken;

/**
 * tokenizeMessage
 *
 * Parses a message string and converts markdown-style links
 * ([label](url)) into structured link tokens.
 *
 * Notes:
 * - Keeps whitespace intact by splitting with capturing groups
 * - Underscores in link labels are replaced with spaces for readability
 */
function tokenizeMessage(text: string): Token[] {
    const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/;

    const tokens: Token[] = [];
    const parts = text.split(/(\s+)/); // keep spaces

    for (const part of parts) {
        const match = part.match(LINK_REGEX);
        if (match) {
            tokens.push({
                type: "link",
                value: match[1].replaceAll("_", " "),
                href: match[2],
            });
        } else {
            tokens.push({ type: "text", value: part });
        }
    }

    return tokens;
}

/**
 * ProgressiveMessage Component
 *
 * Props:
 * - text (string): Full message content to display
 * - side ("left" | "right", optional): Used for positioning the copy button
 *
 * Behavior:
 * - Words are revealed incrementally using a randomized timer
 * - Message scrolls into view as new content appears
 * - Once fully revealed, a copy button is shown
 */
export function ProgressiveMessage({
    text,
    side,
}: {
    text: string;
    side?: "left" | "right";
}) {
    /**
     * Number of tokens currently visible.
     * Increases over time to create the progressive reveal effect.
     */
    const [visibleCount, setVisibleCount] = useState(0);

    /**
     * Ref to the message container.
     * Used to scroll the message into view as it grows.
     */
    const messageBoxRef = useRef<HTMLDivElement | null>(null);

    /**
     * Split text into words and spaces.
     * Used solely for timing the reveal effect.
     */
    const words = useMemo(() => text.split(/(\s+)/), [text]);

    /**
     * Progressive reveal effect.
     *
     * - Resets when `text` changes
     * - Uses randomized delays to feel more natural
     * - Stops automatically once all tokens are visible
     */
    useEffect(() => {
        const minDelay = 25; // ms
        const maxDelay = 75; // ms

        let timeoutId: number;

        const tick = () => {
            setVisibleCount((c) => Math.min(c + 1, words.length));

            const delay = minDelay + Math.random() * (maxDelay - minDelay);

            timeoutId = window.setTimeout(tick, delay);
        };

        const delay = minDelay + Math.random() * (maxDelay - minDelay);

        timeoutId = window.setTimeout(tick, delay);

        return () => clearInterval(timeoutId);
    }, [text, words.length]);

    /**
     * Auto-scroll behavior.
     *
     * Ensures the currently typing message stays visible
     * as new tokens are rendered.
     */
    useEffect(() => {
        messageBoxRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
    }, [visibleCount]);

    /**
     * Tokenized representation of the message.
     * Rendering is gated by `visibleCount`.
     */
    const tokens = useMemo(() => tokenizeMessage(text), [text]);

    return (
        <div ref={messageBoxRef}>
            <p className="leading-relaxed whitespace-pre-wrap">
                {tokens.slice(0, visibleCount).map((token, i) => {
                    if (token.type === "link") {
                        /**
                         * Render links using the app's custom Link component.
                         * Opens in a new tab and fades in as it appears.
                         */
                        return (
                            <NextLink
                                key={i}
                                href={token.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline text-blue-200 animate-[fadeIn_0.3s_ease-out]"
                            >
                                {token.value}
                            </NextLink>
                        );
                    }

                    /**
                     * Plain text token.
                     * Uses a fade-in animation to match link appearance.
                     */
                    return (
                        <span
                            key={i}
                            className="animate-[fadeIn_0.3s_ease-out]"
                        >
                            {token.value}
                        </span>
                    );
                })}

                {/**
                 * Copy button becomes visible only once the full
                 * message has finished rendering.
                 */}
                {visibleCount === tokens.length && (
                    <CopyButton text={text} side={side} />
                )}
            </p>
        </div>
    );
}
