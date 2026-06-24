import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Mail, Lock, Star, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
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
      const user = await login(data.email, data.password);
      // Redirect based on role
      if (user.role === 'Admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'Store Owner') {
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
      {/* Background blobs for premium feel */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md animate-fade-in relative z-10">
        {/* Logo/Branding */}
        <div className="flex flex-col items-center gap-2 mb-8">
          <div className="h-12 w-12 rounded-2xl bg-brand-600/25 flex items-center justify-center border border-brand-500/30">
            <Star className="text-brand-400 fill-brand-400" size={28} />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-brand-300 via-indigo-300 to-indigo-400 bg-clip-text text-transparent">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-400">
            Sign in to manage and rate your favorite stores
          </p>
        </div>

        {/* Card Form */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-900 bg-slate-950/40 backdrop-blur-lg shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Field */}
            <div className="space-y-2">
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
                    errors.email ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : ''
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

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 block">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  className={`pl-10 pr-4 py-2.5 w-full glass-input rounded-xl text-sm ${
                    errors.password ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20' : ''
                  }`}
                  {...register('password', {
                    required: 'Password is required'
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
              className="w-full py-3 px-4 font-semibold text-white bg-brand-600 hover:bg-brand-500 rounded-xl transition shadow-lg shadow-brand-900/40 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Direct link to register */}
          <div className="mt-8 text-center text-sm border-t border-slate-900/80 pt-6">
            <span className="text-slate-400">Don't have an account? </span>
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-semibold transition">
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
