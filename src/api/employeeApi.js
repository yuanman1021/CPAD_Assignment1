import axios from 'axios'

// 1. pre-configured axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:3001',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

// 2. request interceptor: runs before every outgoing request
apiClient.interceptors.request.use(
  (config) => {
    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => Promise.reject(error)
)

// 3. response interceptor: runs on every response
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = 'Something went wrong.'

    if (error.response) {
      message = error.response.data?.error || `Server error: ${error.response.status}`
    } else if (error.request) {
      message = 'Cannot connect to API server. Is Express running on port 3001?'
    } else {
      message = error.message
    }

    error.userMessage = message
    return Promise.reject(error)
  }
)

// 4. CRUD helpers
export const getEmployees = (params = {}) =>
  apiClient.get('/employees', { params })

export const getEmployee = (id) =>
  apiClient.get(`/employees/${id}`)

export const createEmployee = (employee) =>
  apiClient.post('/employees', employee)

export const updateEmployee = (id, employee) =>
  apiClient.put(`/employees/${id}`, employee)

export const deleteEmployee = (id) =>
  apiClient.delete(`/employees/${id}`)

export default apiClient