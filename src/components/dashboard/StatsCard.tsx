import type { LucideIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

interface StatsCardProps {
    title: string;
    value: number | string;
    icon: LucideIcon;
    trend?: string;
    trendUp?: boolean;
    color?: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

export const StatsCard = ({ title, value, icon: Icon, trend, trendUp, color = 'primary' }: StatsCardProps) => {
    const colorClasses = {
        primary: 'bg-primary/10 text-primary border-primary/20',
        success: 'bg-green-500/10 text-green-500 border-green-500/20',
        warning: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
        danger: 'bg-red-500/10 text-red-500 border-red-500/20',
        info: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    };

    return (
        <div className="bg-dark-surface border border-dark-border rounded-xl p-6 transition-all hover:border-primary/50">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-light-muted text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                    {trend && (
                        <p className={cn("text-xs mt-2 font-medium flex items-center gap-1", trendUp ? "text-green-400" : "text-red-400")}>
                            {trend}
                        </p>
                    )}
                </div>
                <div className={cn("p-3 rounded-lg border", colorClasses[color])}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
};
