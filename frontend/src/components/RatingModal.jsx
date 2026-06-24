import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';

const RatingModal = ({ isOpen, onClose, onSubmit, storeName, initialRating = 0 }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRating(initialRating);
    }
  }, [isOpen, initialRating]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      alert('Please select a rating between 1 and 5');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit(rating);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl glass-panel bg-slate-900 border border-slate-800 shadow-2xl p-6 overflow-hidden animate-fade-in">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-850 transition"
        >
          <X size={18} />
        </button>

        <h3 className="text-xl font-bold text-slate-100 pr-8">
          {initialRating > 0 ? 'Edit Your Rating' : 'Submit a Rating'}
        </h3>
        <p className="text-xs text-brand-400 mt-1 font-medium truncate">
          For: {storeName}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col items-center gap-6">
          {/* Stars Selection */}
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-600 hover:scale-110 transition duration-150 focus:outline-none"
                >
                  <Star
                    size={36}
                    className={`transition-colors duration-150 ${
                      isActive 
                        ? 'fill-amber-400 text-amber-400' 
                        : 'text-slate-700'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="text-sm font-semibold text-slate-300">
            {rating > 0 ? `Select ${rating} out of 5 stars` : 'Select your rating'}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end w-full mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={rating === 0 || submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition shadow-lg shadow-brand-900/40 disabled:bg-slate-800 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed flex items-center justify-center"
            >
              {submitting ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                'Submit Rating'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
