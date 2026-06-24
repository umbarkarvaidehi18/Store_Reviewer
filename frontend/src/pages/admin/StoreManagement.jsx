import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../api/axios';
import Table from '../../components/Table';
import { Plus, X, PlusSquare, Store, MapPin, Mail, User as UserIcon } from 'lucide-react';
import { toast } from 'react-toastify';

const StoreManagement = () => {
  const location = useLocation();
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Table State
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('DESC');
  const [currentPage, setCurrentPage] = useState(1);

  // Add Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [submitting, setSubmitting] = useState(false);

  // Automatically open modal if redirected from dashboard shortcut
  useEffect(() => {
    if (location.state?.openAddModal) {
      setModalOpen(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Fetch stores
  const fetchStores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stores', {
        params: {
          search,
          sortBy,
          order: sortOrder,
          page: currentPage,
          limit: 10
        }
      });
      setStores(response.data.stores);
      setTotalItems(response.data.total);
      setTotalPages(response.data.pages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error(error);
      toast.error('Failed to retrieve stores list.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch registered store owners for the selection dropdown
  const fetchOwners = async () => {
    try {
      const response = await api.get('/admin/users', {
        params: {
          role: 'Store Owner',
          limit: 1000 // Grab all of them to build list
        }
      });
      setOwners(response.data.users || []);
    } catch (error) {
      console.error('Failed to fetch store owners', error);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search, sortBy, sortOrder, currentPage]);

  useEffect(() => {
    if (modalOpen) {
      fetchOwners();
    }
  }, [modalOpen]);

  const handleSortChange = (field, order) => {
    setSortBy(field);
    setSortOrder(order);
    setCurrentPage(1);
  };

  const handleSearchChange = (val) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleAddStoreSubmit = async (data) => {
    setSubmitting(true);
    try {
      await api.post('/admin/stores', {
        name: data.name,
        email: data.email,
        address: data.address,
        ownerId: parseInt(data.ownerId, 10)
      });
      toast.success('Store directory listing added successfully.');
      setModalOpen(false);
      reset();
      fetchStores();
    } catch (error) {
      const msg = error.response?.data?.error || 'Failed to add store.';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      header: 'Store Name',
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
      header: 'Store Owner',
      key: 'owner',
      render: (row) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-300">{row.Owner?.name || 'Unknown Owner'}</span>
          <span className="text-xs text-slate-500">{row.Owner?.email || 'N/A'}</span>
        </div>
      )
    },
    {
      header: 'Added Date',
      key: 'createdAt',
      sortable: true,
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Store Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Admin console to list new locations, search names and sort directory.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition shadow-lg shadow-brand-900/40"
        >
          <Plus size={16} />
          <span>Add Store</span>
        </button>
      </div>

      <div className="glass-panel border border-slate-900 rounded-2xl p-6 bg-slate-950/20">
        <Table
          columns={columns}
          data={stores}
          loading={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          onSearchChange={handleSearchChange}
          searchValue={search}
          searchPlaceholder="Search store name, address..."
          onSortChange={handleSortChange}
          sortBy={sortBy}
          sortOrder={sortOrder}
        />
      </div>

      {/* Add Store Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setModalOpen(false)}></div>
          <div className="relative w-full max-w-lg rounded-2xl glass-panel bg-slate-900 border border-slate-800 shadow-2xl p-6 animate-fade-in">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-850 transition"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <PlusSquare className="text-brand-400" size={20} />
              <h3 className="text-xl font-bold text-slate-100">Add Store Listing</h3>
            </div>

            <form onSubmit={handleSubmit(handleAddStoreSubmit)} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Store Name (20-60 characters)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Store size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Enter store's long name..."
                    className="pl-9 pr-4 py-2 w-full glass-input rounded-xl text-xs"
                    {...register('name', {
                      required: 'Store name is required',
                      minLength: { value: 20, message: 'Store Name must be at least 20 characters' },
                      maxLength: { value: 60, message: 'Store Name cannot exceed 60 characters' }
                    })}
                  />
                </div>
                {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Store Contact Email</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    placeholder="contact@store.com"
                    className="pl-9 pr-4 py-2 w-full glass-input rounded-xl text-xs"
                    {...register('email', {
                      required: 'Store email is required',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }
                    })}
                  />
                </div>
                {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Address (Max 400 characters)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-start pl-3 pt-2.5 pointer-events-none text-slate-400">
                    <MapPin size={16} />
                  </span>
                  <textarea
                    placeholder="Enter store physical address..."
                    rows={2.5}
                    className="pl-9 pr-4 py-2 w-full glass-input rounded-xl text-xs resize-none"
                    {...register('address', {
                      required: 'Store address is required',
                      maxLength: { value: 400, message: 'Address cannot exceed 400 characters' }
                    })}
                  ></textarea>
                </div>
                {errors.address && <p className="text-xs text-rose-400">{errors.address.message}</p>}
              </div>

              {/* Store Owner selection dropdown */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Assign Store Owner</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                    <UserIcon size={16} />
                  </span>
                  <select
                    className="pl-9 pr-8 py-2 w-full glass-input rounded-xl text-xs cursor-pointer"
                    {...register('ownerId', { required: 'Please assign a store owner' })}
                  >
                    <option value="" className="bg-slate-900 text-slate-500">-- Select Store Owner --</option>
                    {owners.map((owner) => (
                      <option key={owner.id} value={owner.id} className="bg-slate-900 text-white">
                        {owner.name} ({owner.email})
                      </option>
                    ))}
                  </select>
                </div>
                {errors.ownerId && <p className="text-xs text-rose-400">{errors.ownerId.message}</p>}
                {owners.length === 0 && (
                  <p className="text-xs text-amber-400 mt-1">
                    No Store Owners found. Create a Store Owner first under User Management.
                  </p>
                )}
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
                  disabled={submitting || owners.length === 0}
                  className="px-5 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition shadow-lg shadow-brand-900/40 flex items-center justify-center disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="h-4.5 w-4.5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  ) : (
                    'Add Store'
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

export default StoreManagement;
