import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Star, Store, Users, MapPin, Mail, Calendar, ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';

const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/owner/dashboard');
        setData(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to retrieve owner dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) return null;

  const cardDetails = [
    {
      title: 'Overall Rating',
      value: data.overallAverageRating > 0 ? data.overallAverageRating : 'N/A',
      subtext: 'Across all owned stores',
      icon: Star,
      color: 'from-amber-600/20 to-orange-600/20 text-amber-400 border-amber-500/20'
    },
    {
      title: 'Total Reviews',
      value: data.overallTotalRatings,
      subtext: 'Total reviews submitted',
      icon: Users,
      color: 'from-blue-600/20 to-cyan-600/20 text-blue-400 border-blue-500/20'
    },
    {
      title: 'Owned Locations',
      value: data.totalStoresOwned,
      subtext: 'Active stores in system',
      icon: Store,
      color: 'from-indigo-600/20 to-purple-600/20 text-indigo-400 border-indigo-500/20'
    }
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Owner Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review customer ratings and inspect user review logs for your listed stores.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cardDetails.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className={`glass-panel border p-6 rounded-2xl flex items-center justify-between bg-gradient-to-br ${card.color} shadow-xl`}
            >
              <div className="space-y-2">
                <span className="text-sm font-semibold text-slate-300 block">{card.title}</span>
                <span className="text-4xl font-bold block">{card.value}</span>
                <span className="text-[10px] text-slate-400 block font-medium">{card.subtext}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-xl border border-white/5">
                <Icon size={28} className={card.title === 'Overall Rating' && data.overallAverageRating > 0 ? 'fill-amber-400' : ''} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Stores Listings and Reviews Sections */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-200">My Stores Directory</h2>
        
        {data.stores.length === 0 ? (
          <div className="text-center py-16 glass-panel border border-slate-900 rounded-2xl bg-slate-950/20">
            <Store size={40} className="mx-auto text-slate-600 mb-2" />
            <h3 className="text-lg font-bold text-slate-400">No stores linked</h3>
            <p className="text-xs text-slate-500 mt-1">Contact system administration to allocate stores to your account.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.stores.map((store) => (
              <div 
                key={store.id} 
                className="glass-panel border border-slate-900 rounded-2xl p-6 bg-slate-950/10 space-y-6"
              >
                {/* Store Header Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-900">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-slate-200">{store.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin size={12} className="text-slate-500" />
                      <span>{store.address}</span>
                      <span className="text-slate-700">|</span>
                      <Mail size={12} className="text-slate-500" />
                      <span>{store.email}</span>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-center">
                    <span className="text-sm font-semibold text-slate-400">Store Average:</span>
                    <span className="text-lg font-black text-amber-400 flex items-center gap-1">
                      <Star size={16} className="fill-amber-400 text-amber-400" />
                      {store.averageRating > 0 ? store.averageRating : '0.0'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">({store.totalRatings} ratings)</span>
                  </div>
                </div>

                {/* Sub Table: Users who rated store */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-slate-400">Reviews & User Details</h4>
                  
                  {store.reviews.length === 0 ? (
                    <p className="text-xs text-slate-500 italic py-2 pl-1">
                      No customer reviews submitted for this location yet.
                    </p>
                  ) : (
                    <div className="overflow-x-auto border border-slate-900 rounded-xl bg-slate-950/30">
                      <table className="min-w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-900/60 text-slate-400 uppercase font-semibold">
                          <tr>
                            <th className="px-4 py-3">Customer Name</th>
                            <th className="px-4 py-3">Email Address</th>
                            <th className="px-4 py-3">Rating Provided</th>
                            <th className="px-4 py-3">Date Submitted</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-900">
                          {store.reviews.map((rev) => (
                            <tr key={rev.id} className="hover:bg-slate-900/20 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-200">
                                {rev.user?.name}
                              </td>
                              <td className="px-4 py-3 text-slate-400">
                                {rev.user?.email}
                              </td>
                              <td className="px-4 py-3">
                                <span className="flex items-center gap-1 font-bold text-amber-400 text-sm">
                                  <Star size={12} className="fill-amber-400 text-amber-400" />
                                  {rev.rating}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-500">
                                {new Date(rev.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
