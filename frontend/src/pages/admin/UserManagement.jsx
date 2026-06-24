import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import Table from '../../components/Table';
import { Plus, X, UserPlus, Shield, User as UserIcon, Tag, MapPin, Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const UserManagement = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Table State
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(1);

  // Add Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors }, watch } = useForm();
  const [submitting, setSubmitting] = useState(false);

  // Automatically open modal if redirected from dashboard shortcut
  useEffect(() => {
    if (location.state?.openAddModal) {
      setModalOpen(true);
      // Clean location state to prevent modal reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch users whenever state parameters change
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users', {
        params: {
          search,
          role,
          sortBy,
          order: sortOrder,
          page: currentPage,
          limit: 10
        }
      });
      setUsers(response.data.users);
      setTotalItems(response.data.total);
      setTotalPages(response.data.pages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error(error);
      toast.error('Failed to retrieve user accounts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search, role, sortBy, sortOrder, currentPage]);

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1); // Reset page to 1 on sort change
  };

  const handleFilterChange = (val) => {
    setRole(val);
    setCurrentPage(1); // Reset page to 1 on filter change
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1); // Reset page to 1 on search change
  };

  const handleAddUserSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post('/admin/users', data);
      toast.success('User account created successfully.');
      setModalOpen(false);
      reset();
      fetchUsers(); // Refresh table
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to create user.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Name',
      key: 'name',
      sortable: true,
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-200">{row.name}</span>
          <span className="text-xs text-slate-500 truncate max-w-xs">{row.address}</span>
        </div>
      )
    },
    {
      header: 'Email',
      key: 'email',
      sortable: true,
    },
    {
      header: 'Role',
      key: 'role',
      sortable: true,
      render: (row) => {
        let badgeStyle = 'bg-slate-900 border-slate-700 text-slate-300';
        if (row.role === 'Admin') badgeStyle = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
        if (row.role === 'Store Owner') badgeStyle = 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400';
        
        return (
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${badgeStyle}`}>
            {row.role}
          </span>
        );
      }
    },
    {
      header: 'Created At',
      key: 'createdAt',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (row) => (
        <Link 
          to={`/admin/users/${row.id}`}
          className="text-xs font-semibold text-brand-400 hover:text-brand-300 transition"
        >
          View Details
        </Link>
      )
    }
  ];

  const filterOptions = [
    { label: 'All Roles', value: '' },
    { label: 'Admin', value: 'Admin' },
    { label: 'User', value: 'User' },
    { label: 'Store Owner', value: 'Store Owner' }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">User Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin privilege to view details, create users and filter roles.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition shadow-lg shadow-brand-900/40"
        >
          <Plus size={16} />
          <span>Add User</span>
        </button>
      </div>

      {/* Main Table component */}
      <div className="glass-panel border border-slate-900 rounded-2xl p-6 bg-slate-950/20">
        <Table
          columns={columns}
          data={users}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onSearchChange={handleSearchChange}
          searchValue={search}
          searchPlaceholder="Search name or email..."
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
          filterOptions={filterOptions}
          filterValue={role}
          onFilterChange={handleFilterChange}
          filterLabel="Role"
        />
      </div>

      {/* Add User Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative w-full max-w-lg rounded-2xl glass-panel bg-slate-900 border border-slate-800 shadow-2xl p-6 animate-fade-in">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <UserPlus className="text-brand-400" size={20} />
              <h3 className="text-xl font-bold text-slate-100">Add New User</h3>
            </div>

            <form onSubmit={handleSubmit(handleAddUserSubmit)} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Full Name (20-60 characters)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <UserIcon size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter user's long name..."
                    className="pl-9 pr-4 py-2 w-full glass-input rounded-xl text-xs"
                    {...register('name', {
                      required: 'Name is required',
                      minLength: { value: 20, message: 'Name must be at least 20 characters' },
                      maxLength: { value: 60, message: 'Name cannot exceed 60 characters' }
                    })}
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    className="pl-9 pr-4 py-2 w-full glass-input rounded-xl text-xs"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
                    })}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Password (8-16 chars, 1 uppercase, 1 special)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Lock size={16} />
                  </span>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="pl-9 pr-4 py-2 w-full glass-input rounded-xl text-xs"
                    {...register('password', {
                      required: 'Password is required',
                      minLength: { value: 8, message: 'Password must be at least 8 characters' },
                      maxLength: { value: 16, message: 'Password cannot exceed 16 characters' },
                      validate: {
                        hasUppercase: (v) => /[A-Z]/.test(v) || 'Must contain at least 1 uppercase letter',
                        hasSpecial: (v) => /[!@#$%^&*(),.?":{}|<>]/.test(v) || 'Must contain at least 1 special character'
                      }
                    })}
                  />
                </div>
                {errors.password && <p className="text-xs text-rose-400">{errors.password.message}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Address (Max 400 characters)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-start pl-3 pt-2.5 pointer-events-none text-slate-400">
                    <MapPin size={16} />
                  </span>
                  <textarea
                    placeholder="Enter street address..."
                    rows={2}
                    className="pl-9 pr-4 py-2 w-full glass-input rounded-xl text-xs resize-none"
                    {...register('address', {
                      required: 'Address is required',
                      maxLength: { value: 400, message: 'Address cannot exceed 400 characters' }
                    })}
                  ></textarea>
                </div>
                {errors.address && <p className="text-xs text-rose-400">{errors.address.message}</p>}
              </div>

              {/* Role */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Role</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Tag size={16} />
                  </span>
                  <select
                    className="pl-9 pr-8 py-2 w-full glass-input rounded-xl text-xs cursor-pointer"
                    {...register('role', { required: 'Please select a role' })}
                  >
                    <option value="User" className="bg-slate-900 text-white">User</option>
                    <option value="Store Owner" className="bg-slate-900 text-white">Store Owner</option>
                    <option value="Admin" className="bg-slate-900 text-white">Admin</option>
                  </select>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition shadow-lg shadow-brand-900/40 flex items-center justify-center"
                >
                  {submitting ? (
                    <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    'Add User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
