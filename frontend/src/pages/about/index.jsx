import React from 'react';
import './styles.css';

function About() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <h1>About Exyolive</h1>
        <p>Building innovative solutions for businesses worldwide since 2010.</p>
      </div>
      
      <div className="about-section">
        <div className="about-content">
          <h2>Our Story</h2>
          <p>
            Exyolive was founded in 2025 with a simple mission: to help businesses grow through innovative technology solutions. 
            What started as a small team of passionate developers .
          </p>
          <p>
            Our journey began when our founders recognized a gap in the market for intuitive, powerful business tools that didn't 
            require technical expertise to use. Since then, we've been dedicated to creating software that empowers businesses 
            of all sizes to achieve their goals.
          </p>
        </div>
        <div className="about-image">
          <div className="image-placeholder">
            <span>Company Image</span>
          </div>
        </div>
      </div>
      
      <div className="about-section reverse">
        <div className="about-content">
          <h2>Our Mission</h2>
          <p>
            At Exyolive, our mission is to democratize access to powerful business tools. We believe that every organization, 
            regardless of size or technical capabilities, should be able to leverage data and technology to grow and succeed.
          </p>
          <p>
            We're committed to creating intuitive, scalable solutions that solve real problems and deliver measurable results. 
            Our products are designed with the end-user in mind, ensuring that powerful functionality doesn't come at the cost 
            of usability.
          </p>
        </div>
        <div className="about-image">
          <div className="image-placeholder">
            <span>Mission Image</span>
          </div>
        </div>
      </div>
      
      <div className="team-section">
        <h2>Our Leadership Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="team-photo">
              <div className="photo-placeholder"></div>
            </div>
            <h3>Yash</h3>
            <p className="team-title">Chief Executive Officer</p>
            <p className="team-bio">yash has over 5 years of experience in technology and business leadership.</p>
          </div>
          
          <div className="team-member">
            <div className="team-photo">
              <div className="photo-placeholder"></div>
            </div>
            <h3>Yuva</h3>
            <p className="team-title">Chief Technology Officer</p>
            <p className="team-bio">yuva leads our engineering team with a focus on innovation and quality.</p>
          </div>
          
          <div className="team-member">
            <div className="team-photo">
              <div className="photo-placeholder"></div>
            </div>
            <h3>Siddharth </h3>
            <p className="team-title">Chief Product Officer</p>
            <p className="team-bio">Siddharth ensures our products meet the evolving needs of our customers.</p>
          </div>
          
          <div className="team-member">
            <div className="team-photo">
              <div className="photo-placeholder"></div>
            </div>
            <h3>Arnav</h3>
            <p className="team-title">Chief Marketing Officer</p>
            <p className="team-bio">Arnav drives our brand strategy and customer engagement initiatives.</p>
          </div>
        </div>
      </div>
      
      <div className="values-section">
        <h2>Our Core Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <h3>Innovation</h3>
            <p>We constantly push the boundaries of what's possible to create cutting-edge solutions.</p>
          </div>
          
          <div className="value-card">
            <h3>Integrity</h3>
            <p>We build trust through honesty, transparency, and ethical business practices.</p>
          </div>
          
          <div className="value-card">
            <h3>Customer Focus</h3>
            <p>Our customers' success is our success. We listen, learn, and deliver value.</p>
          </div>
          
          <div className="value-card">
            <h3>Collaboration</h3>
            <p>We believe great ideas come from diverse perspectives working together.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
