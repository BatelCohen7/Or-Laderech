import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/guards/ProtectedRoute';

// Resident Pages
import ResidentDashboard from '../pages/resident/DashboardPage';
import DocumentsPage from '../pages/resident/DocumentsPage';
import DocumentDetailsPage from '../pages/resident/DocumentDetailsPage';
import VotesPage from '../pages/resident/VotesPage';
import VoteDetailsPage from '../pages/resident/VoteDetailsPage';
import MessagesPage from '../pages/resident/MessagesPage';
import MessageDetailsPage from '../pages/resident/MessageDetailsPage';
import ProfilePage from '../pages/resident/ProfilePage';
import HelpPage from '../pages/resident/HelpPage';

// Committee Pages
import CommitteeDashboard from '../pages/committee/DashboardPage';
import CommitteeDocumentsPage from '../pages/committee/DocumentsPage';
import UploadDocumentPage from '../pages/committee/UploadDocumentPage';
import AssignDocumentPage from '../pages/committee/AssignDocumentPage';
import DocumentStatusPage from '../pages/committee/DocumentStatusPage';
import CommitteeVotesPage from '../pages/committee/VotesPage';
import CreateVotePage from '../pages/committee/CreateVotePage';
import VoteResultsPage from '../pages/committee/VoteResultsPage';
import VoteParticipationPage from '../pages/committee/VoteParticipationPage';
import CommitteeMessagesPage from '../pages/committee/MessagesPage';
import CreateMessagePage from '../pages/committee/CreateMessagePage';
import MessageDeliveriesPage from '../pages/committee/MessageDeliveriesPage';
import ResidentsPage from '../pages/committee/ResidentsPage';
import AuditPage from '../pages/committee/AuditPage';

/**
 * App Routes Configuration
 * 
 * All routes from SCREENS_V1.md:
 * - Resident routes: /resident/*
 * - Committee routes: /committee/*
 * - Protected by RBAC guards
 */
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Resident Routes */}
      <Route
        path="/resident/dashboard"
        element={
          <ProtectedRoute requiredRole="resident">
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/documents"
        element={
          <ProtectedRoute requiredRole="resident">
            <DocumentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/documents/:id"
        element={
          <ProtectedRoute requiredRole="resident">
            <DocumentDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/votes"
        element={
          <ProtectedRoute requiredRole="resident">
            <VotesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/votes/:id"
        element={
          <ProtectedRoute requiredRole="resident">
            <VoteDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/messages"
        element={
          <ProtectedRoute requiredRole="resident">
            <MessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/messages/:id"
        element={
          <ProtectedRoute requiredRole="resident">
            <MessageDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/profile"
        element={
          <ProtectedRoute requiredRole="resident">
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resident/help"
        element={
          <ProtectedRoute requiredRole="resident">
            <HelpPage />
          </ProtectedRoute>
        }
      />

      {/* Committee Routes */}
      <Route
        path="/committee/dashboard"
        element={
          <ProtectedRoute requiredRole="committee">
            <CommitteeDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/documents"
        element={
          <ProtectedRoute requiredRole="committee">
            <CommitteeDocumentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/documents/upload"
        element={
          <ProtectedRoute requiredRole="committee">
            <UploadDocumentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/documents/:id/assign"
        element={
          <ProtectedRoute requiredRole="committee">
            <AssignDocumentPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/documents/:id/status"
        element={
          <ProtectedRoute requiredRole="committee">
            <DocumentStatusPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/votes"
        element={
          <ProtectedRoute requiredRole="committee">
            <CommitteeVotesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/votes/create"
        element={
          <ProtectedRoute requiredRole="committee">
            <CreateVotePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/votes/:id/results"
        element={
          <ProtectedRoute requiredRole="committee">
            <VoteResultsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/votes/:id/participation"
        element={
          <ProtectedRoute requiredRole="committee">
            <VoteParticipationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/messages"
        element={
          <ProtectedRoute requiredRole="committee">
            <CommitteeMessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/messages/create"
        element={
          <ProtectedRoute requiredRole="committee">
            <CreateMessagePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/messages/:id/cancel"
        element={
          <ProtectedRoute requiredRole="committee">
            <CommitteeMessagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/messages/:id/deliveries"
        element={
          <ProtectedRoute requiredRole="committee">
            <MessageDeliveriesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/residents"
        element={
          <ProtectedRoute requiredRole="committee">
            <ResidentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/committee/audit"
        element={
          <ProtectedRoute requiredRole="committee">
            <AuditPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/resident/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
