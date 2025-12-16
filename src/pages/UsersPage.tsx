import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/userService';
import { Button } from '../components/ui/Button';
import { UserModal } from '../components/users/UserModal';
import { Plus, Pencil, Trash2, Shield, User as UserIcon, Headphones } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import type { User } from '../types/auth';

export const UsersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState<User | null>(null);
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: userService.getUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: userService.deleteUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });

    const handleEdit = (user: User) => {
        setUserToEdit(user);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setUserToEdit(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
            deleteMutation.mutate(id);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'admin':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20"><Shield className="w-3 h-3" /> Admin</span>;
            case 'support':
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20"><Headphones className="w-3 h-3" /> Soporte</span>;
            default:
                return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"><UserIcon className="w-3 h-3" /> Usuario</span>;
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white">Gestión de Usuarios</h1>
                    <p className="text-light-muted">Administra los usuarios del sistema</p>
                </div>
                <Button onClick={handleCreate}>
                    <Plus className="w-4 h-4" />
                    Nuevo Usuario
                </Button>
            </div>

            <div className="bg-dark-surface border border-dark-border rounded-lg overflow-hidden shadow-xl">
                <div className="overflow-x-auto max-h-[750px] overflow-y-auto no-scrollbar">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-dark-surface text-light-muted text-sm uppercase sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="px-6 py-4 font-medium bg-dark-surface">Usuario</th>
                                <th className="px-6 py-4 font-medium bg-dark-surface">Rol</th>
                                <th className="px-6 py-4 font-medium bg-dark-surface">Fecha Registro</th>
                                <th className="px-6 py-4 font-medium text-right bg-dark-surface">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-dark-border">
                            {users?.map((user) => (
                                <tr key={user.id} className="hover:bg-dark-border/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium text-white">{user.name}</p>
                                            <p className="text-sm text-light-muted">{user.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getRoleBadge(user.role)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-light-muted">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="sm" onClick={() => handleEdit(user)} className="h-8 w-8 p-0">
                                                <Pencil className="w-4 h-4 text-blue-400" />
                                            </Button>
                                            <Button variant="ghost" size="sm" onClick={() => handleDelete(user.id)} className="h-8 w-8 p-0 hover:bg-red-900/20">
                                                <Trash2 className="w-4 h-4 text-red-400" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-light-muted">
                                        No hay usuarios registrados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                userToEdit={userToEdit}
            />
        </div>
    );
};
