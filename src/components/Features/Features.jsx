import { useState } from 'react';
import {
  FiUpload,
  FiColumns,
  FiEye,
  FiSliders,
  FiDownload,
  FiRefreshCw,
} from 'react-icons/fi';
import './Features.css';

const features = [
  {
    icon: <FiUpload />,
    title: 'CSV & Excel Upload',
    description: 'Upload your existing datasets in CSV or Excel format. The system auto-detects column types.',
    color: '#10b981',
  },
  {
    icon: <FiColumns />,
    title: 'Custom Columns',
    description: 'Define your own column structure from scratch with configurable data types.',
    color: '#C0C0C0',
  },
  {
    icon: <FiEye />,
    title: 'Live Preview',
    description: 'Preview your original and generated data side-by-side before downloading.',
    color: '#f43f5e',
  },
  {
    icon: <FiSliders />,
    title: 'Flexible Controls',
    description: 'Specify exactly how many records you need - from 10 to 100,000+ rows.',
    color: '#10b981',
  },
  {
    icon: <FiDownload />,
    title: 'Export Formats',
    description: 'Download your synthetic dataset as CSV or Excel file, ready for immediate use.',
    color: '#C0C0C0',
  },
  {
    icon: <FiRefreshCw />,
    title: 'Pattern Preservation',
    description: 'Generated data maintains statistical patterns and distributions from source data.',
    color: '#ec4899',
  },
];

function Features() {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section id="features" className="features">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Features</span>
          <h2 className="section-title">
            Powerful <span className="gradient-text">Capabilities</span>
          </h2>
          <p className="section-subtitle">
            Everything you need to generate <span className="text-highlight-violet">high-quality</span> synthetic datasets in <span className="text-highlight-cyan">one platform</span>.
          </p>
        </div>

        <div className="features-row">
          {features.map((feature, index) => {
            const isSelected = activeIndex === index;
            const isDefault = activeIndex === null;
            const isActive = isDefault || isSelected;

            return (
              <div
                className={`feature-card ${isActive ? 'active' : 'dimmed'} ${isSelected ? 'selected' : ''}`}
                key={index}
                onClick={() => handleClick(index)}
                style={{ '--feature-color': feature.color }}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Features;