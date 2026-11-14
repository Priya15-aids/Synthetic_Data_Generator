import {
  FiCpu,
  FiCode,
  FiBarChart2,
  FiBookOpen,
  FiHeart,
  FiDollarSign,
} from 'react-icons/fi';
import './UseCases.css';

const useCases = [
  {
    icon: <FiCpu />,
    title: 'Machine Learning',
    description: 'Train and test ML models with large, balanced datasets without collecting more real data.',
    tags: ['Model Training', 'Data Augmentation', 'Balanced Classes'],
    color: '#10b981',
    image: `${import.meta.env.BASE_URL}images/usecase-ml.png`,
  },
  {
    icon: <FiCode />,
    title: 'Software Testing',
    description: 'Generate realistic test data for databases, APIs, and applications without privacy concerns.',
    tags: ['QA Testing', 'Load Testing', 'Integration Tests'],
    color: '#a855f7',
    image: `${import.meta.env.BASE_URL}images/usecase-testing.png`,
  },
  {
    icon: <FiBarChart2 />,
    title: 'Data Analysis',
    description: 'Explore analytical techniques and build dashboards using realistic synthetic datasets.',
    tags: ['Analytics', 'BI Tools & Dashboards', 'Reporting Tools'],
    color: '#10b981',
    image: `${import.meta.env.BASE_URL}images/usecase-analysis.png`,
  },
  {
    icon: <FiBookOpen />,
    title: 'Education & Research',
    description: 'Teach data science concepts with realistic datasets that can be shared without cost anywhere.',
    tags: ['Teaching', 'Workshops & Seminars', 'Publications'],
    color: '#a855f7',
    image: `${import.meta.env.BASE_URL}images/usecase-education.png`,
  },
  {
    icon: <FiHeart />,
    title: 'Healthcare',
    description: 'Generate synthetic patient data for research while maintaining HIPAA compliance for researchers.',
    tags: ['Patient Records', 'Clinical Trials', 'HIPAA Safe'],
    color:'#10b981',
    image: `${import.meta.env.BASE_URL}images/usecase-healthcare.png`,
  },
  {
    icon: <FiDollarSign />,
    title: 'Finance',
    description: 'Create synthetic transaction and customer data for fraud detection model development in real-world.',
    tags: ['Transactions', 'Fraud Detection', 'Risk Models'],
    color: '#a855f7',
    image: `${import.meta.env.BASE_URL}images/usecase-finance.png`,
  },
];

function UseCases() {
  return (
    <section id="use-cases" className="use-cases">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Applications</span>
          <h2 className="section-title">
            Use <span className="gradient-text">Cases</span>
          </h2>
          <p className="section-subtitle">
            Synthetic data powers <span className="text-highlight-emerald">innovation</span> across <span className="text-highlight-blue">industries</span> and <span className="text-highlight-violet">disciplines</span>.
          </p>
        </div>

        <div className="use-cases-grid">
          {useCases.map((uc, index) => (
            <div className="use-case-card" key={index} style={{ '--card-color': uc.color }}>
              <div className="use-case-card-image">
                <img src={uc.image} alt={uc.title} />
              </div>
              <div className="use-case-icon-wrapper">
                {uc.icon}
              </div>
              <h3>{uc.title}</h3>
              <p>{uc.description}</p>
              <div className="use-case-tags">
                {uc.tags.map((tag) => (
                  <span className="use-case-tag" key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default UseCases;
