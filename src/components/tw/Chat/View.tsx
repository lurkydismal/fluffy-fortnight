"use client";

import { useState, useTransition } from "react";
import ChatArea from "./Area";
import InputBar from "./InputBar";
import MidscreenText from "./MidscreenText";
import { Message } from "@/data/chat/Message";
import { ActionResult } from "@/lib/types";
import { clientMarker } from "@/utils/stdvar";
import { clientFunctionRegistry } from "@/lib/chat/functions-client";

export default function ChatView({
    onSendAction,
    options,
}: {
    onSendAction: (content: string) => Promise<ActionResult<string>>;
    options: string[];
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPending, startTransition] = useTransition();

    // const handleSend = async (content: string) => {
    //     const userMessage: Message = { who: "user", content };
    //     setMessages((prev) => [...prev, userMessage]);
    //
    //     startTransition(() => {
    //         onSendAction(content).then((result) => {
    //             setMessages((prev) => [
    //                 ...prev,
    //                 {
    //                     who: "bot",
    //                     content: result.ok ? result.data : result.error,
    //                 },
    //             ]);
    //         });
    //     });
    // };
    const handleSend = async (content: string) => {
        const userMessage: Message = { who: "user", content };
        setMessages((prev) => [...prev, userMessage]);

        startTransition(() => {
            onSendAction(content).then(async (result) => {
                if (!result.ok) {
                    setMessages((prev) => [
                        ...prev,
                        { who: "bot", content: result.error },
                    ]);
                    return;
                }

                const data = String(result.data ?? "");

                if (data.startsWith(clientMarker)) {
                    // parse marker: CLIENT_FN::<id>::<urlencoded-json-params>
                    const parts = data.split("::");
                    const id = parts[1];
                    const encoded = parts[2] ?? "%7B%7D";
                    let params: Record<string, string> = {};
                    try {
                        params = JSON.parse(decodeURIComponent(encoded));
                    } catch {
                        // fall back to empty
                        params = {};
                    }

                    const fn = clientFunctionRegistry[id];
                    if (!fn) {
                        setMessages((prev) => [
                            ...prev,
                            {
                                who: "bot",
                                content: "Client function not implemented.",
                            },
                        ]);
                        return;
                    }

                    try {
                        const clientResult = fn(params);
                        setMessages((prev) => [
                            ...prev,
                            { who: "bot", content: clientResult ?? "" },
                        ]);
                    } catch {
                        setMessages((prev) => [
                            ...prev,
                            {
                                who: "bot",
                                content: "Error running client function.",
                            },
                        ]);
                    }
                    return;
                }

                // normal server response
                setMessages((prev) => [...prev, { who: "bot", content: data }]);
            });
        });
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/**
             * Decorative mid-screen text.
             */}
            <MidscreenText text="Инструкции" />

            {/**
             * Scrollable chat history area.
             */}
            <ChatArea messages={messages} />

            {/**
             * User input component.
             * Disabled while a server action is pending.
             */}
            <InputBar
                placeholder="Печатайте здесь..."
                sendText="Спросить"
                options={options}
                loading={isPending}
                onSendAction={handleSend}
            />
        </div>
    );
}
