import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { userService } from '../../services/userService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { User } from '../../types/auth';
import type { UpdateUserDTO } from '../../types/user';

interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    userToEdit?: User | null;
}

export const UserModal = ({ isOpen, onClose, userToEdit }: UserModalProps) => {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'admin' | 'support' | 'user'>('user');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (userToEdit) {
            setName(userToEdit.name);
            setEmail(userToEdit.email);
            setRole(userToEdit.role);
            setPassword('');
            setPasswordConfirmation('');
        } else {
            setName('');
            setEmail('');
            setRole('user');
            setPassword('');
            setPasswordConfirmation('');
        }
        setError('');
    }, [userToEdit, isOpen]);

    const createMutation = useMutation({
        mutationFn: userService.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onClose();
        },
        onError: () => setError('Error al crear usuario. Verifique los datos.'),
    });

    const updateMutation = useMutation({
        mutationFn: (data: UpdateUserDTO) => userService.updateUser(userToEdit!.id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            onClose();
        },
        onError: () => setError('Error al actualizar usuario.'),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!userToEdit && password !== passwordConfirmation) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (userToEdit) {
            updateMutation.mutate({
                name,
                email,
                role,
                password: password || undefined,
                password_confirmation: passwordConfirmation || undefined,
            });
        } else {
            createMutation.mutate({
                name,
                email,
                role,
                password,
                password_confirmation: passwordConfirmation,
            });
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={userToEdit ? 'Editar Usuario' : 'Nuevo Usuario'}>
            <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm">
                        {error}
                    </div>
                )}

                <Input
                    label="Nombre"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <Select
                    label="Rol"
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    options={[
                        { value: 'user', label: 'Usuario' },
                        { value: 'support', label: 'Soporte' },
                        { value: 'admin', label: 'Administrador' },
                    ]}
                />

                <div className="space-y-4 pt-2 border-t border-dark-border">
                    <p className="text-sm text-light-muted">
                        {userToEdit ? 'Dejar en blanco para mantener la contraseña actual' : 'Establecer contraseña'}
                    </p>
                    <Input
                        label="Contraseña"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!userToEdit}
                    />
                    <Input
                        label="Confirmar Contraseña"
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required={!userToEdit}
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="ghost" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" isLoading={isLoading}>
                        {userToEdit ? 'Guardar Cambios' : 'Crear Usuario'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
