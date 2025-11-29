// src/pages/HomeDashboard.tsx
import React, { useState, useEffect } from 'react';
import { MessageCircle, FileText, Phone, Shield, LogOut, Plus } from 'lucide-react';
import { authAPI } from '../src/api/auth';
import type { User, Report } from '../types';
import ReportModal from '../pages/ReportModal';
import ChatbotModal from '../pages/ChatbotModal';
import HotlineModal from '../pages/HotlineModal';

interface Props {
  user: User;
  onLogout: () => void;
}

export default function HomeDashboard({ user, onLogout }: Props) {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showReportModal, setShowReportModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showHotlines, setShowHotlines] = useState(false);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setError(null);
      const res = await authAPI.getReports();
      setReports(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      console.error('Failed to load reports:', err);
      setError('Could not load your reports. Please try again.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // SAFETY FIRST: Never crash if user is null or missing fields
  if (!user) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-700">Session Error</h1>
          <p className="mt-4">Please log in again.</p>
          <button onClick={onLogout} className="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const userName = user.first_name || user.username || 'Survivor';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              SafeSpace
            </h1>
            <p className="text-gray-600 mt-1">Welcome back, {userName}</p>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-3 text-red-600 hover:text-red-700 font-medium transition"
          >
            <LogOut size={22} />
            Logout
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 text-center">
        <Shield className="w-24 h-24 mx-auto mb-6 opacity-90" />
        <h2 className="text-5xl font-bold">You are safe here.</h2>
        <p className="text-xl mt-4 opacity-95">We are with you — every moment.</p>
      </section>

      {/* Quick Actions */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-white rounded-3xl shadow-2xl p-10 text-center hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-purple-100"
        >
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Plus className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Report Incident</h3>
          <p className="text-gray-600 mt-3">Your voice matters. We hear you.</p>
        </button>

        <button
          onClick={() => setShowChatbot(true)}
          className="bg-white rounded-3xl shadow-2xl p-10 text-center hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-blue-100"
        >
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <MessageCircle className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Talk to Amina</h3>
          <p className="text-gray-600 mt-3">24/7 caring companion</p>
        </button>

        <button
          onClick={() => setShowHotlines(true)}
          className="bg-white rounded-3xl shadow-2xl p-10 text-center hover:shadow-3xl hover:scale-105 transition-all duration-300 border border-green-100"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <Phone className="w-12 h-12 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">Get Help Now</h3>
          <p className="text-gray-600 mt-3">Call trusted hotlines instantly</p>
        </button>
      </section>

      {/* Reports Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <FileText className="w-9 h-9 text-purple-600" />
          My Reports ({reports.length})
        </h2>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading your reports...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-6 rounded-2xl text-center">
            {error}
            <button onClick={loadReports} className="mt-4 underline font-medium">
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-16 text-center border border-purple-200">
            <p className="text-2xl text-gray-700">No reports yet.</p>
            <p className="text-gray-600 mt-4">Your safe space is ready whenever you are.</p>
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="grid gap-6">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-3xl shadow-xl p-8 border-l-8 border-purple-600 hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 capitalize">
                      {report.type_of_violence.replace(/_/g, ' ')}
                    </h3>
                    <p className="text-gray-500 mt-2">
                      {new Date(report.created_at).toLocaleDateString('en-KE', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                    <p className="text-gray-700 mt-4 text-lg leading-relaxed">
                      {report.description || 'No description provided.'}
                    </p>
                  </div>
                  <span className={`px-6 py-3 rounded-full text-lg font-bold ${
                    report.risk_level === 'critical' ? 'bg-red-100 text-red-700' :
                    report.risk_level === 'high' ? 'bg-orange-100 text-orange-700' :
                    report.risk_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {report.risk_level.toUpperCase()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* MODALS */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => {
          setShowReportModal(false);
          loadReports();
        }}
      />
      <ChatbotModal isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
      <HotlineModal isOpen={showHotlines} onClose={() => setShowHotlines(false)} />
    </div>
  );
}