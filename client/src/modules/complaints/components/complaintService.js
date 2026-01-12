// complaintService.js
import { supabase } from '../../../supabaseClient';

export async function submitComplaint(complaintData) {
  try {
    const { title, category, subCategory, description, hostel, room, attachments } = complaintData;

    // 1. Get logged-in user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) throw new Error('User not logged in');

    // 2. Insert complaint
    const { data: complaint, error: complaintError } = await supabase
      .from('complaints')
      .insert([
        {
          user_id: user.id,
          issue_title: title,
          category,
          sub_category: subCategory,
          description,
          hostel,
          building_room_number: room,
        },
      ])
      .select()

    if (complaintError) throw complaintError;

   const complaintRow = complaint[0];

    // 3. Upload attachments
    const uploadedAttachments = [];

    for (const att of attachments || []) {
    const file = att.file;
    if (!file) continue; // skip if file is missing

    const sanitizedFileName = file.name.replace(/\s+/g, '_');
    const fileName = `${complaintRow.id}/${Date.now()}_${Math.random().toString(36).substring(2,8)}_${sanitizedFileName}`;
    
    const { data: storageData, error: storageError } = await supabase.storage
      .from('complaint-attachments')
      .upload(fileName, file);

    if (storageError) {
      console.error('Error uploading file:', fileName, storageError);
      throw storageError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('complaint-attachments')
      .getPublicUrl(fileName);

    const { data: attachmentRow, error: attachmentError } = await supabase
      .from('complaint_attachments')
      .insert([
        {
          complaint_id: complaintRow.id,
          file_url: publicUrl,
          file_type: file.type?.startsWith('image') ? 'image' :
                    file.type?.startsWith('video') ? 'video' : 'file',
        },
      ]);

    if (attachmentError) throw attachmentError;

    uploadedAttachments.push(attachmentRow?.[0]);
  }

    return {  complaint: complaintRow, attachments: uploadedAttachments };
  } catch (err) {
    console.error('Error submitting complaint:', err);
    throw err;
  }
}
