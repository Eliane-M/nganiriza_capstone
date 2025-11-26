// Use environment variable if available (for Docker), otherwise default to localhost:8000
const BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.REACT_APP_API_URL || 'http://localhost:8000'

export default BASE_URL;