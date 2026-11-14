import './About.css';

const aboutCards = [
  {
    title: 'Privacy Safe',
    description: 'Generate data that mimics real-world patterns without exposing any actual personal or sensitive information. Comply with GDPR, HIPAA, and other regulations.',
    color: '#a855f7',
    image: '/images/about-privacy.png',
  },
  {
    title: 'Scalable',
    description: 'Transform a handful of sample records into thousands or millions of synthetic entries while preserving data distributions and correlations.',
    color: '#10b981',
    image: '/images/about-scalable.png',
  },
  {
    title: 'Intelligent',
    description: 'Our engine automatically detects column types and generates contextually appropriate values - names, emails, dates, numbers, and more.',
    color: '#f43f5e',
    image: '/images/about-intelligent.png',
  },
];

function About() {
  return (
    <section id="about" className="about">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">About the Platform</span>
          <h2 className="section-title">
            Why <span className="gradient-text">Synthetic Data</span>?
          </h2>
          <p className="section-subtitle">
            Real data is often <span className="text-highlight-violet">limited</span>, <span className="text-highlight-cyan">sensitive</span>, or hard to obtain. Synthetic data bridges that gap
            by creating <span className="text-highlight-emerald">realistic, privacy-safe</span> datasets that maintain the statistical properties of original data.
          </p>
        </div>

        <div className="about-grid">
          {aboutCards.map((card, index) => (
            <div className="about-card" key={index} style={{ '--card-color': card.color }}>
              <div className="about-card-image">
                <img src={card.image} alt={card.title} />
              </div>
              <div className="about-card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default About;