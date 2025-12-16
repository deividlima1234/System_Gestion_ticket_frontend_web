import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '../../services/ticketService';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import type { TicketPriority } from '../../types/ticket';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const CreateTicketModal = ({ isOpen, onClose }: CreateTicketModalProps) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<TicketPriority>('medium');

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ticketService.createTicket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tickets'] });
            onClose();
            setTitle('');
            setDescription('');
            setPriority('medium');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ title, description, priority });
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Ticket">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                    label="Título"
                    placeholder="Ej: Fallo en impresora"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <Select
                    label="Prioridad"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    options={[
                        { value: 'low', label: 'Baja' },
                        { value: 'medium', label: 'Media' },
                        { value: 'high', label: 'Alta' },
                        { value: 'critical', label: 'Crítica' },
                    ]}
                />

                <Textarea
                    label="Descripción"
                    placeholder="Describe el problema detalladamente..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <div className="flex justify-end gap-3 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={mutation.isPending}>
                        Crear Ticket
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
