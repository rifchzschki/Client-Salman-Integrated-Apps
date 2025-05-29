import ReplyItem from "./replyItem";

export default function ReplyList({ replies }: any) {
    return (
        <div className="space-y-4">
            {replies.map((reply: any) => (
                <ReplyItem
                    key={reply.id}
                    reply={reply}
                />
            ))}
        </div>
    );
}