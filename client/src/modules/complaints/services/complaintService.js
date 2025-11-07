import api from '../../../services/api';

const createComplaint = async (payload) => {
	// try posting to backend; path chosen as /api/complaints to match common conventions
	try {
		const res = await api.post('/api/complaints', payload);
		return res;
	} catch (err) {
		// bubble up the error so callers can handle it
		throw err;
	}
};

const complaintService = {
	createComplaint,
};

export default complaintService;
