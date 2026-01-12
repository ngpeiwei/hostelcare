// In-memory storage (replace with database in production)
let tickets = [
  {
    id: '00015',
    description: 'Aircond not functioning',
    status: 'In Progress',
    dateCreated: '2025-07-10',
    name: 'Ahmad bin Ali',
    email: 'ahmad@student.usm.my',
    category: 'Individual',
    subCategory: 'Air Conditioner',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'M04-09-12A',
    attachments: [],
    staffInCharge: 'Nazrul Hakim',
    actionsToBeTaken: 'Replaced aircond unit',
    estimatedServiceDate: '2025-07-12',
    feedback: 'Fixed successfully'
  },
  {
    id: '00014',
    description: 'Washing machine is broken',
    status: 'Resolved',
    dateCreated: '2025-07-09',
    name: 'Siti Nurhaliza',
    email: 'siti@student.usm.my',
    category: 'Shared',
    subCategory: 'Washing Machine',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    buildingAndRoom: 'M04-09-12A',
    attachments: [],
    staffInCharge: 'Nazrul Hakim',
    actionsToBeTaken: 'Repaired washing machine motor',
    estimatedServiceDate: '2025-07-11',
    feedback: 'Working well now'
  },
  {
    id: '00013',
    description: 'Drying rack wire is loose',
    status: 'Resolved',
    dateCreated: '2025-07-08',
    name: 'Lee Wei Ming',
    email: 'lee@student.usm.my',
    category: 'Shared',
    subCategory: 'Drying Rack',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-03',
    attachments: [],
    staffInCharge: 'Ahmad Fauzi',
    actionsToBeTaken: 'Tightened wire connections',
    estimatedServiceDate: '2025-07-10',
    feedback: 'Good'
  },
  {
    id: '00012',
    description: 'Chair leg is wobbly',
    status: 'Resolved',
    dateCreated: '2025-07-07',
    name: 'Sarah binti Hassan',
    email: 'sarah@student.usm.my',
    category: 'Individual',
    subCategory: 'Chair',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-04',
    attachments: [],
    staffInCharge: 'Nazrul Hakim',
    actionsToBeTaken: 'Fixed chair leg',
    estimatedServiceDate: '2025-07-09',
    feedback: 'Stable now'
  },
  {
    id: '00011',
    description: 'Socket plug cannot use',
    status: 'Resolved',
    dateCreated: '2025-07-06',
    name: 'Kamal bin Abdullah',
    email: 'kamal@student.usm.my',
    category: 'Individual',
    subCategory: 'Socket',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-05',
    attachments: [],
    staffInCharge: 'Ahmad Fauzi',
    actionsToBeTaken: 'Replaced socket',
    estimatedServiceDate: '2025-07-08',
    feedback: 'Working'
  },
  {
    id: '00010',
    description: 'Mirror broken',
    status: 'Resolved',
    dateCreated: '2025-07-05',
    name: 'Fatimah binti Zainal',
    email: 'fatimah@student.usm.my',
    category: 'Individual',
    subCategory: 'Mirror',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-06',
    attachments: [],
    staffInCharge: 'Nazrul Hakim',
    actionsToBeTaken: 'Replaced mirror',
    estimatedServiceDate: '2025-07-07',
    feedback: 'New mirror installed'
  },
  {
    id: '00009',
    description: 'Mattress old and spoiled',
    status: 'Pending',
    dateCreated: '2025-07-14',
    name: 'Rahman bin Ismail',
    email: 'rahman@student.usm.my',
    category: 'Individual',
    subCategory: 'Mattress',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-07',
    attachments: [],
    staffInCharge: 'Nazrul Hakim',
    actionsToBeTaken: 'Order new mattress',
    estimatedServiceDate: '2025-07-20',
    feedback: ''
  },
  {
    id: '00008',
    description: 'Bedframe is loose',
    status: 'Pending',
    dateCreated: '2025-07-14',
    name: 'Zara binti Mohd',
    email: 'zara@student.usm.my',
    category: 'Individual',
    subCategory: 'Bedframe',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-08',
    attachments: [],
    staffInCharge: 'Ahmad Fauzi',
    actionsToBeTaken: 'Tighten bedframe bolts',
    estimatedServiceDate: '2025-07-18',
    feedback: ''
  },
  {
    id: '00007',
    description: 'Toilet pump leaking',
    status: 'Pending',
    dateCreated: '2025-07-13',
    name: 'Hassan bin Yusof',
    email: 'hassan@student.usm.my',
    category: 'Shared',
    subCategory: 'Toilet',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-09',
    attachments: [],
    staffInCharge: 'Nazrul Hakim',
    actionsToBeTaken: 'Replace pump seal',
    estimatedServiceDate: '2025-07-17',
    feedback: ''
  },
  {
    id: '00006',
    description: 'Fridge is not cold anymore',
    status: 'Pending',
    dateCreated: '2025-07-13',
    name: 'Aisyah binti Rahman',
    email: 'aisyah@student.usm.my',
    category: 'Shared',
    subCategory: 'Refrigerator',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-10',
    attachments: [],
    staffInCharge: '',
    actionsToBeTaken: '',
    estimatedServiceDate: '',
    feedback: ''
  },
  {
    id: '00005',
    description: 'Table lamp is not working',
    detailedDescription: 'Last night suddenly I can\'t turn my lamp on. Please help to fix',
    status: 'Open',
    dateCreated: '2025-07-13',
    name: 'Nur Syakila Athirah binti Azman',
    email: 'syakilaat@student.usm.my',
    category: 'Individual',
    subCategory: 'Table lamp',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-01',
    attachments: ['IMG0002.png'],
    staffInCharge: '',
    actionsToBeTaken: '',
    estimatedServiceDate: '',
    feedback: ''
  },
  {
    id: '00004',
    description: 'Room socket spoil',
    status: 'Open',
    dateCreated: '2025-07-12',
    name: 'Muhammad Firdaus',
    email: 'firdaus@student.usm.my',
    category: 'Individual',
    subCategory: 'Socket',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-11',
    attachments: [],
    staffInCharge: '',
    actionsToBeTaken: '',
    estimatedServiceDate: '',
    feedback: ''
  },
  {
    id: '00003',
    description: 'Corridor Lamp spoil',
    status: 'Open',
    dateCreated: '2025-07-12',
    name: 'Nurul Izzah',
    email: 'nurul@student.usm.my',
    category: 'Shared',
    subCategory: 'Lamp',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-12',
    attachments: [],
    staffInCharge: '',
    actionsToBeTaken: '',
    estimatedServiceDate: '',
    feedback: ''
  },
  {
    id: '00002',
    description: 'Ceiling fan speed slow',
    status: 'Open',
    dateCreated: '2025-07-11',
    name: 'Amir bin Ahmad',
    email: 'amir@student.usm.my',
    category: 'Individual',
    subCategory: 'Ceiling Fan',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-13',
    attachments: [],
    staffInCharge: '',
    actionsToBeTaken: '',
    estimatedServiceDate: '',
    feedback: ''
  },
  {
    id: '00001',
    description: 'Room door handle broken',
    status: 'Open',
    dateCreated: '2025-07-11',
    name: 'Siti Aisyah',
    email: 'sitiaisyah@student.usm.my',
    category: 'Individual',
    subCategory: 'Door',
    hostel: 'Desasiswa Tekun',
    phoneNo: '+60102355511',
    floorAndRoom: 'L5-03-14',
    attachments: [],
    staffInCharge: '',
    actionsToBeTaken: '',
    estimatedServiceDate: '',
    feedback: ''
  }
];

// Generate next ticket ID
const getNextTicketId = () => {
  const maxId = Math.max(...tickets.map(t => parseInt(t.id)));
  return String(maxId + 1).padStart(5, '0');
};

// Get all tickets with optional filtering
exports.getAllComplaints = (req, res) => {
  const { status } = req.query;
  let filteredTickets = [...tickets];
  
  if (status && status !== 'All') {
    if (status === 'New') {
      filteredTickets = tickets.filter(t => t.status === 'Open');
    } else {
      filteredTickets = tickets.filter(t => t.status === status);
    }
  }
  
  // Sort by ID descending (newest first)
  filteredTickets.sort((a, b) => parseInt(b.id) - parseInt(a.id));
  
  res.json(filteredTickets);
};

// Get single ticket by ID
exports.getComplaintById = (req, res) => {
  const { id } = req.params;
  const ticket = tickets.find(t => t.id === id);
  
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  
  res.json(ticket);
};

// Create new ticket
exports.submitComplaint = (req, res) => {
  const newTicket = {
    id: getNextTicketId(),
    description: req.body.description,
    status: 'Open',
    dateCreated: new Date().toISOString().split('T')[0],
    name: req.body.name || '',
    email: req.body.email || '',
    category: req.body.category || 'Individual',
    subCategory: req.body.subCategory || '',
    hostel: req.body.hostel || '',
    phoneNo: req.body.phoneNo || '',
    floorAndRoom: req.body.floorAndRoom || '',
    attachments: req.body.attachments || [],
    staffInCharge: '',
    actionsToBeTaken: '',
    estimatedServiceDate: '',
    feedback: ''
  };
  
  tickets.push(newTicket);
  res.status(201).json(newTicket);
};

// Update ticket
exports.updateComplaint = (req, res) => {
  const { id } = req.params;
  const ticketIndex = tickets.findIndex(t => t.id === id);
  
  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  
  tickets[ticketIndex] = {
    ...tickets[ticketIndex],
    ...req.body,
    id: tickets[ticketIndex].id // Preserve ID
  };
  
  res.json(tickets[ticketIndex]);
};

// Delete ticket
exports.deleteComplaint = (req, res) => {
  const { id } = req.params;
  const ticketIndex = tickets.findIndex(t => t.id === id);
  
  if (ticketIndex === -1) {
    return res.status(404).json({ error: 'Ticket not found' });
  }
  
  tickets.splice(ticketIndex, 1);
  res.json({ message: 'Ticket deleted successfully' });
};
