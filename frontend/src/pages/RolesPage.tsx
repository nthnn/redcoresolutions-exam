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
import { PencilIcon, Trash2Icon, PlusIcon, AlertCircle } from 'lucide-react'
import { useAuth } from '../lib/useAuth'

const MotionTableRow = motion.create(TableRow)

interface Role {
  id: number
  name: string
  description: string
}

export default function RolesPage() {
  const { user: currentUser } = useAuth()

  const canManage = () => {
    if (!currentUser || !currentUser.role) return false
    const adminNames = ['admin', 'Admin', 'administrator', 'Administrator']
    return adminNames.includes(currentUser.role.name)
  }

  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchRoles = async () => {
    try {
      const res = await api.get('/roles')
      setRoles(res.data.data || res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const openCreateDialog = () => {
    setEditingRole(null)
    setName('')
    setDescription('')
    setFormError('')
    setDialogOpen(true)
  }

  const openEditDialog = (role: Role) => {
    setEditingRole(role)
    setName(role.name)
    setDescription(role.description)
    setFormError('')
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!canManage()) {
      alert('Only administrators are allowed to delete roles.')
      return
    }
    if (!confirm('Delete this role?')) return
    await api.delete(`/roles/${id}`)
    fetchRoles()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!canManage()) {
      setFormError('Only administrators are allowed to manage roles.')
      return
    }
    setSubmitting(true)
    try {
      if (editingRole) {
        await api.put(`/roles/${editingRole.id}`, { name, description })
      } else {
        await api.post('/roles', { name, description })
      }
      setDialogOpen(false)
      fetchRoles()
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
            Roles
          </h2>
          <p className="text-sm text-zinc-300 mt-1">
            Manage system permissions
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
              <PlusIcon size={16} />
              <span>New Role</span>
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
                  Description
                </TableHead>
                <TableHead className="h-11 text-xs font-semibold uppercase tracking-wider text-zinc-300 px-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-zinc-800">
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-zinc-300 text-sm"
                  >
                    Loading roles…
                  </TableCell>
                </TableRow>
              ) : roles.length === 0 ? (
                <TableRow className="border-zinc-800">
                  <TableCell
                    colSpan={4}
                    className="text-center py-6 text-zinc-300 text-sm"
                  >
                    No roles yet. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                <AnimatePresence mode="popLayout">
                  {roles.map((role, idx) => (
                    <MotionTableRow
                      key={role.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05, duration: 0.2 }}
                      className="border-zinc-800 hover:bg-zinc-800/35 transition-colors"
                    >
                      <TableCell className="px-4 text-zinc-300 font-mono">
                        {role.id}
                      </TableCell>
                      <TableCell className="px-4 text-zinc-100 font-medium">
                        {role.name}
                      </TableCell>
                      <TableCell className="px-4 text-zinc-300">
                        {role.description || (
                          <span className="text-zinc-600 text-xs italic">
                            —
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 text-right">
                        <div className="flex justify-start gap-1">
                          {canManage() && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(role)}
                              className="h-8 w-8 p-0 rounded-md text-zinc-300 hover:text-zinc-200 hover:bg-zinc-950 transition-colors"
                            >
                              <PencilIcon size={14} />
                            </Button>
                          )}
                          {canManage() && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(role.id)}
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
                {editingRole ? 'Edit Role' : 'Create Role'}
              </DialogTitle>
              <DialogDescription className="text-zinc-300">
                {editingRole
                  ? 'Update role details.'
                  : 'Add a new system role.'}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 mt-2">
              <form
                id="role-form"
                onSubmit={handleSubmit}
                className="space-y-4 pb-2"
              >
                {formError && (
                  <div className="flex items-start gap-2 bg-zinc-950/30 border border-zinc-800 text-zinc-300 rounded-lg px-3 py-2.5 text-sm">
                    <AlertCircle
                      size={14}
                      className="mt-0.5 shrink-0 flex-shrink-0"
                    />
                    <span>{formError}</span>
                  </div>
                )}
                <div className="space-y-2">
                  <Label
                    htmlFor="role-name"
                    className="font-medium text-zinc-300"
                  >
                    Role Name
                  </Label>
                  <Input
                    id="role-name"
                    required
                    placeholder="Administrator"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="role-desc"
                    className="font-medium text-zinc-300"
                  >
                    Description
                  </Label>
                  <Input
                    id="role-desc"
                    placeholder="Full system access"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="h-9 bg-zinc-950 border-zinc-800 text-zinc-100 placeholder:text-zinc-600 focus-visible:ring-zinc-600 rounded-lg text-sm"
                  />
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
                form="role-form"
                className="flex-1 h-9 bg-zinc-100 hover:bg-zinc-200 text-zinc-950 font-bold rounded-lg text-sm transition-colors"
                disabled={submitting}
              >
                {editingRole ? 'Save' : 'Create'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
