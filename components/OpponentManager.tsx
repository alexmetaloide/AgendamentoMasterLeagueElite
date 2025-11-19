import React, { useState } from 'react';
import { Opponent } from '../types';
import { Button } from './Button';
import { Trash2, Edit2, Plus, Save, X, Search, Users } from 'lucide-react';

interface OpponentManagerProps {
  opponents: Opponent[];
  setOpponents: React.Dispatch<React.SetStateAction<Opponent[]>>;
  onBack: () => void;
}

export const OpponentManager: React.FC<OpponentManagerProps> = ({ opponents, setOpponents, onBack }) => {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<Opponent>>({});

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>, id: number) => {
    // Impede qualquer comportamento padrão ou propagação para linhas da tabela
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Tem certeza que deseja excluir este adversário?')) {
      setOpponents(prev => {
        // Garante que a comparação seja feita numericamente para evitar erros de tipo (string vs number)
        return prev.filter(op => Number(op.id) !== Number(id));
      });
    }
  };

  const handleEditStart = (opponent: Opponent) => {
    setEditingId(opponent.id);
    setEditForm(opponent);
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = () => {
    if (!editForm.name || !editForm.phone) return;

    if (editingId === 0) {
      // New Item
      const newId = opponents.length > 0 ? Math.max(...opponents.map(o => Number(o.id))) + 1 : 1;
      setOpponents([...opponents, { ...editForm, id: newId } as Opponent]);
    } else {
      // Update Item
      setOpponents(opponents.map(op => (op.id === editingId ? { ...op, ...editForm } as Opponent : op)));
    }
    setEditingId(null);
    setEditForm({});
  };

  const handleAddNew = () => {
    setEditingId(0);
    setEditForm({ name: '', phone: '', club: '', observation: '' });
  };

  const inputClass = "w-full border-slate-600 bg-slate-900/80 text-white placeholder-slate-500 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm p-2 border";

  return (
    <div className="bg-slate-800/60 backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-slate-700/50">
      <div className="px-6 py-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-2">
           <Users className="text-blue-500" size={20} />
           <h3 className="text-lg font-semibold text-slate-100">Gerenciar Adversários</h3>
        </div>
        <Button variant="outline" onClick={onBack} size="sm">Voltar</Button>
      </div>

      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <p className="text-sm text-slate-400">
             Cadastre os telefones dos seus adversários para agilizar o contato.
          </p>
          <Button onClick={handleAddNew} variant="primary" className="flex items-center gap-2">
            <Plus size={16} /> <span className="hidden sm:inline">Novo Adversário</span><span className="sm:hidden">Novo</span>
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-700/50 shadow-inner bg-slate-900/30">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-700/50">
              <thead className="bg-slate-900/80">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Telefone</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Clube</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50 text-sm">
                {editingId === 0 && (
                   <tr className="bg-blue-900/20 animate-fade-in">
                   <td className="px-6 py-4">
                     <input 
                       type="text" 
                       placeholder="Nome do jogador"
                       className={inputClass}
                       autoFocus
                       value={editForm.name || ''}
                       onChange={e => setEditForm({...editForm, name: e.target.value})}
                     />
                   </td>
                   <td className="px-6 py-4">
                     <input 
                       type="text" 
                       placeholder="558599999999"
                       className={inputClass}
                       value={editForm.phone || ''}
                       onChange={e => setEditForm({...editForm, phone: e.target.value})}
                     />
                   </td>
                   <td className="px-6 py-4">
                     <input 
                       type="text" 
                       placeholder="Time"
                       className={inputClass}
                       value={editForm.club || ''}
                       onChange={e => setEditForm({...editForm, club: e.target.value})}
                     />
                   </td>
                   <td className="px-6 py-4 whitespace-nowrap text-right">
                     <div className="flex justify-end gap-2">
                       <button type="button" onClick={handleSave} className="p-2 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors cursor-pointer" title="Salvar"><Save size={18}/></button>
                       <button type="button" onClick={handleEditCancel} className="p-2 rounded bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white transition-colors cursor-pointer" title="Cancelar"><X size={18}/></button>
                     </div>
                   </td>
                 </tr>
                )}
                {opponents.map((opponent) => (
                  <tr key={opponent.id} className={`transition-colors ${editingId === opponent.id ? "bg-blue-900/20" : "hover:bg-slate-800/50"}`}>
                    {editingId === opponent.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input 
                            type="text" 
                            className={inputClass}
                            value={editForm.name || ''}
                            onChange={e => setEditForm({...editForm, name: e.target.value})}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="text" 
                            className={inputClass}
                            value={editForm.phone || ''}
                            onChange={e => setEditForm({...editForm, phone: e.target.value})}
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input 
                            type="text" 
                            className={inputClass}
                            value={editForm.club || ''}
                            onChange={e => setEditForm({...editForm, club: e.target.value})}
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button type="button" onClick={handleSave} className="p-2 rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors cursor-pointer"><Save size={18}/></button>
                            <button type="button" onClick={handleEditCancel} className="p-2 rounded bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white transition-colors cursor-pointer"><X size={18}/></button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 font-medium text-slate-200">{opponent.name}</td>
                        <td className="px-6 py-4 text-slate-400 font-mono">{opponent.phone}</td>
                        <td className="px-6 py-4 text-slate-400">{opponent.club}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2 items-center">
                            <button 
                              type="button" 
                              onClick={() => handleEditStart(opponent)} 
                              className="p-2 rounded hover:bg-blue-500/10 text-blue-400 transition-colors cursor-pointer"
                              title="Editar"
                            >
                              <Edit2 size={16}/>
                            </button>
                            <button 
                              type="button" 
                              onClick={(e) => handleDelete(e, opponent.id)} 
                              className="p-2 rounded hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer relative z-10"
                              title="Excluir"
                            >
                              <Trash2 size={16}/>
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
                {opponents.length === 0 && editingId !== 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                      Nenhum adversário cadastrado. Clique em "Novo Adversário" para começar.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};