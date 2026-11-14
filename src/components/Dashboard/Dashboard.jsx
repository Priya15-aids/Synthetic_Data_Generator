import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  FiUpload,
  FiDatabase,
  FiFileText,
  FiDownload,
  FiTrash2,
  FiFolder,
} from 'react-icons/fi';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css';

function getUserFiles(userId) {
  const empty = { uploaded: [], generated: [] };
  const stored = localStorage.getItem(`synthdata_files_${userId}`);
  if (!stored) return empty;
  try {
    const parsed = JSON.parse(stored);
    return {
      uploaded: Array.isArray(parsed?.uploaded) ? parsed.uploaded : [],
      generated: Array.isArray(parsed?.generated) ? parsed.generated : [],
    };
  } catch {
    return empty;
  }
}

function saveUserFiles(userId, files) {
  localStorage.setItem(`synthdata_files_${userId}`, JSON.stringify(files));
}

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState({ uploaded: [], generated: [] });

  useEffect(() => {
    if (user) {
      setFiles(getUserFiles(user.id));
    }
  }, [user]);

  // Go to Home and scroll to the generator section
  const goToGenerator = (e) => {
    e.preventDefault();
    navigate('/');
    setTimeout(() => {
      const el =
        document.getElementById('generator') ||
        document.querySelector('.generate-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 300);
  };

  // Wait until the saved session is checked, then protect the page
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  const handleDownload = (file) => {
    const data = file.data;
    if (!data || data.length === 0) return;

    if (file.format === 'csv') {
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, file.name);
    } else {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
      saveAs(blob, file.name);
    }
  };

  const handleDelete = (type, index) => {
    const fileName = files[type][index]?.name || 'this file';
    if (!window.confirm(`Delete "${fileName}"? This cannot be undone.`)) return;

    const updated = { ...files };
    updated[type] = updated[type].filter((_, i) => i !== index);
    setFiles(updated);
    saveUserFiles(user.id, updated);
  };

  const totalFiles = files.uploaded.length + files.generated.length;

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p>Manage your uploaded and generated datasets</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-card-icon purple">
              <FiFolder />
            </div>
            <div className="stat-card-info">
              <h3>{totalFiles}</h3>
              <span>Total Files</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon cyan">
              <FiUpload />
            </div>
            <div className="stat-card-info">
              <h3>{files.uploaded.length}</h3>
              <span>Uploaded Files</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card-icon emerald">
              <FiDatabase />
            </div>
            <div className="stat-card-info">
              <h3>{files.generated.length}</h3>
              <span>Generated Files</span>
            </div>
          </div>
        </div>

        {}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2><FiUpload /> Uploaded Files</h2>
          </div>
          {files.uploaded.length > 0 ? (
            <div className="file-list">
              {files.uploaded.map((file, index) => (
                <div className="file-item" key={index}>
                  <div className="file-item-info">
                    <div className="file-item-icon upload">
                      <FiFileText />
                    </div>
                    <div className="file-item-details">
                      <h4>{file.name}</h4>
                      <span>{file.rows} rows &middot; {file.columns} columns &middot; {file.date}</span>
                    </div>
                  </div>
                  <div className="file-item-actions">
                    <button
                      className="file-action-btn"
                      onClick={() => handleDownload(file)}
                      title="Download"
                      aria-label={`Download ${file.name}`}
                    >
                      <FiDownload />
                    </button>
                    <button
                      className="file-action-btn delete"
                      onClick={() => handleDelete('uploaded', index)}
                      title="Delete"
                      aria-label={`Delete ${file.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FiUpload />
              <p>No uploaded files yet. <a href="#/" onClick={goToGenerator}>Upload a dataset</a> to get started.</p>
            </div>
          )}
        </div>

        {}
        <div className="dashboard-section">
          <div className="dashboard-section-header">
            <h2><FiDatabase /> Generated Files</h2>
          </div>
          {files.generated.length > 0 ? (
            <div className="file-list">
              {files.generated.map((file, index) => (
                <div className="file-item" key={index}>
                  <div className="file-item-info">
                    <div className="file-item-icon generated">
                      <FiFileText />
                    </div>
                    <div className="file-item-details">
                      <h4>{file.name}</h4>
                      <span>{file.rows} rows &middot; {file.columns} columns &middot; {file.date}</span>
                    </div>
                  </div>
                  <div className="file-item-actions">
                    <button
                      className="file-action-btn"
                      onClick={() => handleDownload(file)}
                      title="Download"
                      aria-label={`Download ${file.name}`}
                    >
                      <FiDownload />
                    </button>
                    <button
                      className="file-action-btn delete"
                      onClick={() => handleDelete('generated', index)}
                      title="Delete"
                      aria-label={`Delete ${file.name}`}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FiDatabase />
              <p>No generated files yet. <a href="#/" onClick={goToGenerator}>Generate synthetic data</a> to see them here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

export function saveToDashboard(userId, type, fileRecord) {
  if (!userId) return;
  const files = getUserFiles(userId);
  files[type].unshift(fileRecord);

  if (files[type].length > 50) files[type] = files[type].slice(0, 50);
  saveUserFiles(userId, files);
}
