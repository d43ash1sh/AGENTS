'use client'

import { useState, useActionState } from 'react'
import { signIn, signUp } from '@/lib/services/auth'
import { Eye, EyeOff, Lock, Mail, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Logo from '@/components/Logo'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const [signInState, signInAction, isSignInPending] = useActionState(signIn, null)
  const [signUpState, signUpAction, isSignUpPending] = useActionState(signUp, null)

  const isPending = isSignInPending || isSignUpPending
  const error = isSignUp ? signUpState?.error : signInState?.error
  const success = isSignUp ? signUpState?.success : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#ffffff] px-4 py-12 sm:px-6 lg:px-8 text-black relative w-full overflow-hidden">
      
      {/* Background glow decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[20%] w-[35%] h-[35%] rounded-full bg-blue-500/5 blur-[160px] radial-glow" />
        <div className="absolute bottom-[20%] right-[20%] w-[35%] h-[35%] rounded-full bg-indigo-500/5 blur-[160px] radial-glow" />
      </div>

      <div className="w-full max-w-sm space-y-8 z-10">
        {/* Back Link */}
        <div className="flex flex-col items-center text-center">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 mb-6 px-3 py-1.5 rounded bg-black/5 border border-black/10 text-black/50 hover:text-black transition-all text-xs font-mono uppercase tracking-wider cursor-pointer active:scale-[0.98]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
          
          <Logo iconSize={24} showText={false} className="mb-2" />
          <h2 className="mt-4 caveman-title text-2xl sm:text-3xl text-black">
            {isSignUp ? 'create account' : 'welcome back'}
          </h2>
          <p className="mt-1 text-xs text-black/40 leading-relaxed font-light">
            {isSignUp 
              ? 'Join to post accommodation and coordinate directly.' 
              : 'Sign in to access your dashboard and listing stats.'}
          </p>
        </div>

        {/* Caveman aesthetic glassmorphism login card */}
        <div className="bg-black/2 border border-black/8 p-6 sm:p-8 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.03)] space-y-6">
          {error && (
            <div className="p-3.5 rounded border border-red-500/10 bg-red-500/5 text-red-600 text-xs font-mono" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3.5 rounded border border-green-500/10 bg-green-500/5 text-green-600 text-xs font-mono" role="alert">
              {success}
            </div>
          )}

          <form action={isSignUp ? signUpAction : signInAction} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block font-mono text-[9px] uppercase tracking-wider text-black/40">
                Email Address
              </label>
              <div className="relative rounded bg-[#ffffff] border border-black/8 focus-within:border-black/20 transition-colors">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/30">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  autoComplete="username"
                  className="block w-full bg-transparent py-3 pl-10 pr-4 text-black placeholder-black/25 focus:outline-none text-xs"
                  placeholder="name@example.com"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="block font-mono text-[9px] uppercase tracking-wider text-black/40">
                Password
              </label>
              <div className="relative rounded bg-[#ffffff] border border-black/8 focus-within:border-black/20 transition-colors">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-black/30">
                  <Lock className="h-4 w-4" aria-hidden="true" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  minLength={6}
                  className="block w-full bg-transparent py-3 pl-10 pr-10 text-black placeholder-black/25 focus:outline-none text-xs"
                  placeholder="••••••••"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-black/30 hover:text-black transition-colors"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
              {isSignUp && (
                <p className="font-mono text-[8px] text-black/30">Must be at least 6 characters.</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center rounded bg-black hover:bg-black/90 px-4 py-3 text-xs font-mono uppercase tracking-wider text-white transition-all active:scale-[0.985] disabled:opacity-50 disabled:pointer-events-none cursor-pointer shadow-md shadow-black/10"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-black/5"></div>
            <span className="flex-shrink mx-4 text-black/20 font-mono text-[8px] uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-black/5"></div>
          </div>

          {/* Toggle */}
          <p className="text-center text-xs text-black/50">
            {isSignUp ? 'Already have an account? ' : 'New to NestRGU? '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setShowPassword(false)
              }}
              className="font-bold text-black hover:underline transition-all cursor-pointer"
            >
              {isSignUp ? 'Sign in instead' : 'Create an account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
