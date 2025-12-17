import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/Button';

interface SessionConflictModalProps {
    onClaimSession: () => void;
}

export const SessionConflictModal = ({ onClaimSession }: SessionConflictModalProps) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-dark-surface border border-dark-border rounded-lg shadow-2xl max-w-md w-full p-6 text-center space-y-6 animate-in fade-in zoom-in duration-200">
                <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto border border-yellow-500/20">
                    <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-xl font-bold text-white">Sesión Activa en Otra Pestaña</h2>
                    <p className="text-light-muted">
                        Hemos detectado que tienes esta aplicación abierta en otra pestaña.
                        Para evitar conflictos de datos, hemos pausado esta sesión.
                    </p>
                </div>

                <div className="pt-2">
                    <Button onClick={onClaimSession} className="w-full">
                        Usar Aquí
                    </Button>
                    <p className="text-xs text-light-muted mt-4">
                        Al hacer clic, la otra pestaña se pausará automáticamente.
                    </p>
                </div>
            </div>
        </div>
    );
};
