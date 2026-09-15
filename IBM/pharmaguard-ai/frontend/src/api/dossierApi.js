import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const getDossierStructure  = ()           => api.get('/dossier/structure').then(r => r.data)
export const checkDossier         = (dossier)    => api.post('/dossier/check', { dossier }).then(r => r.data)
export const checkSampleDossier   = ()           => api.get('/dossier/check/sample').then(r => r.data)
export const getICHSchema         = ()           => api.get('/dossier/schema').then(r => r.data)
export const getRecommendations   = (moduleId)   => api.get(`/dossier/recommend/${moduleId}`).then(r => r.data)
export const getAllRecommendations = ()           => api.get('/dossier/recommend').then(r => r.data)
