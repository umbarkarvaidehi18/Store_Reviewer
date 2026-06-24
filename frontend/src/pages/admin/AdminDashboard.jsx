import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { Users, Store, Star, ArrowRight, UserPlus, PlusSquare } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
        toast.error('Could not load dashboard statistics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const cardDetails = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'from-blue-600/20 to-cyan-600/20 text-blue-400 border-blue-500/20',
      link: '/admin/users'
    },
    {
      title: 'Total Stores',
      value: stats.totalStores,
      icon: Store,
      color: 'from-indigo-600/20 to-purple-600/20 text-indigo-400 border-indigo-500/20',
      link: '/admin/stores'
    },
    {
      title: 'Total Ratings Submitted',
      value: stats.totalRatings,
      icon: Star,
      color: 'from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/20',
      link: null
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Admin Console</h1>
        <p className="text-sm text-slate-400 mt-1">
          Monitor users, analyze store metrics, and manage directory listings.
        </p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardDetails.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className={`glass-panel border p-6 rounded-2xl flex items-center justify-between bg-gradient-to-br ${card.color} shadow-xl`}
            >
              <div className="space-y-2">
                <span className="text-sm font-medium text-slate-300 block">{card.title}</span>
                {loading ? (
                  <div className="h-9 w-16 bg-slate-800 animate-pulse rounded-lg"></div>
                ) : (
                  <span className="text-4xl font-bold block">{card.value}</span>
                )}
                {card.link && (
                  <Link 
                    to={card.link}
                    className="text-xs font-semibold flex items-center gap-1 mt-2 hover:underline hover:text-white transition duration-150"
                  >
                    Manage List <ArrowRight size={12} />
                  </Link>
                )}
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <Icon size={28} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Actions Panel */}
      <div className="glass-panel border border-slate-900 rounded-2xl p-6 bg-slate-950/20">
        <h2 className="text-xl font-bold text-slate-200 mb-4">Quick Operations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link 
            to="/admin/users"
            state={{ openAddModal: true }}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-900 hover:border-brand-500/30 hover:bg-brand-500/5 transition duration-200 group"
          >
            <div className="p-2.5 bg-brand-500/10 rounded-lg text-brand-400 group-hover:scale-110 transition duration-200">
              <UserPlus size={22} />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block text-sm">Add New User</span>
              <span className="text-xs text-slate-400">Register administrators, customers or owners.</span>
            </div>
          </Link>

          <Link 
            to="/admin/stores"
            state={{ openAddModal: true }}
            className="flex items-center gap-4 p-4 rounded-xl border border-slate-900 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition duration-200 group"
          >
            <div className="p-2.5 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:scale-110 transition duration-200">
              <PlusSquare size={22} />
            </div>
            <div>
              <span className="font-semibold text-slate-200 block text-sm">Add New Store</span>
              <span className="text-xs text-slate-400">List a physical location linked to an owner.</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
