import React from 'react';
import { LayoutDashboard, Settings, Thermometer, Wind, BookOpen, Users, HelpCircle, LogOut, Activity } from 'lucide-react';
import { cn } from '@/app/lib/utils';
import { Button } from './ui/Button';

interface SidebarProps {
  activeView: string;
  onChangeView: (view: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onChangeView, isOpen, onClose }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'control', label: 'Control de Dispositivos', icon: Thermometer },
    { id: 'monitoring', label: 'Monitoreo y Análisis', icon: Wind },
    { id: 'processes', label: 'Seguimiento (Plus)', icon: Activity },
    { id: 'recipes', label: 'Recetas (Plus)', icon: BookOpen },
    { id: 'users', label: 'Usuarios (Plus)', icon: Users },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'help', label: 'Ayuda y Soporte', icon: HelpCircle },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white transition-transform duration-200 ease-in-out md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-4 border-b border-slate-700 flex items-center gap-2">
          <div className="h-8 w-8 bg-blue-500 rounded-md flex items-center justify-center font-bold">RM</div>
          <span className="font-bold text-lg">Reefer Manager</span>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onChangeView(item.id);
                onClose();
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                activeView === item.id 
                  ? "bg-blue-600 text-white" 
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-slate-800">
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>
    </>
  );
};
