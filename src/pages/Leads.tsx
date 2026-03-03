import { useState } from 'react';
import {
  Search,
  Plus,
  ChevronDown,
  Pencil,
  Check,
  X,
  Trash2,
} from 'lucide-react';
import { Lead, initialLeads } from '../data/sampleData';

const STATUS_STYLES: Record<Lead['status'], string> = {
  New: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Contacted: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Qualified: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Lost: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const STATUSES: Lead['status'][] = ['New', 'Contacted', 'Qualified', 'Lost'];

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<Lead['status'] | 'All'>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Lead>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState<Partial<Lead>>({
    name: '',
    email: '',
    company: '',
    status: 'New',
    value: 0,
  });

  const filtered = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const startEdit = (lead: Lead) => {
    setEditingId(lead.id);
    setEditForm({ ...lead });
  };

  const saveEdit = () => {
    if (!editingId) return;
    setLeads((prev) =>
      prev.map((l) => (l.id === editingId ? { ...l, ...editForm } : l))
    );
    setEditingId(null);
    setEditForm({});
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
  };

  const addLead = () => {
    if (!newLead.name || !newLead.email || !newLead.company) return;
    const lead: Lead = {
      id: `l${Date.now()}`,
      name: newLead.name || '',
      email: newLead.email || '',
      company: newLead.company || '',
      status: (newLead.status as Lead['status']) || 'New',
      value: newLead.value || 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads((prev) => [lead, ...prev]);
    setNewLead({ name: '', email: '', company: '', status: 'New', value: 0 });
    setShowAddForm(false);
  };

  const totalValue = filtered.reduce((sum, l) => sum + l.value, 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Leads</h1>
          <p className="text-sm text-gray-400 mt-1">
            {filtered.length} leads · ${(totalValue / 1000).toFixed(0)}K total
            value
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <div className="bg-gray-900 rounded-xl border border-gray-800 p-5">
          <h3 className="text-sm font-semibold text-gray-300 mb-4">New Lead</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Name"
              value={newLead.name || ''}
              onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="email"
              placeholder="Email"
              value={newLead.email || ''}
              onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Company"
              value={newLead.company || ''}
              onChange={(e) =>
                setNewLead({ ...newLead, company: e.target.value })
              }
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
            <input
              type="number"
              placeholder="Value"
              value={newLead.value || ''}
              onChange={(e) =>
                setNewLead({ ...newLead, value: Number(e.target.value) })
              }
              className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
            />
            <div className="flex gap-2">
              <button
                onClick={addLead}
                className="flex-1 bg-emerald-600 text-white rounded-lg px-3 py-2 text-sm font-medium hover:bg-emerald-700 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 py-2 bg-gray-800 text-gray-400 rounded-lg text-sm hover:text-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search leads..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:border-indigo-500 focus:outline-none"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as Lead['status'] | 'All')
            }
            className="appearance-none bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5 pr-10 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Company
                </th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Value
                </th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/50">
              {filtered.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-gray-800/30 transition-colors"
                >
                  {editingId === lead.id ? (
                    <>
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 w-full focus:border-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) =>
                            setEditForm({ ...editForm, email: e.target.value })
                          }
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 w-full focus:border-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <input
                          type="text"
                          value={editForm.company || ''}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              company: e.target.value,
                            })
                          }
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 w-full focus:border-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-5 py-3">
                        <select
                          value={editForm.status || 'New'}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              status: e.target.value as Lead['status'],
                            })
                          }
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 focus:border-indigo-500 focus:outline-none"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <input
                          type="number"
                          value={editForm.value || 0}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              value: Number(e.target.value),
                            })
                          }
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200 w-24 text-right focus:border-indigo-500 focus:outline-none"
                        />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={saveEdit}
                            className="p-1.5 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-colors"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-red-400 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-5 py-3">
                        <span className="text-sm font-medium text-gray-200">
                          {lead.name}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-gray-400">
                          {lead.email}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-sm text-gray-300">
                          {lead.company}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            STATUS_STYLES[lead.status]
                          }`}
                        >
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className="text-sm font-medium text-gray-200">
                          ${lead.value.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(lead)}
                            className="p-1.5 rounded-lg hover:bg-gray-800 text-gray-500 hover:text-gray-300 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteLead(lead.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 text-sm">
            No leads found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
