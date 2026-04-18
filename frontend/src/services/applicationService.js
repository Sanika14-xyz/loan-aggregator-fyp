import API from './api';

const submitApplication = async (data) => (await API.post('/applications', data)).data;
const getMyApplications = async () => (await API.get('/applications/my')).data;

// NEW FUNCTION: Manual status update
const updateApplicationStatus = async (id, status, remarks) => 
  (await API.put(`/applications/${id}/status`, { status, remarks })).data;

const getOfficerApplications = async () => (await API.get('/applications/officer')).data;

const signRegulatoryForm = async (id, signature, bankDetails) => 
  (await API.post(`/applications/${id}/sign`, { signature, bankDetails })).data;

const applicationService = { submitApplication, getMyApplications, updateApplicationStatus, getOfficerApplications, signRegulatoryForm };
export default applicationService;