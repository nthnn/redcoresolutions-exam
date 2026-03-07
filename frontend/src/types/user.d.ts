interface User {
  id: number
  full_name: string
  email: string
  role_id: number
  role?: { id: number; name: string; description: string }
}
