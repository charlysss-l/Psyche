// src/config/config.ts
const backendUrl = process.env.REACT_APP_BACKEND_URL;
const pythonUrl = process.env.REACT_APP_PYTHON_URL;
export default backendUrl && pythonUrl;
