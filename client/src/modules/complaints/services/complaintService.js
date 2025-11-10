import api from '../../../services/api';

const createComplaint = async (payload) => {
	try {
		const res = await api.post('/api/complaints', payload);
		return res;
	} catch (err) {
		throw err;
	}
};

const getAllComplaints = async (status = null) => {
	try {
		const url = status ? `/api/complaints?status=${status}` : '/api/complaints';
		const res = await api.get(url);
		return res;
	} catch (err) {
		throw err;
	}
};

const getComplaintById = async (id) => {
	try {
		const res = await api.get(`/api/complaints/${id}`);
		return res;
	} catch (err) {
		throw err;
	}
};

const updateComplaint = async (id, payload) => {
	try {
		const res = await api.put(`/api/complaints/${id}`, payload);
		return res;
	} catch (err) {
		throw err;
	}
};

const deleteComplaint = async (id) => {
	try {
		const res = await api.delete(`/api/complaints/${id}`);
		return res;
	} catch (err) {
		throw err;
	}
};

const complaintService = {
	createComplaint,
	getAllComplaints,
	getComplaintById,
	updateComplaint,
	deleteComplaint,
};

export default complaintService;
