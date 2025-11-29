 // hotline
import { useState, useEffect } from 'react';
import { X, Phone, MessageCircle } from 'lucide-react';
import { authAPI } from '../src/api/auth';
import type { Hotline } from '../types/index';

export default function HotlineModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [hotlines, setHotlines] = useState<Hotline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      authAPI.getHotlines('KE').then(res => {
        setHotlines(res.data);
        setLoading(false);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-screen overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-red-600">Get Help Now</h2>
          <button onClick={onClose}><X /></button>
        </div>

        {loading ? (
          <p className="text-center py-10">Loading trusted hotlines...</p>
        ) : (
          <div className="space-y-4">
            {hotlines.map(h => (
              <div key={h.id} className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-5 border border-red-200">
                <h3 className="font-bold text-lg">{h.organization}</h3>
                <p className="text-gray-600 text-sm">{h.name}</p>
                
                <div className="mt-4 flex gap-3">
                  <a href={`tel:${h.phone}`} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                    <Phone size={20} /> Call {h.phone}
                  </a>
                  {h.whatsapp && (
                    <a href={`https://wa.me/${h.whatsapp.replace(/[^\d]/g, '')}`} className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                      <MessageCircle size={20} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}