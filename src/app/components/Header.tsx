import React from 'react';
import { Bell, Menu, Search, User, LogOut } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
  userEmail?: string;
  onLogout?: () => void;
  onProfileClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, title, userEmail, onLogout, onProfileClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 px-4 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold text-gray-800 hidden md:block">{title || 'Panel de Control'}</h1>
        <div className="md:hidden font-semibold">{title || 'Reefer Manager'}</div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <input
            type="text"
            placeholder="Buscar dispositivo..."
            className="pl-9 pr-4 py-2 bg-gray-100 border-none rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
          />
        </div>

        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
        </Button>

        <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
          <div 
            className="hidden md:flex flex-col items-end cursor-pointer hover:opacity-80"
            onClick={onProfileClick}
          >
            <span className="text-sm font-medium">{userEmail || 'Usuario'}</span>
            <span className="text-xs text-gray-500">Operador</span>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full bg-gray-100 hover:bg-blue-50 hover:text-blue-600 transition-colors"
            onClick={onProfileClick}
            title="Mi Perfil"
          >
            <User className="h-5 w-5 text-gray-600" />
          </Button>
          {onLogout && (
             <Button variant="ghost" size="icon" onClick={onLogout} title="Cerrar Sesión">
               <LogOut className="h-5 w-5 text-red-500" />
             </Button>
          )}
        </div>
      </div>
    </header>
  );
};
