import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  ChevronRight,
  ChevronLeft,
  Filter,
  RotateCcw,
  Eye,
  Edit2,
  Trash2,
  Phone,
  Mail,
  Calendar,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface UserRecord {
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

const INITIAL_USERS: UserRecord[] = [
  {
    id: 'u1',
    name: 'Mehedi Hasan',
    email: 'admin@bongbangla.top',
    phone: '01712-345678',
    role: 'Admin',
    joinedDate: '28 Sep 2026',
    joinedAgo: 'Active now',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'
  }
];

export const UsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserRecord[]>(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [userFilter, setUserFilter] = useState('All Users');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPhone, setNewUserPhone] = useState('');
  const [newUserRole, setNewUserRole] = useState<'Admin' | 'User'>('User');

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
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

  const toggleSelectAll = () => {
    if (selectedIds.length === filtered.length) {
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

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const created: UserRecord = {
      id: 'u_' + Date.now(),
      name: newUserName,
      email: newUserEmail,
      phone: newUserPhone || '01700-000000',
      role: newUserRole,
      status: 'Active',
      joinedDate: '26 Sep 2026',
      joinedAgo: 'Just now',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'
    };
    setUsers([created, ...users]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserPhone('');
    setIsAddUserOpen(false);
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`Delete user account for "${name}"?`)) {
      setUsers(users.filter((u) => u.id !== id));
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
                Manage all registered users, roles and permissions.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddUserOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm shadow-emerald-700/20 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New User</span>
          </button>
        </div>
      </div>

      {/* 4 Metric KPI Cards matching media_1790620106013.jpg */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Super Admin
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Total Users</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{users.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">1 active super admin</div>
          </div>
        </div>

        {/* Admin Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Full Access
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Admin Users</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{users.filter(u => u.role === 'Admin').length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Authorized admin</div>
          </div>
        </div>

        {/* Regular Users */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Registered
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">Regular Users</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{users.filter(u => u.role === 'User').length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">General public accounts</div>
          </div>
        </div>

        {/* New This Month */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-start justify-between">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <span className="inline-flex items-center text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              New
            </span>
          </div>
          <div className="mt-4">
            <div className="text-xs font-semibold text-slate-500">New This Month</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{users.length}</div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">Platform registrations</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar matching media_1790620106013.jpg */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email or phone..."
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500 transition-colors"
          />
        </div>

        <select
          value={userFilter}
          onChange={(e) => setUserFilter(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Users</option>
          <option>Active Users</option>
          <option>Inactive Users</option>
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 outline-hidden cursor-pointer"
        >
          <option>All Roles</option>
          <option>User</option>
          <option>Admin</option>
        </select>

        <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="text-xs font-semibold text-slate-600 bg-transparent outline-hidden cursor-pointer"
          >
            <option>All Time</option>
            <option>This Week</option>
            <option>This Month</option>
            <option>This Year</option>
          </select>
        </div>

        <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all cursor-pointer">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter</span>
        </button>

        <button
          onClick={() => {
            setSearch('');
            setUserFilter('All Users');
            setRoleFilter('All Roles');
            setTimeFilter('All Time');
          }}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <h3 className="font-bold text-slate-900 text-sm mb-4">All Users (1,245)</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-100">
                <th className="pb-3 px-2">
                  <input
                    type="checkbox"
                    checked={selectedIds.length === filtered.length && filtered.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
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
              {filtered.map((u, i) => (
                <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(u.id)}
                      onChange={() => toggleSelectOne(u.id)}
                      className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </td>
                  <td className="py-3 px-2 font-medium text-slate-400">{i + 1}</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover shrink-0"
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
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        u.role === 'Admin'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-emerald-50 text-emerald-600'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[11px]">
                    <div className="font-medium text-slate-800">{u.joinedDate}</div>
                    <div className="text-[10px] text-slate-400">{u.joinedAgo}</div>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          u.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span
                        className={`text-[11px] font-semibold ${
                          u.status === 'Active' ? 'text-slate-700' : 'text-slate-500'
                        }`}
                      >
                        {u.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                        title="View Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        className="p-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                        title="Edit User"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="p-1 rounded-md bg-rose-600 hover:bg-rose-700 text-white transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4 text-xs">
          <span className="text-slate-500 font-medium">
            Showing {filtered.length} of {users.length} users
          </span>
          <div className="flex items-center gap-1 font-semibold">
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button className="px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-bold">
              1
            </button>
            <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600">
              2
            </button>
            <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600">
              3
            </button>
            <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600">
              4
            </button>
            <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600">
              5
            </button>
            <span className="px-1 text-slate-400">...</span>
            <button className="px-2.5 py-1 rounded-lg hover:bg-slate-100 text-slate-600">
              125
            </button>
            <button className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600">
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add New User</h3>
            <p className="text-xs text-slate-500 mb-4">Create a new user or administrator account.</p>

            <form onSubmit={handleAddUser} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Mehedi Hasan"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="e.g. user@bongbangla.top"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={newUserPhone}
                  onChange={(e) => setNewUserPhone(e.target.value)}
                  placeholder="e.g. 01712-345678"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as 'Admin' | 'User')}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 outline-hidden"
                >
                  <option value="User">Regular User</option>
                  <option value="Admin">Administrator (Super Admin)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
