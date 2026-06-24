import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, User as UserIcon, MapPin, Tag, Star, ArrowRight } from 'lucide-react';

const SignupPage = () => {
  const { register: signup } = useContext(AuthContext);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const user = await signup(
        data.name,
        data.email,
        data.password,
        data.address,
        data.role
      );
      // Redirect based on role
      if (user.role === 'Store Owner') {
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

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-lg animate-fade-in relative z-10 my-8">
        {/* Logo/Branding */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="h-11 w-11 rounded-2xl bg-brand-600/25 flex items-center justify-center border border-brand-500/30">
            <Star className="text-brand-400 fill-brand-400" size={24} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-300 via-indigo-300 to-indigo-400 bg-clip-text text-transparent">
            Create an Account
          </h2>
          <p className="text-sm text-slate-400">
            Join us to review stores and explore rating statistics
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-900 bg-slate-950/40 backdrop-blur-lg shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 block">
                Full Name <span className="text-slate-500 text-xs font-normal">(20-60 characters)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <UserIcon size={18} />
                </span>
                <input
                  type="text"
                  placeholder="E.g., Jonathan Richard Doe Harrison"
                  className={`pl-10 pr-4 py-2.5 w-full glass-input rounded-xl text-sm ${
                    errors.name ? 'border-rose-500/50' : ''
                  }`}
                  {...register('name', {
                    required: 'Full name is required',
                    minLength: {
                      value: 20,
                      message: 'Name must be at least 20 characters'
                    },
                    maxLength: {
                      value: 60,
                      message: 'Name cannot exceed 60 characters'
                    }
                  })}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-rose-400 mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 block">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  placeholder="name@example.com"
                  className={`pl-10 pr-4 py-2.5 w-full glass-input rounded-xl text-sm ${
                    errors.email ? 'border-rose-500/50' : ''
                  }`}
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-rose-400 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Address Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 block">
                Address <span className="text-slate-500 text-xs font-normal">(Max 400 characters)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-start pl-3 pt-3 pointer-events-none text-slate-400">
                  <MapPin size={18} />
                </span>
                <textarea
                  placeholder="Enter your complete address..."
                  rows={2}
                  className={`pl-10 pr-4 py-2.5 w-full glass-input rounded-xl text-sm resize-none ${
                    errors.address ? 'border-rose-500/50' : ''
                  }`}
                  {...register('address', {
                    required: 'Address is required',
                    maxLength: {
                      value: 400,
                      message: 'Address cannot exceed 400 characters'
                    }
                  })}
                ></textarea>
              </div>
              {errors.address && (
                <p className="text-xs text-rose-400 mt-1">{errors.address.message}</p>
              )}
            </div>

            {/* Role Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 block">
                Register As
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Tag size={18} />
                </span>
                <select
                  className="pl-10 pr-8 py-2.5 w-full glass-input rounded-xl text-sm cursor-pointer"
                  {...register('role', { required: 'Please select a role' })}
                >
                  <option value="User" className="bg-slate-900 text-white">Regular User / Customer</option>
                  <option value="Store Owner" className="bg-slate-900 text-white">Store Owner</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-xs text-rose-400 mt-1">{errors.role.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-300 block">
                Password <span className="text-slate-500 text-xs font-normal">(8-16 characters, at least 1 uppercase, at least 1 special char)</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 pr-4 py-2.5 w-full glass-input rounded-xl text-sm ${
                    errors.password ? 'border-rose-500/50' : ''
                  }`}
                  {...register('password', {
                    required: 'Password is required',
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
              {errors.password && (
                <p className="text-xs text-rose-400 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 mt-2 font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition shadow-lg shadow-brand-900/40 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm border-t border-slate-900/80 pt-4">
            <span className="text-slate-400">Already have an account? </span>
            <Link to="/login" className="text-brand-400 hover:text-brand-300 font-semibold transition">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
