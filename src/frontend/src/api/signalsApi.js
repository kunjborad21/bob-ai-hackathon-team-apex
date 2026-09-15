import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

export const getReports    = ()           => api.get('/signals/reports').then(r => r.data)
export const calculatePRR  = (drugName)   => api.post('/signals/prr', { drug_name: drugName }).then(r => r.data)
export const clusterReports = (drugName, nClusters) =>
  api.post('/signals/cluster', { drug_name: drugName, n_clusters: nClusters }).then(r => r.data)
export const getRankedSignals = ()        => api.get('/signals/ranked').then(r => r.data)
export const explainSignal = (drug, evt)  =>
  api.get(`/signals/explain/${encodeURIComponent(drug)}/${encodeURIComponent(evt)}`).then(r => r.data)
