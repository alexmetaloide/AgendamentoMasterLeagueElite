import React from 'react';
import { MatchData, Opponent, WeeklyAvailability, DailyAvailability } from '../types';
import { CHAMPIONSHIPS } from '../constants';
import { Button } from './Button';
import { Calendar, Clock, User, Hash, MessageCircle, Shield, Info } from 'lucide-react';

interface ScheduleFormProps {
  data: MatchData;
  opponents: Opponent[];
  onChange: (data: MatchData) => void;
  onGenerate: () => void;
}

interface DayRowProps {
  label: string;
  dayData: DailyAvailability;
  isLast?: boolean;
  onChange: (slot: 'slot1' | 'slot2', field: 'start' | 'end', value: string) => void;
}

const inputBaseStyles = "w-full px-3 py-2.5 border border-slate-700 bg-slate-900/50 text-white placeholder-slate-500 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-colors";
const selectBaseStyles = "w-full px-3 py-2.5 border border-slate-700 bg-slate-900/50 text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-colors appearance-none cursor-pointer hover:bg-slate-800/50";

const generateTimeOptions = () => {
  const options = [{ value: '', label: '--:--' }];
  for (let h = 0; h < 24; h++) {
    const hour = h.toString().padStart(2, '0');
    options.push({ value: `${hour}:00`, label: `${hour}:00` });
    options.push({ value: `${hour}:30`, label: `${hour}:30` });
  }
  return options;
};

const TIME_OPTIONS = generateTimeOptions();

const DayRow: React.FC<DayRowProps> = ({ label, dayData, isLast, onChange }) => {
  const isOptionDisabled = (startTime: string, optionValue: string) => {
    if (!startTime || !optionValue) return false;
    return optionValue <= startTime;
  };

  // Check if day has any availability set
  const isActive = dayData.slot1.start || dayData.slot2.start;

  return (
    <div className={`py-4 ${!isLast ? 'border-b border-slate-700/50' : ''} transition-colors hover:bg-slate-800/30 px-2 -mx-2 rounded-lg`}>
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center min-w-[100px]">
          <div className={`w-2 h-2 rounded-full mr-3 ${isActive ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`}></div>
          <span className={`text-sm font-medium ${isActive ? 'text-blue-300' : 'text-slate-400'}`}>{label}</span>
        </div>
        
        <div className="flex-grow grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Slot 1 */}
          <div className="flex items-center gap-2 bg-slate-900/30 p-1.5 rounded-md border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-1">1º</span>
            <div className="relative w-full">
              <select 
                className="w-full bg-transparent text-sm text-white border-none p-0 focus:ring-0 cursor-pointer text-center font-mono"
                value={dayData.slot1.start}
                onChange={(e) => onChange('slot1', 'start', e.target.value)}
              >
                {TIME_OPTIONS.map(opt => <option key={`s1-start-${opt.value}`} value={opt.value} className="bg-slate-800">{opt.label}</option>)}
              </select>
            </div>
            <span className="text-slate-600">➜</span>
            <div className="relative w-full">
              <select 
                className="w-full bg-transparent text-sm text-white border-none p-0 focus:ring-0 cursor-pointer text-center font-mono disabled:opacity-30"
                value={dayData.slot1.end}
                onChange={(e) => onChange('slot1', 'end', e.target.value)}
              >
                 {TIME_OPTIONS.map(opt => (
                   <option 
                     key={`s1-end-${opt.value}`} 
                     value={opt.value}
                     disabled={isOptionDisabled(dayData.slot1.start, opt.value)}
                     className={isOptionDisabled(dayData.slot1.start, opt.value) ? "text-slate-500 bg-slate-800" : "bg-slate-800"}
                   >
                     {opt.label}
                   </option>
                 ))}
              </select>
            </div>
          </div>

          {/* Slot 2 */}
          <div className="flex items-center gap-2 bg-slate-900/30 p-1.5 rounded-md border border-slate-800">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-1">2º</span>
            <div className="relative w-full">
              <select 
                className="w-full bg-transparent text-sm text-white border-none p-0 focus:ring-0 cursor-pointer text-center font-mono"
                value={dayData.slot2.start}
                onChange={(e) => onChange('slot2', 'start', e.target.value)}
              >
                 {TIME_OPTIONS.map(opt => <option key={`s2-start-${opt.value}`} value={opt.value} className="bg-slate-800">{opt.label}</option>)}
              </select>
            </div>
            <span className="text-slate-600">➜</span>
            <div className="relative w-full">
              <select 
                className="w-full bg-transparent text-sm text-white border-none p-0 focus:ring-0 cursor-pointer text-center font-mono disabled:opacity-30"
                value={dayData.slot2.end}
                onChange={(e) => onChange('slot2', 'end', e.target.value)}
              >
                 {TIME_OPTIONS.map(opt => (
                   <option 
                     key={`s2-end-${opt.value}`} 
                     value={opt.value}
                     disabled={isOptionDisabled(dayData.slot2.start, opt.value)}
                     className={isOptionDisabled(dayData.slot2.start, opt.value) ? "text-slate-500 bg-slate-800" : "bg-slate-800"}
                   >
                     {opt.label}
                   </option>
                 ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ScheduleForm: React.FC<ScheduleFormProps> = ({ data, opponents, onChange, onGenerate }) => {
  
  const updateAvailability = (day: keyof WeeklyAvailability, slot: 'slot1' | 'slot2', field: 'start' | 'end', value: string) => {
    const newAvailability = { ...data.availability };
    
    newAvailability[day] = {
      ...newAvailability[day],
      [slot]: {
        ...newAvailability[day][slot],
        [field]: value
      }
    };

    // Validação: Se alterou o inicio, verificar se o fim continua válido
    if (field === 'start') {
      const currentEnd = newAvailability[day][slot].end;
      if (currentEnd && value && value >= currentEnd) {
         newAvailability[day][slot].end = '';
      }
    }

    onChange({ ...data, availability: newAvailability });
  };

  const selectedOpponent = opponents.find(o => o.id === Number(data.opponentId));

  const days = [
    { key: 'monday', label: 'Segunda' },
    { key: 'tuesday', label: 'Terça' },
    { key: 'wednesday', label: 'Quarta' },
    { key: 'thursday', label: 'Quinta' },
    { key: 'friday', label: 'Sexta' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ] as const;

  return (
    <div className="grid gap-6">
      
      {/* Top Section: Basic Info & Opponent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Dados da Partida Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden shadow-xl">
          <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900">
            <h3 className="text-base font-semibold text-blue-400 flex items-center gap-2">
              <Info size={18} /> Informações Básicas
            </h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Series/Copas</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash size={16} className="text-slate-500" />
                </div>
                <select
                  value={data.championship}
                  onChange={(e) => onChange({...data, championship: e.target.value})}
                  className={`${selectBaseStyles} pl-10`}
                >
                  {CHAMPIONSHIPS.map(c => <option key={c} value={c} className="bg-slate-800 text-white">{c}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Seu Nick (Mandante)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={data.host}
                    onChange={(e) => onChange({...data, host: e.target.value})}
                    className={`${inputBaseStyles} pl-10`}
                    placeholder="Seu usuário"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Seu Clube</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Shield size={16} className="text-slate-500" />
                  </div>
                  <input
                    type="text"
                    value={data.hostClub}
                    onChange={(e) => onChange({...data, hostClub: e.target.value})}
                    className={`${inputBaseStyles} pl-10`}
                    placeholder="Seu time"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Adversário Card */}
        <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden shadow-xl flex flex-col">
          <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900">
            <h3 className="text-base font-semibold text-red-400 flex items-center gap-2">
              <Shield size={18} /> Seleção do Adversário
            </h3>
          </div>
          
          <div className="p-6 flex-grow flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Adversário Cadastrado</label>
                <select
                  value={data.opponentId}
                  onChange={(e) => onChange({...data, opponentId: e.target.value ? Number(e.target.value) : ''})}
                  className={`${selectBaseStyles}`}
                >
                  <option value="" className="bg-slate-800 text-slate-400">-- Selecione --</option>
                  {opponents.map(op => (
                    <option key={op.id} value={op.id} className="bg-slate-800 text-white">{op.name}</option>
                  ))}
                </select>
              </div>

              {selectedOpponent ? (
                <div className="bg-slate-800/80 rounded-lg p-4 border border-slate-700 space-y-3 animate-fade-in">
                   <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                      <span className="text-slate-400 text-xs">Nome</span>
                      <span className="font-medium text-white text-sm">{selectedOpponent.name}</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-slate-700/50 pb-2">
                      <span className="text-slate-400 text-xs">Clube</span>
                      <span className="font-medium text-white text-sm">{selectedOpponent.club || '-'}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-xs">Telefone</span>
                      <span className="font-medium text-blue-300 text-sm font-mono">{selectedOpponent.phone}</span>
                   </div>
                </div>
              ) : (
                <div className="flex-grow flex items-center justify-center text-slate-600 text-sm border-2 border-dashed border-slate-800 rounded-lg p-4 h-32">
                  Selecione um adversário para ver os detalhes
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Availability Section */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b border-slate-700/50 bg-gradient-to-r from-slate-800 to-slate-900">
          <h3 className="text-base font-semibold text-emerald-400 flex items-center gap-2">
            <Clock size={18} /> Disponibilidade de Horários
          </h3>
          <p className="text-xs text-slate-500 mt-1">Configure seus horários livres para facilitar o agendamento.</p>
        </div>
        
        <div className="p-6">
           {/* Desktop Headers */}
           <div className="hidden sm:grid grid-cols-[120px_1fr] gap-4 mb-2 px-2">
              <div className="text-xs font-bold text-slate-500 uppercase">Dia</div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="text-xs font-bold text-slate-500 uppercase text-center">Opção 1</div>
                 <div className="text-xs font-bold text-slate-500 uppercase text-center">Opção 2</div>
              </div>
           </div>

           <div className="space-y-1">
            {days.map((day, index) => (
              <DayRow 
                key={day.key}
                label={day.label}
                dayData={data.availability[day.key]}
                onChange={(slot, field, val) => updateAvailability(day.key, slot, field, val)}
                isLast={index === days.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bg-slate-800/50 backdrop-blur border border-slate-700/50 rounded-xl p-6 shadow-xl space-y-6">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Observações / Regras de WO</label>
          <textarea
            rows={3}
            value={data.observation}
            onChange={(e) => onChange({...data, observation: e.target.value})}
            className={`${inputBaseStyles} resize-none`}
            placeholder="Ex: Minha disponibilidade é limitada, peço que confirme até 2h antes. Caso não responda até sexta às 18h, solicitarei WO."
          />
        </div>
        
        <Button 
          variant="primary" 
          fullWidth 
          onClick={onGenerate} 
          disabled={!data.opponentId} 
          className="h-14 text-lg font-bold tracking-wide shadow-blue-500/20"
        >
           <MessageCircle className="mr-2" size={24} /> GERAR MENSAGEM DE AGENDAMENTO
        </Button>
      </div>
    </div>
  );
};