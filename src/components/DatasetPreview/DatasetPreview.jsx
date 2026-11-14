import { FiTable, FiCheck } from 'react-icons/fi';
import './DatasetPreview.css';

function DatasetPreview({ title, data, columns, maxRows = 10 }) {
  if (!columns || columns.length === 0) return null;

  const displayData = data.slice(0, maxRows);

  return (
    <div className="dataset-preview">
      <div className="preview-header">
        <div className="preview-title">
          <FiTable />
          <h3>{title}</h3>
        </div>
        <span className="preview-badge">
          <FiCheck />
          {data.length} {data.length === 1 ? 'row' : 'rows'}
        </span>
      </div>
      <div className="preview-table-wrapper">
        <table className="preview-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayData.length > 0 ? (
              displayData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => (
                    <td key={col}>{row[col] !== undefined ? String(row[col]) : ''}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="empty-cell">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {data.length > maxRows && (
        <p className="preview-more">
          Showing {maxRows} of {data.length} rows
        </p>
      )}
    </div>
  );
}

export default DatasetPreview;