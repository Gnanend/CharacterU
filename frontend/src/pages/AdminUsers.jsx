import { useState, useEffect, useCallback } from 'react';
import { 
  Search, Filter, RefreshCw, Download, MoreVertical, 
  Eye, Edit, UserX, UserCheck, Trash2, X, AlertTriangle, Shield, Award, BookOpen, Heart, Star, CheckCircle
} from 'lucide-react';
import adminService from '../services/adminService';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('newest');

  // Drawers & Dialogs
  const [viewUser, setViewUser] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        page: pagination.page,
        limit: 10,
        search: debouncedSearch,
        role,
        status,
        sort
      });
      console.log("AdminUsers received res:", res);

      // Handle multiple possible JSON shapes from the backend and Axios
      const payload = res?.data?.users ? res.data : (res?.users ? res : (res?.data?.data ? res.data.data : null));
      
      if (payload && Array.isArray(payload.users)) {
        console.log("Users received in component:", payload.users);
        setUsers(payload.users);
        setPagination(payload.pagination || { page: 1, total: 0, pages: 1 });
      } else {
        console.warn("API response did not contain a valid users array.");
        setUsers([]);
      }
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, debouncedSearch, role, status, sort]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleStatusToggle = async (userId, currentStatus) => {
    const action = currentStatus === 'active' ? 'suspend' : 'activate';
    try {
      await adminService.toggleUserStatus(userId, action);
      toast.success(`User ${action}d successfully`);
      fetchUsers();
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await adminService.deleteUser(userId);
      toast.success('User deleted successfully');
      setDeleteConfirm(null);
      fetchUsers();
    } catch (error) {
      toast.error(error?.message || 'Failed to delete user');
      setDeleteConfirm(null);
    }
  };

  const handleExportCSV = () => {
    // Simple CSV export based on current view
    const headers = ['Name', 'Email', 'Role', 'Status', 'Score', 'Joined'];
    const csvContent = [
      headers.join(','),
      ...users.map(u => [
        `"${u.fullName || ''}"`,
        `"${u.email}"`,
        u.role,
        u.status,
        u.characterScore,
        new Date(u.createdAt).toISOString().split('T')[0]
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'characteru_users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">User Management</h1>
          <p className="text-slate-400 mt-1">Manage and monitor CharacterU students and staff.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchUsers()} 
            className="p-2.5 rounded-lg bg-dark-800 hover:bg-dark-700 text-slate-300 transition-colors border border-dark-700"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-medium transition-colors"
          >
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      {/* TOP BAR - FILTERS */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl p-4 flex flex-wrap gap-4 items-center shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input 
            type="text" 
            placeholder="Search name, email..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-dark-800 border border-dark-700 rounded-lg text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        
        <select 
          value={role} onChange={(e) => { setRole(e.target.value); setPagination(p => ({...p, page: 1})) }}
          className="bg-dark-800 border border-dark-700 text-slate-200 py-2.5 px-4 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="admin">Admin</option>
        </select>

        <select 
          value={status} onChange={(e) => { setStatus(e.target.value); setPagination(p => ({...p, page: 1})) }}
          className="bg-dark-800 border border-dark-700 text-slate-200 py-2.5 px-4 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
        </select>

        <select 
          value={sort} onChange={(e) => { setSort(e.target.value); setPagination(p => ({...p, page: 1})) }}
          className="bg-dark-800 border border-dark-700 text-slate-200 py-2.5 px-4 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highestScore">Highest Score</option>
          <option value="lowestScore">Lowest Score</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-dark-900 border border-dark-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark-800/50 border-b border-dark-800 text-slate-400 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Score</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-800">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-6 py-4"><div className="h-10 w-48 bg-dark-800 rounded-lg"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-20 bg-dark-800 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-12 bg-dark-800 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-dark-800 rounded-full"></div></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-dark-800 rounded-lg"></div></td>
                    <td className="px-6 py-4"><div className="h-8 w-8 bg-dark-800 rounded-lg ml-auto"></div></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id} className="hover:bg-dark-800/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-dark-800 flex items-center justify-center text-primary-400 font-bold overflow-hidden shrink-0">
                          {user.avatar ? <img src={user.avatar} alt={user.fullName} className="w-full h-full object-cover" /> : (user.fullName || user.username || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-200">{user.fullName || user.username}</p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-orange-400 font-medium">
                        <Star className="w-4 h-4" /> {user.characterScore}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right relative">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewUser(user._id)} className="p-2 text-slate-400 hover:text-primary-400 hover:bg-primary-400/10 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditUser(user)} className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors" title="Edit User">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleStatusToggle(user._id, user.status || 'active')} 
                          className={`p-2 rounded-lg transition-colors ${
                            user.status === 'suspended' ? 'text-green-400 hover:bg-green-400/10' : 'text-orange-400 hover:bg-orange-400/10'
                          }`}
                          title={user.status === 'suspended' ? 'Activate User' : 'Suspend User'}
                        >
                          {user.status === 'suspended' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                        <button onClick={() => setDeleteConfirm(user)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete User">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-dark-800 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing page <span className="font-medium text-white">{pagination.page}</span> of <span className="font-medium text-white">{pagination.pages}</span>
            </p>
            <div className="flex gap-2">
              <button 
                disabled={pagination.page === 1}
                onClick={() => setPagination(p => ({...p, page: p.page - 1}))}
                className="px-3 py-1.5 rounded-lg bg-dark-800 text-slate-300 disabled:opacity-50 hover:bg-dark-700 transition-colors text-sm font-medium"
              >
                Previous
              </button>
              <button 
                disabled={pagination.page === pagination.pages}
                onClick={() => setPagination(p => ({...p, page: p.page + 1}))}
                className="px-3 py-1.5 rounded-lg bg-dark-800 text-slate-300 disabled:opacity-50 hover:bg-dark-700 transition-colors text-sm font-medium"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* VIEW USER DRAWER */}
      {viewUser && <ViewUserDrawer userId={viewUser} onClose={() => setViewUser(null)} />}
      
      {/* EDIT USER DRAWER */}
      {editUser && <EditUserDrawer user={editUser} onClose={() => setEditUser(null)} onRefresh={fetchUsers} />}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-dark-900 border border-dark-800 rounded-2xl w-full max-w-md p-6 shadow-xl transform animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 text-red-500 mb-4">
              <div className="p-3 bg-red-500/10 rounded-full">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-white">Delete User?</h3>
            </div>
            <p className="text-slate-400 mb-6">
              Are you sure you want to delete <span className="text-white font-medium">{deleteConfirm.fullName || deleteConfirm.email}</span>? This action will suspend their account and mark it as deleted.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg bg-dark-800 text-slate-300 hover:bg-dark-700 font-medium transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDelete(deleteConfirm._id)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 font-medium transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponents for Drawers
const ViewUserDrawer = ({ userId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await adminService.getUserById(userId);
        if (res?.data) setData(res.data);
      } catch (err) {
        toast.error("Failed to load user details");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [userId, onClose]);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-dark-900 border-l border-dark-800 shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out">
        <div className="sticky top-0 bg-dark-900/90 backdrop-blur-md border-b border-dark-800 p-4 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-white">User Profile</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-dark-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {loading ? (
          <div className="p-6 space-y-6 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-dark-800 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-5 w-32 bg-dark-800 rounded"></div>
                <div className="h-4 w-48 bg-dark-800 rounded"></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-dark-800 rounded-xl"></div>
              <div className="h-24 bg-dark-800 rounded-xl"></div>
            </div>
          </div>
        ) : data ? (
          <div className="p-6 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center text-primary-400 font-bold text-xl overflow-hidden shrink-0 border border-dark-700">
                {data.avatar ? <img src={data.avatar} alt="Avatar" className="w-full h-full object-cover" /> : (data.fullName || data.username || '?').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{data.fullName || 'No Name Provided'}</h3>
                <p className="text-sm text-slate-400">{data.email}</p>
                <div className="flex gap-2 mt-2">
                  <span className="text-xs bg-dark-800 text-slate-300 px-2 py-0.5 rounded border border-dark-700">{data.role}</span>
                  <span className={`text-xs px-2 py-0.5 rounded border ${data.status === 'suspended' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20'}`}>
                    {data.status || 'active'}
                  </span>
                </div>
              </div>
            </div>
            
            {data.bio && (
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Biography</h4>
                <p className="text-sm text-slate-300 bg-dark-800/50 p-4 rounded-xl border border-dark-800 leading-relaxed">{data.bio}</p>
              </div>
            )}

            <div>
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Statistics</h4>
              <div className="grid grid-cols-2 gap-3">
                <StatMini icon={Star} label="Character Score" value={data.characterScore} color="text-orange-400" />
                <StatMini icon={CheckCircle} label="Check-ins" value={data.stats?.checkIns} color="text-teal-400" />
                <StatMini icon={BookOpen} label="Courses" value={data.stats?.coursesCompleted} color="text-indigo-400" />
                <StatMini icon={Award} label="Certificates" value={data.stats?.certificatesIssued} color="text-yellow-400" />
                <StatMini icon={Heart} label="Deeds" value={data.stats?.communityDeeds} color="text-rose-400" />
                <StatMini icon={Shield} label="Pledges" value={data.stats?.pledgesSubmitted} color="text-blue-400" />
              </div>
            </div>
            
            <div className="pt-4 border-t border-dark-800 text-xs text-slate-500 space-y-1">
              <p>ID: {data._id}</p>
              <p>Joined: {new Date(data.createdAt).toLocaleString()}</p>
              <p>Last Updated: {new Date(data.updatedAt).toLocaleString()}</p>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

const StatMini = ({ icon: Icon, label, value, color }) => (
  <div className="bg-dark-800 p-3 rounded-xl border border-dark-700 flex items-center gap-3">
    <div className={`p-2 bg-dark-900 rounded-lg ${color}`}>
      <Icon className="w-4 h-4" />
    </div>
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="text-sm font-bold text-white">{value ?? 0}</p>
    </div>
  </div>
);

const EditUserDrawer = ({ user, onClose, onRefresh }) => {
  const [formData, setFormData] = useState({
    fullName: user.fullName || '',
    role: user.role || 'student',
    status: user.status || 'active',
    bio: user.bio || '',
    avatar: user.avatar || ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) {
      setErrors({ fullName: 'Name is required' });
      return;
    }

    setIsSubmitting(true);
    try {
      await adminService.updateUser(user._id, formData);
      toast.success('User updated successfully');
      onRefresh();
      onClose();
    } catch (err) {
      toast.error(err?.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={onClose}></div>
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-dark-900 border-l border-dark-800 shadow-2xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out">
        <div className="sticky top-0 bg-dark-900/90 backdrop-blur-md border-b border-dark-800 p-4 flex items-center justify-between z-10 shrink-0">
          <h2 className="text-lg font-bold text-white">Edit User</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-dark-800 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <form id="edit-user-form" onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Full Name</label>
              <input 
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none" 
              />
              {errors.fullName && <p className="text-red-400 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Role</label>
                <select 
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="student">Student</option>
                  <option value="admin">Admin</option>
                  <option value="employer">Employer</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Avatar URL</label>
              <input 
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Biography</label>
              <textarea 
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-2.5 bg-dark-800 border border-dark-700 rounded-xl text-white focus:ring-2 focus:ring-primary-500 outline-none resize-none" 
              ></textarea>
            </div>
          </form>
        </div>

        <div className="p-4 border-t border-dark-800 bg-dark-900 shrink-0 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-dark-800 text-slate-300 hover:bg-dark-700 font-medium transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            form="edit-user-form"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-500 font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
};
