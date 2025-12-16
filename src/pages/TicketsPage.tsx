import { useState } from 'react';
import { TicketList } from '../components/tickets/TicketList';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';
import { CreateTicketModal } from '../components/tickets/CreateTicketModal';

export const TicketsPage = () => {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Tickets de Soporte</h1>
                    <p className="text-light-muted">Gestiona y da seguimiento a tus incidencias</p>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <Plus className="w-4 h-4" />
                    Nuevo Ticket
                </Button>
            </div>

            <div className="max-h-[750px] overflow-y-auto no-scrollbar pr-2">
                <TicketList />
            </div>

            {isCreateModalOpen && (
                <CreateTicketModal
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                />
            )}
        </div>
    );
};
