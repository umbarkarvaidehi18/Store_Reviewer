import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import RatingModal from '../../components/RatingModal';
import { Star, Search, MapPin, Edit2, Plus, MessageSquarePlus } from 'lucide-react';
import { toast } from 'react-toastify';

const StoreListing = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [initialRating, setInitialRating] = useState(0);

  const fetchStores = async () => {
    try {
      const response = await api.get('/stores', {
        params: { search }
      });
      setStores(response.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load stores.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [search]);

  const handleOpenRatingModal = (store) => {
    setSelectedStore(store);
    setInitialRating(store.myRating ? store.myRating.rating : 0);
    setModalOpen(true);
  };

  const handleRatingSubmit = async (ratingVal) => {
    try {
      if (selectedStore.myRating) {
        // Edit existing rating
        await api.put(`/ratings/${selectedStore.myRating.id}`, { rating: ratingVal });
        toast.success('Your rating has been updated successfully!');
      } else {
        // Submit new rating
        await api.post('/ratings', { storeId: selectedStore.id, rating: ratingVal });
        toast.success('Your rating has been submitted successfully!');
      }
      fetchStores(); // Refresh store list to recalculate averages
    } catch (error) {
      const errorMsg = error.response?.data?.error || 'Failed to submit rating.';
      toast.error(errorMsg);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const floorRating = Math.floor(rating);
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          size={16}
          className={`shrink-0 ${
            i <= rating 
              ? 'fill-amber-400 text-amber-400' 
              : i - 0.5 <= rating 
                ? 'fill-amber-400 text-amber-400 opacity-70' // Simple half-star approximation
                : 'text-slate-700'
          }`}
        />
      );
    }
    return <div className="flex items-center gap-0.5">{stars}</div>;
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Stores & Ratings</h1>
          <p className="text-sm text-slate-400 mt-1">
            Browse registered stores, view user satisfaction metrics, and leave reviews.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stores or addresses..."
            className="pl-10 pr-4 py-2.5 w-full glass-input rounded-xl text-sm"
          />
        </div>
      </div>

      {loading ? (
        // Grid loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="glass-panel border border-slate-900 rounded-2xl p-6 h-48 animate-pulse space-y-4">
              <div className="h-6 bg-slate-800 rounded w-2/3"></div>
              <div className="h-4 bg-slate-800 rounded w-1/2"></div>
              <div className="h-4 bg-slate-800 rounded w-3/4"></div>
              <div className="h-10 bg-slate-800 rounded mt-4"></div>
            </div>
          ))}
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-20 glass-panel border border-slate-900 rounded-2xl bg-slate-950/20">
          <MapPin size={48} className="mx-auto text-slate-600 mb-3" />
          <h3 className="text-xl font-bold text-slate-400">No stores found</h3>
          <p className="text-xs text-slate-500 mt-1">Try refining your search keyword</p>
        </div>
      ) : (
        // Stores Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div 
              key={store.id} 
              className="glass-panel border border-slate-900 rounded-2xl p-6 bg-slate-950/20 flex flex-col justify-between hover:border-brand-500/20 transition-all duration-300 group"
            >
              <div className="space-y-3">
                {/* Store Name & Address */}
                <div>
                  <h3 className="text-xl font-bold text-slate-200 group-hover:text-white transition duration-150 line-clamp-1">
                    {store.name}
                  </h3>
                  <div className="flex items-start gap-1.5 text-slate-400 mt-1 text-xs">
                    <MapPin size={14} className="shrink-0 mt-0.5 text-slate-500" />
                    <span className="line-clamp-2">{store.address}</span>
                  </div>
                </div>

                {/* Rating Info */}
                <div className="flex items-center gap-3 pt-1">
                  <div className="flex flex-col">
                    <span className="text-2xl font-black text-slate-200">
                      {store.averageRating > 0 ? store.averageRating : 'N/A'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      ({store.totalRatings} reviews)
                    </span>
                  </div>
                  <div className="h-8 w-[1px] bg-slate-800"></div>
                  <div className="space-y-1">
                    {renderStars(store.averageRating)}
                    <span className="text-[10px] text-slate-400 block font-medium">
                      Average Rating
                    </span>
                  </div>
                </div>

                {/* User's Specific Rating */}
                <div className="pt-2 border-t border-slate-900 flex items-center justify-between text-xs">
                  <span className="text-slate-500">My Rating:</span>
                  {store.myRating ? (
                    <span className="font-semibold text-amber-400 flex items-center gap-1">
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                      {store.myRating.rating} / 5
                    </span>
                  ) : (
                    <span className="text-slate-600 font-medium italic">Not Rated Yet</span>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-6">
                <button
                  onClick={() => handleOpenRatingModal(store)}
                  className={`w-full py-2.5 px-4 text-xs font-semibold rounded-xl transition duration-150 flex items-center justify-center gap-1.5 ${
                    store.myRating 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600'
                      : 'bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/20'
                  }`}
                >
                  {store.myRating ? (
                    <>
                      <Edit2 size={13} />
                      <span>Edit Rating</span>
                    </>
                  ) : (
                    <>
                      <MessageSquarePlus size={14} />
                      <span>Submit Rating</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable rating modal */}
      <RatingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleRatingSubmit}
        storeName={selectedStore?.name}
        initialRating={initialRating}
      />
    </div>
  );
};

export default StoreListing;
