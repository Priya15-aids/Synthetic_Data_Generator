import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiFile, FiX, FiPlus, FiColumns } from 'react-icons/fi';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useAuth } from '../../context/AuthContext';
import { saveToDashboard } from '../Dashboard/Dashboard';
import './DatasetUpload.css';

const COLUMN_TYPES = [
  'Auto Detect',
  'Name',
  'Email',
  'Phone',
  'City',
  'Country',
  'Date',
  'Age',
  'Salary',
  'Price',
  'Status',
  'ID',
  'Text',
];

function DatasetUpload({ onDataLoaded }) {
  const [activeTab, setActiveTab] = useState('upload');
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [customColumns, setCustomColumns] = useState([
    { name: 'id', type: 'ID' },
    { name: 'name', type: 'Name' },
    { name: 'email', type: 'Email' },
  ]);
  const fileInputRef = useRef(null);
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Signed-out visitors are sent to login right away.
  // Returns true if the visitor may continue.
  const requireLogin = () => {
    if (loading) return false;
    if (!user) {
      navigate('/login?redirect=generator');
      return false;
    }
    return true;
  };

  const handleTabSwitch = (tab) => {
    if (tab !== activeTab) {

      onDataLoaded([], [], '');
      setFileName('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setActiveTab(tab);
    }
  };

  const parseFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const columns = results.meta.fields || [];
          onDataLoaded(columns, results.data, file.name);
          setFileName(file.name);

          if (user) {
            saveToDashboard(user.id, 'uploaded', {
              name: file.name,
              rows: results.data.length,
              columns: columns.length,
              format: 'csv',
              date: new Date().toLocaleDateString(),
              data: results.data.slice(0, 500),
            });
          }
        },
      });
    } else if (['xlsx', 'xls'].includes(extension)) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const workbook = XLSX.read(e.target.result, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        const columns = data.length > 0 ? Object.keys(data[0]) : [];
        onDataLoaded(columns, data, file.name);
        setFileName(file.name);

        if (user) {
          saveToDashboard(user.id, 'uploaded', {
            name: file.name,
            rows: data.length,
            columns: columns.length,
            format: 'xlsx',
            date: new Date().toLocaleDateString(),
            data: data.slice(0, 500),
          });
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a CSV or Excel file.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) parseFile(file);
  };

  const handleZoneClick = () => {
    if (!requireLogin()) return;
    fileInputRef.current?.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (!requireLogin()) return;
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const removeFile = () => {
    setFileName('');
    onDataLoaded([], [], '');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const addColumn = () => {
    setCustomColumns([...customColumns, { name: '', type: 'Auto Detect' }]);
  };

  const removeColumn = (index) => {
    setCustomColumns(customColumns.filter((_, i) => i !== index));
  };

  const updateColumn = (index, field, value) => {
    const updated = [...customColumns];
    updated[index][field] = value;
    setCustomColumns(updated);
  };

  const applyCustomColumns = () => {
    if (!requireLogin()) return;
    const validCols = customColumns.filter((c) => c.name.trim() !== '');
    if (validCols.length === 0) {
      alert('Please add at least one column with a name.');
      return;
    }
    const columns = validCols.map((c) => c.name.trim());
    onDataLoaded(columns, [], '');
  };

  return (
    <section id="generator" className="dataset-upload">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Generator</span>
          <h2 className="section-title">
            <span className="gradient-text">Generate</span> Your Dataset
          </h2>
          <p className="section-subtitle">
            Upload an existing dataset or define custom columns to get started.
          </p>
        </div>

        <div className="upload-content">
          <div className="upload-tabs">
            <button
              className={`upload-tab ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('upload')}
            >
              <FiUploadCloud />
              Upload File
            </button>
            <button
              className={`upload-tab ${activeTab === 'custom' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('custom')}
            >
              <FiColumns />
              Custom Columns
            </button>
          </div>

          {activeTab === 'upload' && (
            <div>
              <div
                className={`upload-zone ${dragOver ? 'drag-over' : ''}`}
                onClick={handleZoneClick}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                role="button"
                tabIndex={0}
                aria-label="Upload file area"
              >
                <div className="upload-zone-visual">
                  <div className="upload-zone-icon-wrapper">
                    <FiUploadCloud className="upload-zone-icon" />
                  </div>
                </div>
                <h3>Drop your file here or click to browse</h3>
                <p>Upload a dataset to use as a template for synthetic data generation</p>
                <div className="upload-formats">
                  <span className="format-badge">.CSV</span>
                  <span className="format-badge">.XLSX</span>
                  <span className="format-badge">.XLS</span>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                hidden
                aria-hidden="true"
              />
              {fileName && (
                <div className="file-info">
                  <div className="file-info-left">
                    <FiFile />
                    <span>{fileName}</span>
                  </div>
                  <button className="file-remove-btn" onClick={removeFile} aria-label="Remove file">
                    <FiX />
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'custom' && (
            <div className="custom-columns">
              <h3>Define Your Columns</h3>
              <div className="columns-list">
                {customColumns.map((col, index) => (
                  <div className="column-row" key={index}>
                    <input
                      type="text"
                      placeholder="Column name"
                      value={col.name}
                      onChange={(e) => updateColumn(index, 'name', e.target.value)}
                      aria-label={`Column ${index + 1} name`}
                    />
                    <select
                      value={col.type}
                      onChange={(e) => updateColumn(index, 'type', e.target.value)}
                      aria-label={`Column ${index + 1} type`}
                    >
                      {COLUMN_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                    <button
                      className="remove-col-btn"
                      onClick={() => removeColumn(index)}
                      aria-label={`Remove column ${index + 1}`}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
              <button className="add-column-btn" onClick={addColumn}>
                <FiPlus />
                Add Column
              </button>
              <div style={{ marginTop: '1.5rem' }}>
                <button className="btn btn-primary" onClick={applyCustomColumns}>
                  Apply Columns
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DatasetUpload;
