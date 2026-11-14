import { useState } from 'react';
import { FiMail, FiMapPin, FiSend } from 'react-icons/fi';
import './Contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Get in Touch</span>
          <h2 className="section-title">
            <span className="gradient-text">Contact</span> Us
          </h2>
          <p className="section-subtitle">
            Have questions or feedback? We would <span className="text-highlight-emerald">love</span> to hear from you.
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <h3>Let&apos;s <span className="text-violet">Connect</span></h3>
            <p>
              Whether you need help with <span className="text-highlight-cyan">synthetic data generation</span>, have feature requests,
              or want to collaborate, drop us a message.
            </p>
            <div className="contact-details">
              <div className="contact-item">
                <div className="contact-item-icon">
                  <FiMail />
                </div>
                <span>support@synthdata.io</span>
              </div>
              <div className="contact-item">
                <div className="contact-item-icon">
                  <FiMapPin />
                </div>
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name">Name</label>
              <input
                type="text"
                id="contact-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-email">Email</label>
              <input
                type="email"
                id="contact-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="contact-message">Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Your message..."
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              Send Message
              <FiSend />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;