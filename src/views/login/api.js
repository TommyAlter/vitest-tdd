import http from '@/lib/http'

export const login = async (body) => {
  return http.post('/api/v1/auth', body)
}
