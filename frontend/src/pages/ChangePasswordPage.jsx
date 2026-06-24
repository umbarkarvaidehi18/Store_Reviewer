import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Lock, ArrowLeft, Save } from 'lucide-react';

const ChangePasswordPage = () => {
  const { changePassword, user } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm();

  const newPasswordVal = watch('newPassword');

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await changePassword(data.oldPassword, data.newPassword);
      // Redirect based on role
      if (user?.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (user?.role === 'Store Owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/stores');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => {
    if (user?.role === 'Admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'Store Owner') {
      navigate('/owner/dashboard');
    } else {
      navigate('/stores');
    }
  };

  return (
    <div className="max-w-md mx-auto py-10 px-4">
      <button 
        onClick={handleBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition mb-6 text-sm font-medium"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>

      <div className="glass-panel rounded-2xl p-8 border border-slate-900 bg-slate-950/40 backdrop-blur-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Change Password</h2>
        <p className="text-xs text-slate-400 mb-6">
          Change your security details below.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Old Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300 block">
              Current Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="Enter current password"
                className={`pl-10 pr-4 py-2.5 w-full glass-input rounded-xl text-sm ${
                  errors.oldPassword ? 'border-rose-500/50' : ''
                }`}
                {...register('oldPassword', {
                  required: 'Current password is required'
                })}
              />
            </div>
            {errors.oldPassword && (
              <p className="text-xs text-rose-400 mt-1">{errors.oldPassword.message}</p>
            )}
          </div>

          {/* New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300 block">
              New Password <span className="text-slate-500 text-xs font-normal">(8-16 chars, 1 uppercase, 1 special)</span>
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="Enter new password"
                className={`pl-10 pr-4 py-2.5 w-full glass-input rounded-xl text-sm ${
                  errors.newPassword ? 'border-rose-500/50' : ''
                }`}
                {...register('newPassword', {
                  required: 'New password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters'
                  },
                  maxLength: {
                    value: 16,
                    message: 'Password cannot exceed 16 characters'
                  },
                  validate: {
                    hasUppercase: (value) => 
                      /[A-Z]/.test(value) || 'Password must contain at least one uppercase letter',
                    hasSpecial: (value) => 
                      /[!@#$%^&*(),.?":{}|<>]/.test(value) || 'Password must contain at least one special character'
                  }
                })}
              />
            </div>
            {errors.newPassword && (
              <p className="text-xs text-rose-400 mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300 block">
              Confirm New Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Lock size={18} />
              </span>
              <input
                type="password"
                placeholder="Confirm new password"
                className={`pl-10 pr-4 py-2.5 w-full glass-input rounded-xl text-sm ${
                  errors.confirmPassword ? 'border-rose-500/50' : ''
                }`}
                {...register('confirmPassword', {
                  required: 'Please confirm your new password',
                  validate: (value) => 
                    value === newPasswordVal || 'Passwords do not match'
                })}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-rose-400 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition shadow-lg shadow-brand-900/40 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {submitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
            ) : (
              <>
                <Save size={16} />
                <span>Save New Password</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
