
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu } from 'lucide-react';

export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-dark">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <main className="flex-1 p-8 overflow-y-auto relative w-full">
                {/* Mobile Header with Menu Button */}
                <div className="lg:hidden mb-6 flex items-center gap-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-white hover:bg-dark-surface rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-white">TicketSys</h1>
                </div>

                <Outlet />
            </main>
        </div>
    );
};

