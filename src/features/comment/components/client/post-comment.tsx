import { Comment } from "../../models/comment";
import { getRelativeTime } from "@/shared/utils";
import { AvatarImage } from "@/shared/components/avatar-image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";

export function PostComment(
    { 
        comment, 
        isReply = false,
        onReplyClick 
    }: { 
        comment: Comment; 
        isReply?: boolean;
        onReplyClick?: (comment: Comment) => void;
    }
) {
    const textSize = "text-sm";
    const avatarSize = isReply ? "sm" : "md";
    
    return (
        <div className="flex gap-3 items-start">
            <Link href={`/profile/${comment.username}`} className="hover:opacity-80 transition-opacity">
                <AvatarImage src={comment.userAvatarUrl} alt={comment.username} size={avatarSize} />
            </Link>
            <div className="flex-1">
                <p className={textSize}>
                    <Link href={`/profile/${comment.username}`} className="font-semibold mr-2 hover:underline">
                        {comment.username || 'unknown'}
                    </Link>
                    {comment.content}
                </p>
                <div className="flex items-center gap-4 mt-1">
                    <p className="text-xs text-gray-500">{getRelativeTime(comment.createdAt)}</p>
                    {onReplyClick && (
                        <button
                            onClick={() => onReplyClick(comment)}
                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500 transition-colors"
                        >
                            <span>Trả lời</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}