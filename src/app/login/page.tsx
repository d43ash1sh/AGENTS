'use client'

import { useState, useActionState } from 'react'
import { signIn, signUp } from '@/lib/services/auth'
import { Eye, EyeOff, Lock, Mail, Loader2, Home } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Use action state for form submissions
  const [signInState, signInAction, isSignInPending] = useActionState(signIn, null)
  const [signUpState, signUpAction, isSignUpPending] = useActionState(signUp, null)

  const isPending = isSignInPending || isSignUpPending
  const error = isSignUp ? signUpState?.error : signInState?.error
  const success = isSignUp ? signUpState?.success : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-radial from-slate-900 via-zinc-950 to-black px-4 py-12 sm:px-6 lg:px-8 text-white">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600 blur-[120px]" />
      </div>

      <div className="w-full max-w-md space-y-8 z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-white transition-all text-sm"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/30">
            <span className="text-xl font-bold tracking-wider">R</span>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {isSignUp ? 'Create an account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-zinc-400">
            {isSignUp 
              ? 'Find rooms and manage your listings easily' 
              : 'Sign in to access your listings and contact owners'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm" role="alert">
              {success}
            </div>
          )}

          <form action={isSignUp ? signUpAction : signInAction} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                Email Address
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-5 w-5 text-zinc-500" aria-hidden="true" />
                </div>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  autoComplete="username"
                  className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3.5 pl-11 pr-4 text-white ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="name@rgu.ac.in"
                  disabled={isPending}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label htmlFor="password" className="block text-sm font-medium text-zinc-300">
                  Password
                </label>
              </div>
              <div className="relative rounded-xl shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-zinc-500" aria-hidden="true" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                  minLength={6}
                  className="block w-full rounded-xl border-0 bg-zinc-950/60 py-3.5 pl-11 pr-12 text-white ring-1 ring-inset ring-zinc-800 placeholder:text-zinc-600 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all"
                  placeholder="••••••••"
                  disabled={isPending}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <Eye className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              </div>
              {isSignUp && (
                <p className="text-xs text-zinc-500 mt-1">Must be at least 6 characters.</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
              )}
            </button>
          </form>

          {/* Toggle View */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-zinc-800"></div>
            <span className="flex-shrink mx-4 text-zinc-600 text-xs uppercase tracking-wider">Or</span>
            <div className="flex-grow border-t border-zinc-800"></div>
          </div>

          <p className="text-center text-sm text-zinc-400">
            {isSignUp ? 'Already have an account? ' : 'New to RoomNearRGU? '}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setShowPassword(false)
              }}
              className="font-semibold leading-6 text-blue-400 hover:text-blue-300 transition-colors"
            >
              {isSignUp ? 'Sign in instead' : 'Create an account'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
