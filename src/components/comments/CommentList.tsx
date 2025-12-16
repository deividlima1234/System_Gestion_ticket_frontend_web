import { useRef, useEffect } from 'react';
import type { Comment } from '../../types/ticket';
import { User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface CommentListProps {
    comments: Comment[];
}

export const CommentList = ({ comments }: CommentListProps) => {
    const { user } = useAuth();
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when comments change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [comments]);

    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-8 text-light-muted">
                No hay comentarios aún.
            </div>
        );
    }

    return (
        <>
            <style>
                {`
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}
            </style>
            <div
                ref={scrollRef}
                className="space-y-6 max-h-[600px] overflow-y-auto no-scrollbar pr-2"
            >
                {comments.map((comment) => {
                    const isOwnComment = comment.user_id === user?.id;

                    return (
                        <div key={comment.id} className={`flex gap-4 ${isOwnComment ? 'flex-row-reverse' : ''}`}>
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-dark-border flex items-center justify-center">
                                    <User className="w-6 h-6 text-light-muted" />
                                </div>
                            </div>
                            <div className={`flex-1 max-w-2xl ${isOwnComment ? 'text-right' : ''}`}>
                                <div className="flex items-center gap-2 mb-1 justify-end">
                                    {/* Header info could go here */}
                                </div>
                                <div
                                    className={`p-4 rounded-lg inline-block text-left ${isOwnComment
                                        ? 'bg-primary/10 border border-primary/20 text-white rounded-tr-none'
                                        : 'bg-dark-surface border border-dark-border text-gray-300 rounded-tl-none'
                                        }`}
                                >
                                    <div className="flex justify-between items-center gap-4 mb-2 text-xs text-light-muted">
                                        <span className="font-bold text-white">{comment.user?.name || 'Usuario'}</span>
                                        <span>{new Date(comment.created_at).toLocaleString()}</span>
                                    </div>
                                    <p className="whitespace-pre-wrap">{comment.content}</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};
