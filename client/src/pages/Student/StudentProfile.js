import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
// import { auth } from '../../services/firebase';
// import { updateProfile, updateEmail, updatePassword } from 'firebase/auth';
import './StudentProfile.css';
import ProfileUpdateSuccess from './ProfileUpdateSuccess';
import { useNavigate } from 'react-router-dom';

export default function StudentProfile() {
    // initial values
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const navigate = useNavigate();

    // Email is not editable
    useEffect(() => {
        const fetchProfile = async () => {
          const {
            data: { user },
          } = await supabase.auth.getUser();
      
          if (!user) return;
      
          setEmail(user.email);
      
          const { data, error } = await supabase
            .from('users')
            .select('name, phone')
            .eq('id', user.id)
            .single();
      
          if (!error && data) {
            setName(data.name || '');
            setPhone(data.phone || '');
          }
        };
      
        fetchProfile();
      }, []);

      const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
      
        const {
          data: { user },
        } = await supabase.auth.getUser();
      
        if (!user) {
            setLoading(false);
            return;
        }
      
        const { error } = await supabase
          .from('users')
          .update({ name, phone })
          .eq('id', user.id);
      
        setLoading(false);
      
        if (!error) {
          setIsSuccessOpen(true);
        } else {
          alert(error.message);
        }
      };
      

    const handleSuccessClose = () => {
        setIsSuccessOpen(false);
        navigate('/student/dashboard');
    };

    return (
        <div className="sp-root">
            <div className="sp-card">
                <div className="sp-header">
                     <button className="sp-back-button" onClick={() => navigate(-1)}>
                        <svg 
                            width="27" 
                            height="27" 
                            viewBox="0 0 24 24" 
                            fill="none" 
                            stroke="#6C2AA4" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                    <h1 className="sp-title">Student Profile</h1>
                </div>

                <form onSubmit={handleUpdate} className="sp-form">

                    <label className="sp-label">NAME</label>
                    <input
                        className="sp-input"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <label className="sp-label">EMAIL</label>
                    <input
                        className="sp-input"
                        type="email"
                        value={email}
                        disabled
                        // style={{ backgroundColor: "#f0f0f0", cursor: "not-allowed" }}
                    />

                    <label className="sp-label">PHONE NUMBER</label>
                    <input
                        className="sp-input"
                        type="tel"
                        value={phone}
                        placeholder="+60 12 345 6789"
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    <button type="submit" className="sp-submit" disabled={loading}>
                        {loading ? 'Please wait...' : 'SAVE CHANGES'}
                    </button>
                </form>
                <ProfileUpdateSuccess open={isSuccessOpen} onClose={handleSuccessClose} />
            </div>
        </div>
    );
}