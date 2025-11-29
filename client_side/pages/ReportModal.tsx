import { useState } from 'react';
import { X, AlertCircle, Upload, Loader2 } from 'lucide-react';
import { authAPI } from '../src/api/auth';

export default function ReportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    type_of_violence: 'physical',
    description: '',
    location: '',
    perpetrator_relation: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await authAPI.createReport(form);
      if (file) await authAPI.uploadEvidence(res.data.id, file);
      alert('Report submitted safely. You are brave.');
      onClose();
    } catch (err) {
      alert('Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-screen overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Report Incident</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="space-y-4">
          <select value={form.type_of_violence} onChange={e => setForm({...form, type_of_violence: e.target.value})}
            className="w-full p-3 border rounded-lg">
            <option value="physical">Physical Violence</option>
            <option value="sexual">Sexual Violence</option>
            <option value="emotional">Emotional Abuse</option>
            <option value="economic">Economic Abuse</option>
          </select>

          <textarea
            placeholder="What happened? You can write as much or as little as you want..."
            rows={6}
            value={form.description}
            onChange={e => setForm({...form, description: e.target.value})}
            className="w-full p-3 border rounded-lg"
          />

          <input type="text" placeholder="Location (optional)" className="w-full p-3 border rounded-lg"
            onChange={e => setForm({...form, location: e.target.value})} />

          <div>
            <label className="block text-sm font-medium mb-2">Attach evidence (photo/audio) - optional</label>
            <input type="file" accept="image/*,audio/*" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>

          <button onClick={handleSubmit} disabled={loading || !form.description}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : 'Submit Report Safely'}
          </button>
        </div>
      </div>
    </div>
  );
}