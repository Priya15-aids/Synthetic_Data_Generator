import { FiArrowDown, FiZap, FiDatabase, FiTrendingUp, FiCpu } from 'react-icons/fi';
import './Hero.css';

function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-bg-effects">
        <div className="hero-gradient-orb orb-1"></div>
        <div className="hero-gradient-orb orb-2"></div>
        <div className="hero-gradient-orb orb-3"></div>
        <div className="hero-grid-pattern"></div>
      </div>
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              <FiZap />
              <span>AI-Powered Data Generation</span>
            </div>
            <h1 className="hero-title">
              Generate <span className="text-violet">Realistic</span>
              <span className="gradient-text"> Synthetic Datasets</span>
              <br />for <span className="text-cyan">Data Analysis</span>
            </h1>
            <p className="hero-subtitle">
              Transform small datasets into <span className="text-highlight-emerald">large, high-quality</span> synthetic data that preserves
              original patterns. Perfect for <span className="text-highlight-blue">machine learning</span>, <span className="text-highlight-violet">testing</span>, and <span className="text-highlight-cyan">development</span>.
            </p>
            <div className="hero-actions">
              <a href="#generator" className="btn btn-primary">
                Start Generating
                <FiZap />
              </a>
              <a href="#about" className="btn btn-secondary">
                Learn More
                <FiArrowDown />
              </a>
            </div>
          </div>

          <div className="hero-illustration">
            <div className="illustration-card">
              <div className="illust-header">
                <div className="illust-dots">
                  <span></span><span></span><span></span>
                </div>
                <span className="illust-title">synthetic_data.csv</span>
              </div>
              <div className="illust-body">
                <div className="illust-row illust-row-header">
                  <span>Name</span><span>Email</span><span>Age</span><span>City</span>
                </div>
                <div className="illust-row">
                  <span>Alice Smith</span><span>alice@mail.com</span><span>28</span><span>New York</span>
                </div>
                <div className="illust-row">
                  <span>Bob Johnson</span><span>bob@mail.com</span><span>34</span><span>Chicago</span>
                </div>
                <div className="illust-row generating">
                  <span>Diana Lee</span><span>diana@mail.com</span><span>25</span><span>Austin</span>
                </div>
                <div className="illust-row generating delay-1">
                  <span>Edward Park</span><span>edward@mail.com</span><span>41</span><span>Seattle</span>
                </div>
                <div className="illust-row generating delay-2">
                  <span>Fiona Davis</span><span>fiona@mail.com</span><span>30</span><span>Denver</span>
                </div>
              </div>
              <div className="illust-footer">
                <FiDatabase />
                <span>Generating 10,000 rows...</span>
                <div className="illust-progress">
                  <div className="illust-progress-bar"></div>
                </div>
              </div>
            </div>
            <div className="floating-badge badge-1">
              <FiTrendingUp />
              <span>99% Accuracy</span>
            </div>
            <div className="floating-badge badge-2">
              <FiCpu />
              <span>AI Powered</span>
            </div>
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">10M+</span>
            <span className="stat-label">Records Generated</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Column Types</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">99%</span>
            <span className="stat-label">Pattern Accuracy</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;