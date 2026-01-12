const supabase = require('../config/supabase');

// Get all tickets with optional filtering
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, email } = req.query;
    
    let query = supabase
      .from('complaints')
      .select('*');
    
    // Apply email filter (for students to see only their complaints)
    if (email) {
      query = query.eq('email', email);
    }
    
    // Apply status filter
    if (status && status !== 'All') {
      if (status === 'New') {
        query = query.eq('status', 'Open');
      } else {
        query = query.eq('status', status);
      }
    }
    
    // Sort by ID descending (newest first)
    query = query.order('id', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching complaints:', error);
      return res.status(500).json({ error: 'Failed to fetch complaints' });
    }
    
    // Format data to match frontend expectations (convert snake_case to camelCase)
    const formattedData = data.map(ticket => ({
      id: String(ticket.id).padStart(5, '0'),
      description: ticket.description,
      detailedDescription: ticket.detailed_description || ticket.description || '',
      status: ticket.status,
      dateCreated: ticket.date_created,
      name: ticket.name || '',
      email: ticket.email || '',
      category: ticket.category || '',
      subCategory: ticket.sub_category || '',
      hostel: ticket.hostel || '',
      phoneNo: ticket.phone_no || '',
      floorAndRoom: ticket.floor_and_room || ticket.buildingAndRoom || '',
      buildingAndRoom: ticket.floor_and_room || ticket.buildingAndRoom || '',
      attachments: ticket.attachments || [],
      staffInCharge: ticket.staff_in_charge || '',
      actionsToBeTaken: ticket.actions_to_be_taken || '',
      estimatedServiceDate: ticket.estimated_service_date || '',
      feedback: ticket.feedback || ''
    }));
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error in getAllComplaints:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get single ticket by ID
exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Remove leading zeros if present for database query
    const numericId = parseInt(id);
    
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', numericId)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      console.error('Error fetching complaint:', error);
      return res.status(500).json({ error: 'Failed to fetch complaint' });
    }
    
    // Convert numeric ID to zero-padded string
    const formattedData = {
      ...data,
      id: String(data.id).padStart(5, '0')
    };
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error in getComplaintById:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new ticket
exports.submitComplaint = async (req, res) => {
  try {
    // First, get the maximum ID to generate the next one
    const { data: maxTicket, error: maxError } = await supabase
      .from('complaints')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();
    
    let nextId = 1;
    if (maxTicket && !maxError) {
      nextId = parseInt(maxTicket.id) + 1;
    }
    
    const newTicket = {
      id: nextId,
      description: req.body.description,
      detailed_description: req.body.detailedDescription || req.body.description || '',
      status: 'Open',
      date_created: new Date().toISOString().split('T')[0],
      name: req.body.name || '',
      email: req.body.email || '',
      category: req.body.category || 'Individual',
      sub_category: req.body.subCategory || '',
      hostel: req.body.hostel || '',
      phone_no: req.body.phoneNo || '',
      floor_and_room: req.body.floorAndRoom || req.body.buildingAndRoom || '',
      attachments: req.body.attachments || [],
      staff_in_charge: '',
      actions_to_be_taken: '',
      estimated_service_date: null,
      feedback: ''
    };
    
    const { data, error } = await supabase
      .from('complaints')
      .insert([newTicket])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating complaint:', error);
      return res.status(500).json({ error: 'Failed to create complaint' });
    }
    
    // Format response to match frontend expectations
    const formattedData = {
      id: String(data.id).padStart(5, '0'),
      description: data.description,
      detailedDescription: data.detailed_description,
      status: data.status,
      dateCreated: data.date_created,
      name: data.name,
      email: data.email,
      category: data.category,
      subCategory: data.sub_category,
      hostel: data.hostel,
      phoneNo: data.phone_no,
      floorAndRoom: data.floor_and_room || data.buildingAndRoom,
      buildingAndRoom: data.floor_and_room || data.buildingAndRoom,
      attachments: data.attachments || [],
      staffInCharge: data.staff_in_charge || '',
      actionsToBeTaken: data.actions_to_be_taken || '',
      estimatedServiceDate: data.estimated_service_date || '',
      feedback: data.feedback || ''
    };
    
    res.status(201).json(formattedData);
  } catch (error) {
    console.error('Error in submitComplaint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update ticket
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    
    // Convert frontend field names to database field names
    const updateData = {
      description: req.body.description,
      detailed_description: req.body.detailedDescription || req.body.description || null,
      status: req.body.status,
      name: req.body.name,
      email: req.body.email,
      category: req.body.category,
      sub_category: req.body.subCategory,
      hostel: req.body.hostel,
      phone_no: req.body.phoneNo,
      floor_and_room: req.body.floorAndRoom || req.body.buildingAndRoom || null,
      attachments: req.body.attachments || [],
      staff_in_charge: req.body.staffInCharge || '',
      actions_to_be_taken: req.body.actionsToBeTaken || '',
      estimated_service_date: req.body.estimatedServiceDate || null,
      feedback: req.body.feedback || ''
    };
    
    // Remove undefined/null values to avoid overwriting with null
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });
    
    const { data, error } = await supabase
      .from('complaints')
      .update(updateData)
      .eq('id', numericId)
      .select()
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Ticket not found' });
      }
      console.error('Error updating complaint:', error);
      return res.status(500).json({ error: 'Failed to update complaint' });
    }
    
    // Format response to match frontend expectations
    const formattedData = {
      id: String(data.id).padStart(5, '0'),
      description: data.description,
      detailedDescription: data.detailed_description,
      status: data.status,
      dateCreated: data.date_created,
      name: data.name,
      email: data.email,
      category: data.category,
      subCategory: data.sub_category,
      hostel: data.hostel,
      phoneNo: data.phone_no,
      floorAndRoom: data.floor_and_room || data.buildingAndRoom,
      buildingAndRoom: data.floor_and_room || data.buildingAndRoom,
      attachments: data.attachments || [],
      staffInCharge: data.staff_in_charge || '',
      actionsToBeTaken: data.actions_to_be_taken || '',
      estimatedServiceDate: data.estimated_service_date || '',
      feedback: data.feedback || ''
    };
    
    res.json(formattedData);
  } catch (error) {
    console.error('Error in updateComplaint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete ticket
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;
    const numericId = parseInt(id);
    
    const { error } = await supabase
      .from('complaints')
      .delete()
      .eq('id', numericId);
    
    if (error) {
      console.error('Error deleting complaint:', error);
      return res.status(500).json({ error: 'Failed to delete complaint' });
    }
    
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    console.error('Error in deleteComplaint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
