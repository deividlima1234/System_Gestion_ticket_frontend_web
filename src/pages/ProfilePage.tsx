import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profileService';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Lock, Save } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';


export const ProfilePage = () => {
    // const { user: authUser } = useAuth(); // We might need to update auth context user on profile update
    const queryClient = useQueryClient();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const { data: profile, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: profileService.getProfile,
    });

    useEffect(() => {
        if (profile) {
            setName(profile.name);
            setEmail(profile.email);
        }
    }, [profile]);

    const mutation = useMutation({
        mutationFn: profileService.updateProfile,
        onSuccess: (updatedUser) => {
            queryClient.setQueryData(['profile'], updatedUser);
            // Update auth context if needed, though usually we rely on the token. 
            // If the user object is stored in context/localstorage, we should update it.
            // Assuming login function can accept just user update or we manually update localStorage 'user'.
            // For now, let's just show success.
            setMessage({ type: 'success', text: 'Perfil actualizado correctamente.' });
            setPassword('');
            setPasswordConfirmation('');

            // Optional: Update global auth state if it relies on stored user object
            // login(token, updatedUser); 
        },
        onError: () => {
            setMessage({ type: 'error', text: 'Error al actualizar el perfil.' });
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (password && password !== passwordConfirmation) {
            setMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
            return;
        }

        mutation.mutate({
            name,
            email,
            password: password || undefined,
            password_confirmation: passwordConfirmation || undefined,
        });
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto">
                <Skeleton className="h-8 w-48 mb-6" />

                <div className="bg-dark-surface border border-dark-border rounded-lg p-8 shadow-xl max-h-[750px] overflow-y-auto no-scrollbar">
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-dark-border">
                        <Skeleton className="w-20 h-20 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                            <div className="pt-4 border-t border-dark-border">
                                <Skeleton className="h-6 w-48 mb-4" />
                                <Skeleton className="h-4 w-full mb-4" />
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-6">
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Mi Perfil</h1>

            <div className="bg-dark-surface border border-dark-border rounded-lg p-8 shadow-xl max-h-[750px] overflow-y-auto no-scrollbar">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-dark-border">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                        <User className="w-10 h-10 text-primary" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">{profile?.name}</h2>
                        <p className="text-light-muted">
                            {{
                                admin: 'Administrador',
                                support: 'Soporte',
                                user: 'Usuario'
                            }[profile?.role || 'user']}
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {message && (
                        <div className={`p-4 rounded border ${message.type === 'success'
                            ? 'bg-green-500/10 border-green-500/20 text-green-400'
                            : 'bg-red-500/10 border-red-500/20 text-red-400'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 w-5 h-5 text-light-muted" />
                            <Input
                                label="Nombre Completo"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-3 top-3 w-5 h-5 text-light-muted" />
                            <Input
                                label="Correo Electrónico"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>

                        <div className="pt-4 border-t border-dark-border">
                            <h3 className="text-lg font-semibold text-white mb-4">Cambiar Contraseña</h3>
                            <p className="text-sm text-light-muted mb-4">Deja estos campos vacíos si no deseas cambiar tu contraseña.</p>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-light-muted" />
                                    <Input
                                        label="Nueva Contraseña"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        placeholder="••••••••"
                                    />
                                </div>

                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 w-5 h-5 text-light-muted" />
                                    <Input
                                        label="Confirmar Contraseña"
                                        type="password"
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className="pl-10"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6">
                        <Button type="submit" isLoading={mutation.isPending}>
                            <Save className="w-4 h-4" />
                            Guardar Cambios
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};
