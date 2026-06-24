import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import { ArrowLeft, User, Mail, MapPin, Tag, Calendar, Star, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load user details.');
        navigate('/admin/users');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!userDetails) return null;

  const ratings = userDetails.Ratings || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link 
        to="/admin/users"
        className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back to Users
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1 glass-panel border border-slate-900 rounded-2xl p-6 bg-slate-950/20 space-y-6">
          <div className="flex flex-col items-center text-center pb-4 border-b border-slate-800">
            <div className="h-20 w-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-2xl uppercase mb-3">
              {userDetails.name.substring(0, 2)}
            </div>
            <h2 className="text-xl font-bold text-slate-200 truncate max-w-full">{userDetails.name}</h2>
            <span className="text-xs text-brand-400 font-semibold mt-1 flex items-center gap-1">
              <Tag size={12} />
              {userDetails.role}
            </span>
          </div>

          <div className="space-y-4 text-sm text-slate-300">
            <div className="flex items-center gap-2.5">
              <Mail size={16} className="text-slate-400 shrink-0" />
              <span className="truncate" title={userDetails.email}>{userDetails.email}</span>
            </div>
            
            <div className="flex items-start gap-2.5">
              <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
              <span>{userDetails.address}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Calendar size={16} className="text-slate-400 shrink-0" />
              <span>Joined: {new Date(userDetails.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Rating History */}
        <div className="md:col-span-2 glass-panel border border-slate-900 rounded-2xl p-6 bg-slate-950/20 flex flex-col">
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Star className="text-amber-400 fill-amber-400" size={18} />
            Submitted Ratings ({ratings.length})
          </h3>

          <div className="flex-1 overflow-x-auto">
            {ratings.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 text-slate-500 text-sm">
                <ShieldAlert size={36} className="text-slate-600 mb-2" />
                <span>No ratings submitted by this user yet.</span>
              </div>
            ) : (
              <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950/40">
                <table className="min-w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-semibold">
                    <tr>
                      <th className="px-4 py-3">Store Name</th>
                      <th className="px-4 py-3">Rating</th>
                      <th className="px-4 py-3">Submitted On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {ratings.map((ratingVal) => (
                      <tr key={ratingVal.id} className="hover:bg-slate-900/30">
                        <td className="px-4 py-3 font-semibold text-slate-200">
                          {ratingVal.Store?.name || 'Deleted Store'}
                          <span className="text-[10px] text-slate-500 block font-normal truncate max-w-xs mt-0.5">
                            {ratingVal.Store?.address || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 text-amber-400 font-bold text-sm">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                            {ratingVal.rating}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(ratingVal.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
