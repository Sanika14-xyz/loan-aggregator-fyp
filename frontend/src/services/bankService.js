import API from './api';
const getBanks = async () => (await API.get('/banks')).data;
const createBank = async (data) => (await API.post('/banks', data)).data;
const updateBank = async (id, data) => (await API.put(`/banks/${id}`, data)).data;
const deleteBank = async (id) => (await API.delete(`/banks/${id}`)).data;
const bankService = { getBanks, createBank, updateBank, deleteBank };
export default bankService;