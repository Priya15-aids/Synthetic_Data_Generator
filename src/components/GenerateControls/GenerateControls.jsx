import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiInfo, FiDownload, FiCheckCircle, FiFile, FiAlertTriangle } from 'react-icons/fi';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { generateSyntheticData } from '../../utils/syntheticDataGenerator';
import { saveToDashboard } from '../Dashboard/Dashboard';
import { useAuth } from '../../context/AuthContext';
import DatasetPreview from '../DatasetPreview/DatasetPreview';
import './GenerateControls.css';

function GenerateControls({ columns, sourceData }) {
  const [numRecords, setNumRecords] = useState(100);
  const [generatedData, setGeneratedData] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fileName, setFileName] = useState('synthetic_dataset');
  const generatedRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setGeneratedData([]);
  }, [columns]);

  if (!columns || columns.length === 0) return null;

  const handleGenerate = () => {

    if (!user) {
      navigate('/login?redirect=generator');
      return;
    }

    setIsGenerating(true);
    setTimeout(() => {
      const data = generateSyntheticData(columns, sourceData, numRecords);
      setGeneratedData(data);
      setIsGenerating(false);

      setTimeout(() => {
        if (generatedRef.current) {
          generatedRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }, 300);
  };

  const downloadCSV = () => {
    const csv = Papa.unparse(generatedData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${fileName || 'synthetic_dataset'}.csv`);

    if (user) {
      saveToDashboard(user.id, 'generated', {
        name: `${fileName || 'synthetic_dataset'}.csv`,
        rows: generatedData.length,
        columns: columns.length,
        format: 'csv',
        date: new Date().toLocaleDateString(),
        data: generatedData.slice(0, 500), 
      });
    }
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(generatedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Synthetic Data');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName || 'synthetic_dataset'}.xlsx`);

    if (user) {
      saveToDashboard(user.id, 'generated', {
        name: `${fileName || 'synthetic_dataset'}.xlsx`,
        rows: generatedData.length,
        columns: columns.length,
        format: 'xlsx',
        date: new Date().toLocaleDateString(),
        data: generatedData.slice(0, 500),
      });
    }
  };


  return (
    <section className="generate-section">
      <div className="container">
        <div className="generate-controls">
          <div className="controls-card">
            <div className="controls-header">
              <FiZap />
              <h3>Generation Settings</h3>
            </div>

            <div className="controls-row">
              <div className="control-group">
                <label htmlFor="num-records">Number of Records</label>
                <input
                  id="num-records"
                  type="number"
                  min="1"
                  max="100000"
                  value={numRecords}
                  onChange={(e) => setNumRecords(Math.max(1, parseInt(e.target.value) || 1))}
                />
              </div>
              <div className="control-group">
                <label htmlFor="file-name">
                  <FiFile style={{ marginRight: '0.3rem', verticalAlign: 'middle' }} />
                  File Name
                </label>
                <input
                  id="file-name"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="synthetic_dataset"
                />
              </div>
              <button
                className="btn btn-primary generate-btn"
                onClick={handleGenerate}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Generate Dataset'}
                <FiZap />
              </button>
            </div>

            <div className="controls-info">
              <div className="info-item">
                <FiInfo />
                <span>{columns.length} columns detected</span>
              </div>
              <div className="info-item">
                <FiInfo />
                <span>{sourceData.length} source rows loaded</span>
              </div>
            </div>
          </div>

          {}
          {sourceData.length > 0 && (() => {
            let missingCount = 0;
            const colsWithMissing = new Set();
            sourceData.forEach(row => {
              columns.forEach(col => {
                const val = row[col];
                if (val === undefined || val === null || val === '') {
                  missingCount++;
                  colsWithMissing.add(col);
                }
              });
            });
            if (missingCount > 0) {
              return (
                <div className="source-warning">
                  <FiAlertTriangle />
                  <span>
                    Your source data has <strong>{missingCount} missing value{missingCount > 1 ? 's' : ''}</strong> across <strong>{colsWithMissing.size} column{colsWithMissing.size > 1 ? 's' : ''}</strong>. Generation will fill these gaps automatically.
                  </span>
                </div>
              );
            }
            return null;
          })()}

          {}
          {sourceData.length > 0 && (
            <DatasetPreview
              title="Source Data Preview"
              data={sourceData}
              columns={columns}
              maxRows={5}
            />
          )}

          {}
          {generatedData.length > 0 && (
            <div ref={generatedRef}>
              <DatasetPreview
                title="Generated Synthetic Data"
                data={generatedData}
                columns={columns}
                maxRows={15}
              />

              <div className="download-section">
                <div className="download-header">
                  <div className="download-info">
                    <FiCheckCircle />
                    <span>{generatedData.length} synthetic records ready</span>
                  </div>
                  <div className="download-buttons">
                    <button className="btn-download" onClick={downloadCSV}>
                      <FiDownload />
                      Download CSV
                    </button>
                    <button className="btn-download" onClick={downloadExcel}>
                      <FiDownload />
                      Download Excel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default GenerateControls;
