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
                <button className="fb-modal-close-btn" onClick={onClose} aria-label="Close modal">
                    &times;
                </button>
                
                <h2 className="fb-modal-title">Feedback Details</h2>
                
                <div className="feedback-form">
                    <div className="form-group">
                        <label>Satisfaction with the service:</label>
                        <DisplayStarRating rating={feedback.satisfaction} />
                    </div>
                    <div className="form-group">
                        <label>Staff professionalism:</label>
                        <DisplayStarRating rating={feedback.professionalism} />
                    </div>
                    <div className="form-group">
                        <label>Effectiveness of the resolution:</label>
                        <DisplayStarRating rating={feedback.effectiveness} />
                    </div>
                    <div className="form-group">
                        <label>Ease of using the HostelCare system:</label>
                        <DisplayStarRating rating={feedback.easeOfUse} />
                    </div>
        
                    <div className="form-group">
                        <label htmlFor="feedback-comments-view">Additional comments:</label>
                        <textarea
                            id="feedback-comments-view"
                            className={!feedback.comments ? 'no-comments-display' : ''}
                            value={feedback.comments ? feedback.comments : 'No Comments'}
                            readOnly
                            rows="4"
                        />
                    </div>

                    <div className="feedback-form-actions">
                        <button type="button" className="btn btn-submit" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewFeedbackModal;