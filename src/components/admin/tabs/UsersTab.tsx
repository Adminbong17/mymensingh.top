import React, { useState, useMemo, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Search,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  UserCheck,
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

export interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'User' | 'Admin';
  joinedDate: string;
  joinedAgo: string;
  status: 'Active' | 'Inactive';
  avatar: string;
}

const STORAGE_USERS_KEY = 'mymensingh_registered_users_v2';

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'u-super-admin',
    name: 'Mehedi Hasan',
    email: 'admin@bongbangla.top',
    phone: '01712-345678',
    role: 'Admin',
    joinedDate: '28 Sep 2026',
    joinedAgo: 'Active now',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'
  },
  {
    id: 'u-system-admin',
    name: 'System Admin',
    email: 'admin@mymensingh.top',
    phone: '01700-000000',
    role: 'Admin',
    joinedDate: '28 Sep 2026',
    joinedAgo: 'Active now',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80'
  }
];

export const UsersTab: React.FC = () => {
  const { addAdminEmail } = useAuth();

  const [users, setUsers] = useState<UserRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USERS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Make sure admin@bongbangla.top is always present
          const hasSuper = parsed.some(u => u.email.toLowerCase() === 'admin@bongbangla.top');
          if (!hasSuper) {
            return [INITIAL_USERS[0], ...parsed];
          }
          return parsed;
        }
      }
    } catch {}
    return INITIAL_USERS;
  });

  // Auto-persist users to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch {}
  }, [users]);

  // Filters
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('All Users');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Modals state
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<UserRecord | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState<'Admin' | 'User'>('User');
  const [formStatus, setFormStatus] = useState<'Active' | 'Inactive'>('Active');

  // Filtered List
  const filtered = useMemo(() => {
    return users.filter((u) => {
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q);

      const matchRole =
        roleFilter === 'All Roles' ||
        u.role === roleFilter;

      const matchUserType =
        userFilter === 'All Users' ||
        (userFilter === 'Active Users' ? u.status === 'Active' : u.status === 'Inactive');

      return matchSearch && matchRole && matchUserType;
    });
  }, [users, search, roleFilter, userFilter]);

  // Paginated List
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length && filtered.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filtered.map((u) => u.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormRole('User');
    setFormStatus('Active');
    setIsAddUserOpen(true);
  };

  // Add User Submit
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formEmail.trim()) return;

    const emailClean = formEmail.trim().toLowerCase();
    const existing = users.find(u => u.email.toLowerCase() === emailClean);
    if (existing) {
      alert('এই ইমেইল দিয়ে ইতোমধ্যে একজন ব্যবহারকারী তালিকাভুক্ত আছেন।');
      return;
    }

    const created: UserRecord = {
      id: 'u_' + Date.now(),
      name: formName.trim(),
      email: emailClean,
      phone: formPhone.trim() || '01700-000000',
      role: formRole,
      status: formStatus,
      joinedDate: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      joinedAgo: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'
    };

    setUsers([created, ...users]);
    if (formRole === 'Admin') {
      addAdminEmail(emailClean);
    }
    setIsAddUserOpen(false);
  };

  // Open Edit Modal
  const handleOpenEditModal = (u: UserRecord) => {
    setActiveUser(u);
    setFormName(u.name);
    setFormEmail(u.email);
    setFormPhone(u.phone);
    setFormRole(u.role);
    setFormStatus(u.status);
    setIsEditUserOpen(true);
  };

  // Edit User Submit
  const handleEditUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) return;

    const updatedRole = activeUser.email.toLowerCase() === 'admin@bongbangla.top' ? 'Admin' : formRole;

    setUsers(prev =>
      prev.map(u =>
        u.id === activeUser.id
          ? {
              ...u,
              name: formName.trim(),
              phone: formPhone.trim(),
              role: updatedRole,
              status: formStatus,
            }
          : u
      )
    );

    if (updatedRole === 'Admin') {
      addAdminEmail(activeUser.email);
    }

    setIsEditUserOpen(false);
    if (isViewUserOpen && activeUser) {
      setActiveUser({
        ...activeUser,
        name: formName.trim(),
        phone: formPhone.trim(),
        role: updatedRole,
        status: formStatus
      });
    }
  };

  // Open View Modal
  const handleOpenViewModal = (u: UserRecord) => {
    setActiveUser(u);
    setIsViewUserOpen(true);
  };

  // Delete User
  const handleDeleteUser = (id: string, email: string, name: string) => {
    if (email.toLowerCase() === 'admin@bongbangla.top') {
      alert('সুপার অ্যাডমিন অ্যাকাউন্ট মুছে ফেলা সম্ভব নয়।');
      return;
    }

    if (window.confirm(`Delete user account for "${name}" (${email})?`)) {
      setUsers(prev => prev.filter((u) => u.id !== id));
      setSelectedIds(prev => prev.filter(i => i !== id));
      if (activeUser?.id === id) {
        setIsViewUserOpen(false);
      }
    }
  };

  // Quick Toggle Status
  const handleToggleStatus = (u: UserRecord) => {
    if (u.email.toLowerCase() === 'admin@bongbangla.top') {
      alert('সুপার অ্যাডমিন সবসময় Active থাকবে।');
      return;
    }
    const newStatus = u.status === 'Active' ? 'Inactive' : 'Active';
    setUsers(prev =>
      prev.map(item => (item.id === u.id ? { ...item, status: newStatus } : item))
    );
    if (activeUser?.id === u.id) {
      setActiveUser({ ...activeUser, status: newStatus });
    }
  };

  // Quick Toggle Role
  const handleToggleRole = (u: UserRecord) => {
    if (u.email.toLowerCase() === 'admin@bongbangla.top') {
      alert('সুপার অ্যাডমিনের ভূমিকা পরিবর্তন করা সম্ভব নয়।');
      return;
    }
    const newRole = u.role === 'Admin' ? 'User' : 'Admin';
    setUsers(prev =>
      prev.map(item => (item.id === u.id ? { ...item, role: newRole } : item))
    );
    if (newRole === 'Admin') {
      addAdminEmail(u.email);
    }
    if (activeUser?.id === u.id) {
      setActiveUser({ ...activeUser, role: newRole });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Header */}
      <div>
        <div className="text-xs text-slate-400 font-semibold mb-1 flex items-center gap-1.5">
          <span>Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800">Users</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Users Management
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Manage registered user accounts, roles and permissions.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Registered
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Users</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{users.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">সর্বমোট ব্যবহারকারী</div>
          </div>
        </div>

        {/* Admin Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Authorized
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Admin Users</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{users.filter(u => u.role === 'Admin').length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">অ্যাডমিন অ্যাক্সেস</div>
          </div>
        </div>

        {/* Regular Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Members
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Regular Users</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{users.filter(u => u.role === 'User').length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">সাধারণ সদস্য</div>
          </div>
        </div>

        {/* Active Now */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Active Accounts</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{users.filter(u => u.status === 'Active').length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">সক্রিয় অ্যাকাউন্ট</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            placeholder="Search name, email or phone..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <select
          value={userFilter}
          onChange={(e) => { setUserFilter(e.target.value); setCurrentPage(1); }}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Users</option>
          <option>Active Users</option>
          <option>Inactive Users</option>
        </select>

        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setCurrentPage(1); }}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Roles</option>
          <option>User</option>
          <option>Admin</option>
        </select>

        <button
          onClick={() => {
            setSearch('');
            setUserFilter('All Users');
            setRoleFilter('All Roles');
            setCurrentPage(1);
          }}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-slate-900 text-sm">
            All Users ({filtered.length})
          </h3>
          <span className="text-xs text-slate-400">Page {currentPage} of {totalPages}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <th className="pb-3 px-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                </th>
                <th className="pb-3 px-2">#</th>
                <th className="pb-3 px-3">User</th>
                <th className="pb-3 px-3">Contact Info</th>
                <th className="pb-3 px-3">Role</th>
                <th className="pb-3 px-3">Joined At</th>
                <th className="pb-3 px-3">Status</th>
                <th className="pb-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {paginatedUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-8 h-8 text-slate-300 stroke-1" />
                      <p className="font-semibold text-slate-600 text-sm">কোনো ব্যবহারকারী পাওয়া যায়নি</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((u, i) => {
                  const absoluteIndex = (currentPage - 1) * itemsPerPage + i;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(u.id)}
                          onChange={() => toggleSelectOne(u.id)}
                          className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-2 font-medium text-slate-400">{absoluteIndex + 1}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 bg-slate-100"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{u.name}</div>
                            <div className="text-[10px] text-slate-400">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="space-y-0.5 text-[11px] text-slate-600">
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-3 h-3 text-slate-400" />
                            <span>{u.phone}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleRole(u)}
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full transition-all cursor-pointer ${
                            u.role === 'Admin'
                              ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                          }`}
                          title="Click to toggle role"
                        >
                          {u.role}
                        </button>
                      </td>
                      <td className="py-3 px-3 text-[11px]">
                        <div className="font-medium text-slate-800">{u.joinedDate}</div>
                        <div className="text-[10px] text-slate-400">{u.joinedAgo}</div>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          onClick={() => handleToggleStatus(u)}
                          className="flex items-center gap-1.5 cursor-pointer hover:opacity-80"
                          title="Click to toggle status"
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                          <span
                            className={`text-[11px] font-semibold ${
                              u.status === 'Active' ? 'text-emerald-700' : 'text-rose-600'
                            }`}
                          >
                            {u.status}
                          </span>
                        </button>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenViewModal(u)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                            title="View Profile"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEditModal(u)}
                            className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                            title="Edit User"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id, u.email, u.name)}
                            disabled={u.email.toLowerCase() === 'admin@bongbangla.top'}
                            className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors disabled:opacity-30 cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Interactive Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs">
          <span className="text-slate-500 font-medium">
            Showing {paginatedUsers.length} of {filtered.length} users
          </span>
          <div className="flex items-center gap-1 font-semibold">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === page
                    ? 'bg-emerald-700 text-white'
                    : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* ADD USER MODAL */}
      {/* =================================================================== */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Add New User</h3>
                  <p className="text-xs text-slate-400">Create a new user or administrator account</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Shakil Ahmed"
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  placeholder="user@example.com"
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="017XX-XXXXXX"
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="User">Regular User</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* EDIT USER MODAL */}
      {/* =================================================================== */}
      {isEditUserOpen && activeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Edit User Profile</h3>
                  <p className="text-xs text-slate-400">{activeUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditUserOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditUserSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    disabled={activeUser.email.toLowerCase() === 'admin@bongbangla.top'}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 disabled:opacity-50 cursor-pointer"
                  >
                    <option value="User">Regular User</option>
                    <option value="Admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Account Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    disabled={activeUser.email.toLowerCase() === 'admin@bongbangla.top'}
                    className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 disabled:opacity-50 cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditUserOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW USER PROFILE MODAL */}
      {/* =================================================================== */}
      {isViewUserOpen && activeUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-black text-slate-900 text-base">User Details</h3>
              <button
                onClick={() => setIsViewUserOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500/20 p-0.5 bg-slate-50"
              />
              <div className="space-y-1">
                <h4 className="font-black text-slate-900 text-lg">{activeUser.name}</h4>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeUser.role === 'Admin'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {activeUser.role}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      activeUser.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-rose-50 text-rose-700'
                    }`}
                  >
                    {activeUser.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-xs text-slate-700 border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Email:</span>
                <span className="font-bold">{activeUser.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Phone:</span>
                <span className="font-bold">{activeUser.phone}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Joined:</span>
                <span className="font-bold">{activeUser.joinedDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Status:</span>
                <span className="font-bold">{activeUser.status}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => handleToggleRole(activeUser)}
                disabled={activeUser.email.toLowerCase() === 'admin@bongbangla.top'}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {activeUser.role === 'Admin' ? 'Demote to User' : 'Make Admin'}
              </button>
              <button
                onClick={() => handleToggleStatus(activeUser)}
                disabled={activeUser.email.toLowerCase() === 'admin@bongbangla.top'}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
              >
                {activeUser.status === 'Active' ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => {
                  setIsViewUserOpen(false);
                  handleOpenEditModal(activeUser);
                }}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
