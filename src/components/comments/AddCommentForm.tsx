import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Send } from 'lucide-react';

interface AddCommentFormProps {
    ticketId: number;
}

export const AddCommentForm = ({ ticketId }: AddCommentFormProps) => {
    const [content, setContent] = useState('');
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, content }: { id: number; content: string }) =>
            ticketService.addComment(id, content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ticket', ticketId] }); // Assuming comments are fetched with ticket or separate query
            queryClient.invalidateQueries({ queryKey: ['comments', ticketId] });
            setContent('');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;
        mutation.mutate({ id: ticketId, content });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
                placeholder="Escribe un comentario..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
            />
            <div className="flex justify-end">
                <Button type="submit" isLoading={mutation.isPending} disabled={!content.trim()}>
                    <Send className="w-4 h-4" />
                    Enviar Comentario
                </Button>
            </div>
        </form>
    );
};
