import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await axios.post('http://localhost:8000/api/contact', formData);
      
      if (response.data.success) {
        setStatus({
          type: 'success',
          message: response.data.message
        });
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        
        // Show success for 3 seconds then redirect
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
      }
    } catch (error) {
      console.error('Contact form error:', error);
      
      const errorMessage = error.response?.data?.message || 
                          'Failed to send message. Please try again later.';
      
      setStatus({
        type: 'error',
        message: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h1 className="h3 mb-0">📧 Contact Learn and Grow</h1>
              <p className="mb-0">We'd love to hear from you!</p>
            </div>
            
            <div className="card-body">
              {/* Return to Dashboard Button */}
              <button
                className="btn btn-outline-secondary mb-4"
                onClick={() => navigate('/dashboard')}
              >
                ← Return to Dashboard
              </button>

              {/* Status Messages */}
              {status.message && (
                <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} alert-dismissible fade show`}>
                  <strong>{status.type === 'success' ? '✅ Success!' : '❌ Error!'}</strong> {status.message}
                  {status.type === 'success' && (
                    <div className="mt-2">
                      <small>Redirecting to dashboard in 3 seconds...</small>
                    </div>
                  )}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setStatus({ type: '', message: '' })}
                  ></button>
                </div>
              )}

              {/* Contact Information */}
              <div className="row mb-4">
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded">
                    <h5>📞 Get in Touch</h5>
                    <p className="mb-1"><strong>Email:</strong> dialoabo@gmail.com</p>
                    <p className="mb-1"><strong>Response Time:</strong> 24-48 hours</p>
                    <p className="mb-0"><strong>Support:</strong> Monday - Friday, 9 AM - 6 PM</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="bg-light p-3 rounded">
                    <h5>🎓 Quick Links</h5>
                    <p className="mb-1"><a href="/about" className="text-decoration-none">About Our Platform</a></p>
                    <p className="mb-1"><a href="/program" className="text-decoration-none">Browse Programs</a></p>
                    <p className="mb-0"><a href="/tutors" className="text-decoration-none">Meet Our Tutors</a></p>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">
                      <strong>Full Name *</strong>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      minLength="2"
                      maxLength="100"
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      <strong>Email Address *</strong>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    <strong>Message *</strong>
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="6"
                    placeholder="How can we help you? Please share your questions, feedback, or inquiries..."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    minLength="10"
                    maxLength="2000"
                  ></textarea>
                  <div className="form-text">
                    {formData.message.length}/2000 characters
                  </div>
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending Message...
                      </>
                    ) : (
                      <>
                        📧 Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;