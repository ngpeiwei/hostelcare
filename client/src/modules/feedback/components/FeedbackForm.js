import React, { useState } from 'react';
import { supabase } from '../../../supabaseClient';
import './FeedbackForm.css';

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <button
            type="button"
            key={ratingValue}
            className={`star-button ${ratingValue <= rating ? 'filled' : ''}`}
            onClick={() => setRating(ratingValue)}
            aria-label={`${ratingValue} star`}
          >
            &#9733; {/* This is a star character */}
          </button>
        );
      })}
    </div>
  );
};

export default function FeedbackModal({ open, onClose, complaintId, onSubmitSuccess }) {
  const [satisfaction, setSatisfaction] = useState(0);
  const [professionalism, setProfessionalism] = useState(0);
  const [effectiveness, setEffectiveness] = useState(0);
  const [easeOfUse, setEaseOfUse] = useState(0);
  const [comments, setComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    if (!satisfaction || !professionalism || !effectiveness || !easeOfUse) {
      setError('Please fill required fields.');
      return;
    }
  
    setLoading(true);
  
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) throw authError;
  
      console.log("Auth user:", authData.user);
  
      const userId = authData.user?.id;
      console.log("Using user_id:", userId);
      console.log("Using complaint_id:", complaintId);
  
      const { data: complaintRow } = await supabase
        .from('complaints')
        .select('id,status')
        .eq('id', complaintId)
        .single();
  
      console.log("Complaint row:", complaintRow);
  
      const { error } = await supabase.from('feedback').insert({
        complaint_id: complaintId,
        user_id: userId,
        overall_rating: satisfaction,
        timeliness_rating: professionalism,
        effectiveness_rating: effectiveness,
        ease_of_use_rating: easeOfUse,
        comment: comments,
      });
  
      if (error) throw error;
  
      onSubmitSuccess({
        complaintId,
        overall_rating: satisfaction,
        timeliness_rating: professionalism,
        effectiveness_rating: effectiveness,
        ease_of_use_rating: easeOfUse,
        comment: comments,
        created_at: new Date().toISOString(),
      });
      
  
    } catch (apiError) {
      console.error('Failed to submit feedback:', apiError);
      setError(apiError.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setSatisfaction(0);
    setProfessionalism(0);
    setEffectiveness(0);
    setEaseOfUse(0);
    setComments('');
    setError(null);
    setLoading(false);
    onClose(); // Call the original onClose prop from Dashboard
  };

  return (
    <div className="fb-modal-overlay">
      <div className="fb-modal-content feedback-modal">
        {/* Use handleClose to reset state */}
        <button className="fb-modal-close-btn" onClick={handleClose} aria-label="Close modal">
          &times;
        </button>
        
        <h2 className="fb-modal-title">Feedback & Rating</h2>
        
        <form onSubmit={handleSubmit} className="feedback-form">
            {/* ... (Your form-group divs for stars go here) ... */}
            {/* --- ADDED ---: Display the error message */}
            {error && <div className="fb-form-error-message">{error}</div>}

            <div className="fb-form-group">
              <label>How satisfied are you with the maintenance service provided? <span className="fb-required-asterisk">*</span></label>
              <StarRating rating={satisfaction} setRating={setSatisfaction} />
            </div>
            <div className="fb-form-group">
              <label>How would you rate the staff&#39;s professionalism and communication? <span className="fb-required-asterisk">*</span></label>
              <StarRating rating={professionalism} setRating={setProfessionalism} />
            </div>
            <div className="fb-form-group">
              <label>How effective was the resolution of your complaint? <span className="fb-required-asterisk">*</span></label>
              <StarRating rating={effectiveness} setRating={setEffectiveness} />
            </div>
            <div className="fb-form-group">
              <label>How easy was it to use the HostelCare system to submit your complaint? <span className="fb-required-asterisk">*</span></label>
              <StarRating rating={easeOfUse} setRating={setEaseOfUse} />
            </div>
            <div className="fb-form-group">
              <label htmlFor="feedback-comments">
                Tell us more about your experience or any suggestions for improvement
              </label>
              <textarea
                id="feedback-comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="e.g., The staff fixed the issue quickly and was very polite."
                rows="4"
              />
            </div>

          <div className="feedback-form-actions">
            {/* Disable buttons while loading */}
            <button type="button" className="btn btn-cancel" onClick={handleClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-submit" disabled={loading}>
              {/* Show loading text */}
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}