import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { PencilIcon, Trash2Icon, PlusIcon, AlertCircle } from 'lucide-react'
import { useAuth } from '../lib/useAuth'

const MotionTableRow = motion.create(TableRow)

interface Role {
  id: number
  name: string
  description: string
}

interface User {
  id: number
  full_name: string
  email: string
  role_id: number | null
  role: Role | null
}

export default function UsersPage() {
  const { user: currentUser } = useAuth()

  const canManage = () => {
    if (!currentUser || !currentUser.role) return false
    const adminNames = ['admin', 'Admin', 'administrator', 'Administrator']
    return adminNames.includes(currentUser.role.name)
  }

  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [roleId, setRoleId] = useState('none')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      const [usersRes, rolesRes] = await Promise.all([
        api.get('/users'),
        api.get('/roles'),
      ])
      setUsers(usersRes.data.data || usersRes.data)
      setRoles(rolesRes.data.data || rolesRes.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const openCreateDialog = () => {
    setEditingUser(null)
    setFullName('')
    setEmail('')
    setRoleId('none')
    setPassword('')
    setConfirmPassword('')
    setFormError('')
    setDialogOpen(true)
  }

  const openEditDialog = (user: User) => {
    setEditingUser(user)
    setFullName(user.full_name)
    setEmail(user.email)
    setRoleId(user.role_id?.toString() || 'none')
    setPassword('')
    setConfirmPassword('')
    setFormError('')
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!canManage()) {
      alert('Only administrators are allowed to delete users.')
      return
    }
    if (currentUser?.id === id) {
      alert('You cannot delete your own account.')
      return
    }
    if (!confirm('Delete this user?')) return
    await api.delete(`/users/${id}`)
    fetchData()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')

    if (!editingUser && password.length < 8) {
      setFormError('Password must be at least 8 characters.')
      return
    }
    if (password && password !== confirmPassword) {
      setFormError('Passwords do not match.')
      return
    }

    if (!canManage()) {
      setFormError('Only administrators are allowed to manage users.')
      return
    }

    setSubmitting(true)
    try {
      const payload: Record<string, unknown> = {
        full_name: fullName,
        email,
        role_id: roleId === 'none' ? null : roleId,
      }
      if (password) {
        payload.password = password
        payload.password_confirmation = confirmPassword
      }

      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload)
      } else {
        await api.post('/users', payload)
      }
      setDialogOpen(false)
      fetchData()
    } catch (err: unknown) {
      const e = err as {
        response?: {
          status?: number
          data?: { errors?: Record<string, string[]>; message?: string }
        }
      }
      if (e.response?.status === 422 && e.response.data?.errors) {
        setFormError(Object.values(e.response.data.errors).flat().join(' '))
      } else {
        setFormError(e.response?.data?.message || 'Something went wrong.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl font-light text-zinc-100 tracking-tight">
            Users
          </h2>
          <p className="text-sm text-zinc-300 mt-1">
            Manage accounts and permissions
          </p>
        </motion.div>
        {canManage() && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Button
              onClick={openCreateDialog}
              className="h-10 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 rounded-lg gap-2 transition-colors w-full sm:w-auto shadow-sm"
            >
              <PlusIcon />
              New User
            </Button>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="rounded-xl border border-zinc-800 overflow-hidden bg-zinc-900"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent bg-zinc-950/40">
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-zinc-300 px-4">
                  Number
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-zinc-300 px-4">
                  Name
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-zinc-300 px-4">
                  Email
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-zinc-300 px-4">
                  Role
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-zinc-300 px-4 text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-zinc-800">
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-zinc-500 text-sm"
                  >
                    Loading users…
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow className="border-zinc-800">
                  <TableCell
                    colSpan={5}
                    className="text-center py-12 text-zinc-500 text-sm"
                  >
                    No users yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {users.map((user, idx) => (
                    <MotionTableRow
                      key={user.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05, duration: 0.2 }}
                      className="border-zinc-800 hover:bg-zinc-800/35 transition-colors"
                    >
                      <TableCell className="px-4 text-zinc-300 font-mono">
                        {user.id}
                      </TableCell>
                      <TableCell className="px-4 text-zinc-100 font-medium">
                        {user.full_name}
                      </TableCell>
                      <TableCell className="px-4 text-zinc-300">
                        {user.email}
                      </TableCell>
                      <TableCell className="px-4 text-zinc-300">
                        {user.role ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md bg-zinc-800/50 border border-zinc-700 text-zinc-300 text-xs font-medium">
                            {user.role.name}
                          </span>
                        ) : (
                          'Unassigned'
                        )}
                      </TableCell>
                      <TableCell className="px-4">
                        <div className="flex justify-end gap-1">
                          {canManage() && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(user)}
                              className="h-8 w-8 p-0 rounded-md text-zinc-300 hover:text-zinc-200 hover:bg-zinc-950 transition-colors"
                            >
                              <PencilIcon size={14} />
                            </Button>
                          )}
                          {canManage() && currentUser?.id !== user.id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              className="h-8 w-8 p-0 rounded-md text-zinc-300 hover:text-zinc-200 hover:bg-zinc-950 transition-colors"
                            >
                              <Trash2Icon size={14} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </MotionTableRow>
                  ))}
                </AnimatePresence>
              )}
            </TableBody>
          </Table>
        </div>
      </motion.div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[460px] bg-zinc-950 border-zinc-600/60 rounded-xl p-0 overflow-hidden shadow-2xl">
          <div className="flex flex-col max-h-[90vh]">
            <DialogHeader className="p-6 pb-4 shrink-0 space-y-1 mb-2 border-b border-zinc-600/60">
              <DialogTitle className="text-lg font-semibold text-zinc-100">
                {editingUser ? 'Edit User' : 'Create User'}
              </DialogTitle>
              <DialogDescription className="text-zinc-300">
                {editingUser
                  ? 'Update user account details.'
                  : 'Add a new system user.'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 mt-2">
              <form
                id="user-form"
                onSubmit={handleSubmit}
                className="space-y-4 pb-2"
              >
                {formError && (
                  <div className="flex items-start gap-2 bg-zinc-950/30 border border-red-800 text-red-300 rounded-lg px-3 py-2.5 text-sm">
                    <AlertCircle
                      size={14}
                      className="mt-0.5 shrink-0 flex-shrink-0"
                    />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="u-name" className="font-medium text-zinc-300">
                    Full Name
                  </Label>
                  <Input
                    id="u-name"
                    required
                    placeholder="Full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="h-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="u-email"
                    className="font-medium text-zinc-300"
                  >
                    Email
                  </Label>
                  <Input
                    id="u-email"
                    type="email"
                    required
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="u-role" className="font-medium text-zinc-300">
                    Role
                  </Label>
                  <Select value={roleId} onValueChange={setRoleId}>
                    <SelectTrigger className="h-9 bg-zinc-950 border-zinc-800 text-zinc-100 focus:ring-zinc-600 rounded-lg">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
                      <SelectItem value="none">No Role</SelectItem>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.id.toString()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label
                        htmlFor="u-pw"
                        className="font-medium text-zinc-300"
                      >
                        Password {editingUser ? '(Optional)' : ''}
                      </Label>
                      <Input
                        id="u-pw"
                        type="password"
                        placeholder="8+ characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required={!editingUser}
                        className="h-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="u-cpw"
                        className="font-medium text-zinc-300"
                      >
                        Confirm Password
                      </Label>
                      <Input
                        id="u-cpw"
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required={!!password}
                        className="h-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 pt-4 shrink-0 border-t border-zinc-600/60 flex gap-2 mt-4">
              <Button
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                form="user-form"
                className="flex-1 h-9 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg text-sm transition-colors"
                disabled={submitting}
              >
                {editingUser ? 'Save' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
