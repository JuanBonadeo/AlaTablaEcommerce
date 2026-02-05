'use client';

import { useState } from 'react';
import { X, Mail, Send } from 'lucide-react';
import { sendMarketingEmailAction } from '@/lib/actions/user/user.actions';

interface EmailMarketingModalProps {
  selectedUserIds: string[];
  onClose: () => void;
}

export default function EmailMarketingModal({ selectedUserIds, onClose }: EmailMarketingModalProps) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    try {
      const result = await sendMarketingEmailAction(selectedUserIds, subject, message);

      if (result.ok) {
        alert(result.message);
        onClose();
      } else {
        setError(result.message || 'Error al enviar el email');
      }
    } catch (err) {
      setError('Error inesperado al enviar el email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#171718] border border-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-400/20 rounded-lg">
              <Mail className="text-orange-400" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Email Marketing</h2>
              <p className="text-gray-400 text-sm">Enviar a {selectedUserIds.length} usuario(s)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Asunto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
              placeholder="Ej: Ofertas especiales de la semana"
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Mensaje <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={10}
              placeholder="Escribe tu mensaje aquí..."
              className="w-full bg-[#0a0a0a] border border-gray-800 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors resize-none"
            />
            <p className="text-gray-500 text-sm mt-2">
              Tip: Personaliza el mensaje para aumentar el engagement
            </p>
          </div>

          {/* Preview */}
          <div className="bg-[#0a0a0a] border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Vista previa:</p>
            <div className="space-y-2">
              <p className="text-white font-medium">{subject || 'Sin asunto'}</p>
              <p className="text-gray-300 text-sm whitespace-pre-wrap">
                {message || 'Sin mensaje'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-800">
            <button
              type="submit"
              disabled={isSending || !subject || !message}
              className="flex-1 flex items-center justify-center gap-2 bg-orange-400 hover:bg-orange-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Send size={18} />
              {isSending ? 'Enviando...' : 'Enviar Email'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-700 rounded-lg hover:bg-gray-800 text-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
