import React, { useRef } from 'react';
import { Button } from './Button';
import { Copy, Send, MessageSquare, X } from 'lucide-react';

interface MessagePreviewProps {
  message: string;
  phoneNumber: string;
  onClose: () => void;
}

export const MessagePreview: React.FC<MessagePreviewProps> = ({ message, phoneNumber, onClose }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleCopy = () => {
    if (textAreaRef.current) {
      textAreaRef.current.select();
      navigator.clipboard.writeText(message);
      alert("Mensagem copiada para a área de transferência!");
    }
  };

  const handleWhatsApp = () => {
    // Remove non-digits from phone
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl shadow-2xl shadow-black max-w-lg w-full flex flex-col max-h-[90vh] border border-slate-700 transform animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-700/50 flex justify-between items-center bg-gradient-to-r from-slate-800 to-slate-900 rounded-t-2xl">
          <div>
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <MessageSquare size={22} className="text-blue-400"/> Mensagem Gerada
            </h3>
            <p className="text-xs text-slate-400 mt-1">Revise os dados antes de enviar</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <div className="relative flex-grow">
            <textarea 
              ref={textAreaRef}
              readOnly
              className="w-full h-full p-4 bg-slate-950/50 border border-slate-700/50 rounded-xl text-sm font-mono resize-none focus:outline-none text-slate-300 leading-relaxed"
              value={message}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-slate-700/50 bg-slate-900 rounded-b-2xl flex flex-col sm:flex-row gap-3">
          <Button variant="secondary" onClick={handleCopy} className="flex-1 flex justify-center items-center gap-2">
             <Copy size={18} /> Copiar
          </Button>
          <Button variant="success" onClick={handleWhatsApp} className="flex-[2] flex justify-center items-center gap-2 shadow-emerald-500/20">
             <Send size={18} /> Enviar via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};