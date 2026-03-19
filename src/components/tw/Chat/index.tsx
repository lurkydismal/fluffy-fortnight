import { chatAction } from "@/lib/chat/chatAction";
import ChatView from "./View";

export default function Chat({ options }: { options: string[] }) {
    return <ChatView onSendAction={chatAction} options={options} />;
}
