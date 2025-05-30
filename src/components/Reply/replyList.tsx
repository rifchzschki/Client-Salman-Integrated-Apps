import ReplyItem from "./replyItem";
import { Reply } from "@/types/types";

interface ReplyListProps {
    replies: Reply[];
}

export default function ReplyList({ replies }: ReplyListProps) {
    return (
        <div className="space-y-4">
            {replies.map((reply: Reply) => (
                <ReplyItem
                    key={reply.id}
                    reply={reply}
                />
            ))}
        </div>
    );
}