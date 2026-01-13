import React from 'react';
import './FeedbackForm.css';

const DisplayStarRating = ({ rating }) => {
    return (
        <div className="star-rating read-only">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <span
                        key={ratingValue}
                        className={`star-button ${ratingValue <= rating ? 'filled' : ''}`}
                    >
                        &#9733;
                    </span>
                );
            })}
        </div>
    );
};

const ViewFeedbackModal = ({ open, feedback, onClose }) => {
    if (!open || !feedback) return null;
  
    return (
      <div className="fb-modal-overlay">
        <div className="fb-modal-content feedback-modal view-feedback">
          <button className="fb-modal-close-btn" onClick={onClose}>&times;</button>
  
          <h2 className="fb-modal-title">Feedback Details</h2>
  
          <div className="feedback-form">
            <div className="form-group">
              <label>Satisfaction with the service:</label>
              <DisplayStarRating rating={feedback.overall_rating} />
            </div>
  
            <div className="form-group">
              <label>Staff professionalism:</label>
              <DisplayStarRating rating={feedback.timeliness_rating} />
            </div>
  
            <div className="form-group">
              <label>Effectiveness of the resolution:</label>
              <DisplayStarRating rating={feedback.effectiveness_rating} />
            </div>
  
            <div className="form-group">
              <label>Ease of using the HostelCare system:</label>
              <DisplayStarRating rating={feedback.ease_of_use_rating} />
            </div>
  
            <div className="form-group">
              <label>Additional comments:</label>
              <textarea
                value={feedback.comment || 'No comments'}
                readOnly
                rows="4"
              />
            </div>
  
            <div className="feedback-form-actions">
              <button className="btn btn-submit" onClick={onClose}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  };  

export default ViewFeedbackModal;