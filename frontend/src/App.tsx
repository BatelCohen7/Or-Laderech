import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage'; 
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ProjectsPage from './pages/ProjectsPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ResidentDashboard from './pages/ResidentDashboard';
import AccessibilityWidget from './components/AccessibilityWidget';
import AdminDashboard from './pages/AdminDashboard';
import TzfatProjectPage from './pages/TzfatProjectPage';
import ResidentLogin from './pages/ResidentLogin';
import ResidentRegistration from './pages/ResidentRegistration';
import ResidentRegistrationPage from './pages/ResidentRegistrationPage';
import PropertyModel3DPage from './pages/PropertyModel3DPage'; 
import PlanningRightsPage from './pages/PlanningRightsPage';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-white flex flex-col font-hebrew">
            <Header />
            <main className="flex-1">
              <ErrorBoundary>
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/services" element={<ServicesPage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/tzfat-canaan" element={<TzfatProjectPage />} />
                  <Route path="/planning-rights" element={<PlanningRightsPage />} />
                  <Route path="/resident-login" element={<ResidentLogin />} />
                  <Route path="/resident-registration" element={<ResidentRegistration />} />
                  <Route path="/register" element={<ResidentRegistrationPage />} />
                  <Route path="/property-3d/:propertyId" element={<PropertyModel3DPage />} />
                  
                  {/* Login Pages */}
                  <Route path="/login/:userType" element={<LoginPage />} />
                  
                  {/* Dashboard Pages - Demo Mode */}
                  <Route path="/dashboard/:userType" element={
                    <div className="min-h-screen bg-neutral-50">
                      <div className="bg-yellow-50 border-b border-yellow-200 p-4">
                        <div className="container mx-auto">
                          <div className="flex items-center justify-center text-yellow-800">
                            <span className="text-sm">
                              🔧 מצב דמו: מציג תוכן לדוגמה
                            </span>
                          </div>
                        </div>
                      </div>
                      <DashboardPage />
                    </div>
                  } />
                  <Route path="/resident-dashboard/:projectId?" element={
                    <div className="min-h-screen bg-neutral-50">
                      <div className="bg-yellow-50 border-b border-yellow-200 p-4">
                        <div className="container mx-auto">
                          <div className="flex items-center justify-center text-yellow-800">
                            <span className="text-sm">
                              🔧 מצב דמו: מציג תוכן לדוגמה
                            </span>
                          </div>
                        </div>
                      </div>
                      <ResidentDashboard />
                    </div>
                  } />
                  <Route path="/admin" element={
                    <div className="min-h-screen bg-neutral-50">
                      <div className="bg-yellow-50 border-b border-yellow-200 p-4">
                        <div className="container mx-auto">
                          <div className="flex items-center justify-center text-yellow-800">
                            <span className="text-sm">
                              🔧 מצב דמו: מציג תוכן לדוגמה
                            </span>
                          </div>
                        </div>
                      </div>
                      <AdminDashboard />
                    </div>
                  } />
                </Routes>
              </ErrorBoundary>
            </main>
            <Footer />
            
            {/* Accessibility Widget - זמין בכל דף */}
            <AccessibilityWidget />
          </div>
          
          {/* Toast Notifications */}
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontFamily: 'Assistant, Alef, system-ui, Arial, sans-serif',
                direction: 'rtl',
              },
              success: {
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App;