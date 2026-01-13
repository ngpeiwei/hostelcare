// Utility script to delete mock/test tickets from Supabase
// Run with: node server/scripts/deleteMockTickets.js

require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase configuration. Please check your .env file.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// List of mock ticket descriptions to delete
const mockTicketDescriptions = [
  'room socket spoil',
  'Room socket spoil',
  'Table lamp is not working',
  'Corridor Lamp spoil',
  'Ceiling fan speed slow',
  'Room door handle broken',
  'room door handle',
  'door handle broken'
];

async function deleteMockTickets() {
  try {
    console.log('Searching for mock tickets to delete...');
    
    // Fetch all complaints
    const { data: complaints, error: fetchError } = await supabase
      .from('complaints')
      .select('id, issue_title, description');
    
    if (fetchError) {
      console.error('Error fetching complaints:', fetchError);
      return;
    }
    
    if (!complaints || complaints.length === 0) {
      console.log('No complaints found in database.');
      return;
    }
    
    console.log(`Found ${complaints.length} total complaints`);
    
    // Find tickets matching mock descriptions
    const ticketsToDelete = complaints.filter(complaint => {
      const title = (complaint.issue_title || '').toLowerCase();
      const desc = (complaint.description || '').toLowerCase();
      
      return mockTicketDescriptions.some(mock => {
        const mockLower = mock.toLowerCase();
        return title.includes(mockLower) || desc.includes(mockLower);
      });
    });
    
    if (ticketsToDelete.length === 0) {
      console.log('No mock tickets found to delete.');
      return;
    }
    
    console.log(`\nFound ${ticketsToDelete.length} mock tickets to delete:`);
    ticketsToDelete.forEach(ticket => {
      console.log(`  - ID: ${ticket.id}, Title: ${ticket.issue_title || ticket.description}`);
    });
    
    // Delete the tickets
    const ticketIds = ticketsToDelete.map(t => t.id);
    
    // First delete attachments (due to foreign key constraint)
    const { error: attachmentError } = await supabase
      .from('complaint_attachments')
      .delete()
      .in('complaint_id', ticketIds);
    
    if (attachmentError) {
      console.error('Error deleting attachments:', attachmentError);
    } else {
      console.log(`\nDeleted attachments for ${ticketsToDelete.length} tickets`);
    }
    
    // Then delete the complaints
    const { error: deleteError } = await supabase
      .from('complaints')
      .delete()
      .in('id', ticketIds);
    
    if (deleteError) {
      console.error('Error deleting complaints:', deleteError);
    } else {
      console.log(`\n✅ Successfully deleted ${ticketsToDelete.length} mock tickets!`);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

deleteMockTickets();
