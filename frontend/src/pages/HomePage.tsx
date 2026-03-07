import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  Loader2Icon,
  UserIcon,
} from 'lucide-react'
import { useAuth } from '@/lib/useAuth'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')

  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPwd, setShowLoginPwd] = useState(false)

  const [regName, setRegName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regConfirmPassword, setRegConfirmPassword] = useState('')
  const [showRegPwd, setShowRegPwd] = useState(false)

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'login' | 'register')
    setError('')
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.post('/login', {
        email: loginEmail,
        password: loginPassword,
      })
      const { access_token } = res.data
      const userRes = await api.get('/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      login(access_token, userRes.data)
      navigate('/dashboard')
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } }
      setError(e.response?.data?.error || 'Incorrect email or password.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (regPassword.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (regPassword !== regConfirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/register', {
        full_name: regName,
        email: regEmail,
        password: regPassword,
        password_confirmation: regConfirmPassword,
      })
      const { access_token } = res.data
      const userRes = await api.get('/me', {
        headers: { Authorization: `Bearer ${access_token}` },
      })
      login(access_token, userRes.data)
      navigate('/dashboard')
    } catch (err: unknown) {
      const e = err as {
        response?: {
          status?: number
          data?: { errors?: Record<string, string[]>; message?: string }
        }
      }
      if (e.response?.status === 422 && e.response.data?.errors) {
        setError(Object.values(e.response.data.errors).flat().join(' '))
      } else {
        setError(e.response?.data?.message || 'Registration failed.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0f_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0f_1px,transparent_3px)] bg-[size:3rem_3rem]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.08),transparent_50%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-[420px] backdrop-blur bg-primary/30 border border-zinc-600 rounded-xl overflow-hidden relative z-10"
      >
        <div className="p-8 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-center space-y-2"
          >
            <h1 className="text-2xl font-light text-zinc-100 tracking-tight">
              Red Core &mdash; Coding Exam
            </h1>
            <p className="text-sm text-zinc-300">
              {activeTab === 'login'
                ? 'Enter your credentials to access your account'
                : 'Fill in the details to join Red Core'}
            </p>
          </motion.div>

          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 h-10 bg-zinc-950/50 border border-zinc-600/80 p-1 rounded-lg">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-500 rounded-md transition-all"
              >
                Log In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 text-zinc-500 rounded-md transition-all"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-start gap-2 bg-zinc-950/30 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2.5 text-sm overflow-hidden"
                >
                  <AlertCircleIcon
                    size={14}
                    className="mt-0.5 shrink-0 text-red-500"
                  />
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
              >
                <TabsContent value="login" className="mt-6 space-y-0">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-email"
                        className="font-medium text-zinc-300"
                      >
                        Email address
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Email address"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        autoComplete="off"
                        className="h-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label
                          htmlFor="login-pwd"
                          className="font-medium text-zinc-300"
                        >
                          Password
                        </Label>
                      </div>
                      <div className="relative">
                        <Input
                          id="login-pwd"
                          type={showLoginPwd ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          placeholder="Password"
                          className="h-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg pr-10 text-sm font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPwd(!showLoginPwd)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          {showLoginPwd ? (
                            <EyeOffIcon size={16} />
                          ) : (
                            <EyeIcon size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 mt-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Authenticating...
                        </>
                      ) : (
                        <>
                          <UserIcon className="mr-2 h-4 w-4" />
                          Sign In
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="register" className="mt-6 space-y-0">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="reg-name"
                        className="font-medium text-zinc-300"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="reg-name"
                        placeholder="Full name"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        required
                        autoComplete="off"
                        className="h-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="reg-email"
                        className="font-medium text-zinc-300"
                      >
                        Email address
                      </Label>
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="Email address"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        required
                        autoComplete="off"
                        className="h-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor="reg-pwd"
                          className="font-medium text-zinc-300"
                        >
                          Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="reg-pwd"
                            type={showRegPwd ? 'text' : 'password'}
                            value={regPassword}
                            placeholder="Password"
                            onChange={(e) => setRegPassword(e.target.value)}
                            required
                            className="h-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg pr-8 text-sm font-mono"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPwd(!showRegPwd)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                          >
                            {showRegPwd ? (
                              <EyeOffIcon size={14} />
                            ) : (
                              <EyeIcon size={14} />
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="reg-cpwd"
                          className="font-medium text-zinc-300"
                        >
                          Confirm
                        </Label>
                        <Input
                          id="reg-cpwd"
                          type="password"
                          value={regConfirmPassword}
                          onChange={(e) =>
                            setRegConfirmPassword(e.target.value)
                          }
                          required
                          placeholder="Confirm Password"
                          className="h-10 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg text-sm font-mono"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-10 mt-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-lg transition-colors"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <UserIcon className="mr-2 h-4 w-4" />
                          Register
                        </>
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>
        </div>

        <div className="p-4 bg-zinc-950/50 border-t border-zinc-600 text-center">
          <p className="text-xs text-zinc-400">
            This system is intended for my coding exam at Red Core Solutions.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
