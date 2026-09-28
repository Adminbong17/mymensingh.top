import React from 'react';
import {
  LayoutDashboard,
  Users,
  Store,
  Layers,
  Droplet,
  GraduationCap,
  Building,
  Newspaper,
  Calendar,
  Percent,
  Settings,
  ExternalLink,
  LogOut,
  X
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'businesses'
  | 'categories'
  | 'blood-bank'
  | 'tuition'
  | 'to-let'
  | 'news'
  | 'events'
  | 'offers'
  | 'settings';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  onVisitWebsite: () => void;
  onLogout: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  usersCount?: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onVisitWebsite,
  onLogout,
  isOpenMobile = false,
  onCloseMobile
}) => {
  const navItems = [
    {
      id: 'dashboard' as AdminTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      iconColor: 'text-emerald-400'
    },
    {
      id: 'users' as AdminTab,
      label: 'Users',
      icon: Users,
      badge: '1,245',
      iconColor: 'text-slate-300'
    },
    {
      id: 'businesses' as AdminTab,
      label: 'Businesses',
      icon: Store,
      badge: null,
      iconColor: 'text-slate-300'
    },
    {
      id: 'categories' as AdminTab,
      label: 'Categories',
      icon: Layers,
      badge: null,
      iconColor: 'text-slate-300'
    },
    {
      id: 'blood-bank' as AdminTab,
      label: 'Blood Bank',
      icon: Droplet,
      badge: null,
      iconColor: 'text-rose-500 fill-rose-500'
    },
    {
      id: 'tuition' as AdminTab,
      label: 'Tuition Media',
      icon: GraduationCap,
      badge: null,
      iconColor: 'text-purple-400'
    },
    {
      id: 'to-let' as AdminTab,
      label: 'To-Let',
      icon: Building,
      badge: null,
      iconColor: 'text-emerald-400'
    },
    {
      id: 'news' as AdminTab,
      label: 'News',
      icon: Newspaper,
      badge: null,
      iconColor: 'text-slate-300'
    },
    {
      id: 'events' as AdminTab,
      label: 'Events',
      icon: Calendar,
      badge: null,
      iconColor: 'text-slate-300'
    },
    {
      id: 'offers' as AdminTab,
      label: 'Offers',
      icon: Percent,
      badge: null,
      iconColor: 'text-slate-300'
    },
    {
      id: 'settings' as AdminTab,
      label: 'Settings',
      icon: Settings,
      badge: null,
      iconColor: 'text-slate-300'
    }
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#08281d] text-slate-200 select-none overflow-y-auto custom-scrollbar border-r border-[#0d3b2b]">
      {/* Brand Header */}
      <div className="p-5 flex items-center justify-between border-b border-[#0f4432]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-950/50">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white fill-current" aria-hidden="true">
              <path d="M12 2L4 9l2 1.5L12 5l6 5.5L20 9l-8-7zm0 6l-6 5.25 1.5 1.35L12 9.5l4.5 3.1 1.5-1.35L12 8zm-8 8.5L12 22l8-5.5-2-1.5L12 19l-6-4-2 1.5z" />
            </svg>
          </div>
          <div>
            <div className="font-black text-white text-base tracking-wide flex items-center gap-1.5">
              <span>Mymensingh</span>
            </div>
            <div className="text-[11px] font-semibold text-emerald-400/80 tracking-wider">
              Admin Panel
            </div>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 lg:hidden"
            title="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectTab(item.id);
                if (onCloseMobile) onCloseMobile();
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                isActive
                  ? 'bg-[#10593e] text-white font-bold shadow-md shadow-emerald-950/40'
                  : 'text-slate-300 hover:text-white hover:bg-[#0c3627]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-transform duration-150 group-hover:scale-110 ${
                    isActive ? 'text-white' : item.iconColor
                  }`}
                />
                <span className="text-[13px]">{item.label}</span>
              </div>

              {item.badge && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-white/10 text-slate-200">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        {/* Section Divider: OTHERS */}
        <div className="pt-5 pb-1 px-3">
          <span className="text-[10px] font-extrabold tracking-wider text-emerald-500/70 uppercase">
            Others
          </span>
        </div>

        <button
          onClick={onVisitWebsite}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-[#0c3627] transition-all duration-150 group cursor-pointer"
        >
          <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400 transition-colors" />
          <span className="text-[13px]">Visit Website</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-rose-300 hover:bg-rose-950/30 transition-all duration-150 group cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400 transition-colors" />
          <span className="text-[13px]">Logout</span>
        </button>
      </div>

      {/* Scenic Brahmaputra Bridge Card at bottom */}
      <div className="p-3 mt-auto">
        <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 group">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80"
            alt="Mymensingh Brahmaputra Bridge"
            className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3">
            <h4 className="text-white font-black text-sm tracking-wide flex items-center gap-1.5">
              <span>Mymensingh</span>
            </h4>
            <p className="text-[10px] text-emerald-300 font-medium">
              People | Community | Development
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Toggled by header) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
