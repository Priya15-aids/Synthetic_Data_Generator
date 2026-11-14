import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import About from './components/About/About';
import Features from './components/Features/Features';
import HowItWorks from './components/HowItWorks/HowItWorks';
import UseCases from './components/UseCases/UseCases';
import DatasetUpload from './components/DatasetUpload/DatasetUpload';
import GenerateControls from './components/GenerateControls/GenerateControls';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import ForgotPassword from './components/Auth/ForgotPassword';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function HomePage() {
  const [columns, setColumns] = useState([]);
  const [sourceData, setSourceData] = useState([]);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleDataLoaded = (cols, data, fileName) => {
    setColumns(cols);
    setSourceData(data);
    if (fileName) setUploadedFileName(fileName);

    if (cols && cols.length > 0) {
      setTimeout(() => {
        const el = document.querySelector('.generate-section');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 200);
    }
  };

  return (
    <>
      <Hero />
      <About />
      <Features />
      <HowItWorks />
      <UseCases />
      <DatasetUpload onDataLoaded={handleDataLoaded} />
      <GenerateControls columns={columns} sourceData={sourceData} uploadedFileName={uploadedFileName} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <div className="app">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;