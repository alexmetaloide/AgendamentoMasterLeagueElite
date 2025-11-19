import React, { useState, useEffect } from 'react';
import { Users, CalendarDays, Trophy } from 'lucide-react';
import { ViewMode, Opponent, MatchData, WeeklyAvailability } from './types';
import { INITIAL_OPPONENTS, INITIAL_MATCH_DATA } from './constants';
import { OpponentManager } from './components/OpponentManager';
import { ScheduleForm } from './components/ScheduleForm';
import { MessagePreview } from './components/MessagePreview';

function App() {
  // State for Opponents (persisted in localStorage)
  const [opponents, setOpponents] = useState<Opponent[]>(() => {
    const saved = localStorage.getItem('opponents');
    return saved ? JSON.parse(saved) : INITIAL_OPPONENTS;
  });

  // Persist opponents on change
  useEffect(() => {
    localStorage.setItem('opponents', JSON.stringify(opponents));
  }, [opponents]);

  const [view, setView] = useState<ViewMode>('form');
  const [formData, setFormData] = useState<MatchData>(INITIAL_MATCH_DATA);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);

  const generateMessage = () => {
    const opponent = opponents.find(o => o.id === Number(formData.opponentId));
    if (!opponent) return;

    const formatSlot = (start?: string, end?: string) => {
      if (!start && !end) return null;
      if (start && !end) return `${start} em diante`;
      if (!start && end) return `Até ${end}`;
      return `${start} às ${end}`;
    };

    const av = formData.availability;

    const daysMap: Array<{ key: keyof WeeklyAvailability, label: string }> = [
      { key: 'monday', label: 'Segunda-feira' },
      { key: 'tuesday', label: 'Terça-feira' },
      { key: 'wednesday', label: 'Quarta-feira' },
      { key: 'thursday', label: 'Quinta-feira' },
      { key: 'friday', label: 'Sexta-feira' },
      { key: 'saturday', label: 'Sábado' },
      { key: 'sunday', label: 'Domingo' },
    ];

    const availabilityLines = daysMap.map(day => {
      const dayData = av[day.key];
      const s1 = formatSlot(dayData.slot1.start, dayData.slot1.end);
      const s2 = formatSlot(dayData.slot2.start, dayData.slot2.end);

      if (!s1 && !s2) return `${day.label}: Indisponível`;
      
      let slotsText = "";
      if (s1 && s2) {
        slotsText = `${s1} | ${s2}`;
      } else if (s1) {
        slotsText = s1;
      } else if (s2) {
        slotsText = s2;
      }

      return `${day.label}: ${slotsText}`;
    }).join('\n');

    const msg = `🎮 AGENDAMENTO OFICIAL DE PARTIDA – ${formData.championship}

👤 Mandante: ${formData.host}
🏴‍☠️ Clube: ${formData.hostClub}
⚔️ Adversário: ${opponent.name}
📞 Contato: ${formData.host} (via WhatsApp)

Disponibilidade:
${availabilityLines}

Observação: ${formData.observation || 'Nenhuma'}

Caso a disponibilidade não coincida, favor entrar em contato
para definirmos um horário dentro do prazo da rodada.`;

    setGeneratedMessage(msg);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-slate-950 text-slate-200 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-900/70 backdrop-blur-md supports-[backdrop-filter]:bg-slate-900/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20">
              <Trophy className="text-white w-5 h-5" />
            </div>
            <h1 className="hidden sm:block text-lg font-bold tracking-tight text-white">
              Agendamento <span className="text-blue-400">Série E</span>
            </h1>
            <h1 className="sm:hidden text-lg font-bold tracking-tight text-white">
              Série E
            </h1>
          </div>
          
          <nav className="flex gap-2">
            <button 
              onClick={() => setView('form')}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                view === 'form' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-500' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <CalendarDays size={16} />
              <span className="hidden sm:inline">Agendar</span>
            </button>
            <button 
              onClick={() => setView('opponents')}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 flex items-center gap-2 ${
                view === 'opponents' 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-1 ring-blue-500' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Users size={16}/>
              <span className="hidden sm:inline">Adversários</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {view === 'opponents' ? (
          <OpponentManager 
            opponents={opponents} 
            setOpponents={setOpponents} 
            onBack={() => setView('form')}
          />
        ) : (
          <ScheduleForm 
            data={formData} 
            opponents={opponents} 
            onChange={setFormData}
            onGenerate={generateMessage}
          />
        )}
      </main>

      {/* Footer simple */}
      <footer className="py-6 text-center text-slate-600 text-xs">
        <p>&copy; {new Date().getFullYear()} Master League Elite. Todos os direitos reservados.</p>
      </footer>

      {/* Modal for Message */}
      {generatedMessage && (
        <MessagePreview 
          message={generatedMessage} 
          phoneNumber={opponents.find(o => o.id === Number(formData.opponentId))?.phone || ''} 
          onClose={() => setGeneratedMessage(null)} 
        />
      )}
    </div>
  );
}

export default App;