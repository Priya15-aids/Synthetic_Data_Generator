import { useTheme } from '../../context/ThemeContext';
import './HowItWorks.css';

const steps = [
  {
    number: '01',
    title: 'Upload',
    description: 'Upload a CSV/Excel file or manually define your column structure with specific data types.',
  },
  {
    number: '02',
    title: 'Configure',
    description: 'Set the number of synthetic records to generate and review auto-detected column types.',
  },
  {
    number: '03',
    title: 'Generate',
    description: 'Click generate and watch as realistic synthetic data is created instantly in your browser.',
  },
  {
    number: '04',
    title: 'Download',
    description: 'Preview your data side-by-side, then download it as CSV or Excel for immediate use.',
  },
];

function HowItWorks() {
  const { theme } = useTheme();
  const processImage = theme === 'light'
    ? `${import.meta.env.BASE_URL}images/process-flow-light.png`
    : `${import.meta.env.BASE_URL}images/process-flow.png`;

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Workflow</span>
          <h2 className="section-title">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="section-subtitle">
            Generate <span className="text-highlight-violet">synthetic data</span> in four simple steps. Our <span className="text-highlight-cyan">intelligent engine</span> handles the complexity.
          </p>
        </div>

        <div className="process-layout">
          {}
          <div className="process-steps">
            {steps.map((step, index) => (
              <div className="process-step-item" key={index}>
                <div className="process-step-number">{step.number}</div>
                <div className="process-step-content">
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {}
          <div className="process-image-container">
            <img src={processImage} alt="Process flow: Upload, Configure, Generate, Download" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
