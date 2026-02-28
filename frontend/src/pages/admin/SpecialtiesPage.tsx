import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import specialtyService from '../../services/specialtyService';
import { Specialty } from '../../types';

const SpecialtiesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', icon: '' });
  const [error, setError] = useState<string | null>(null);

  const { data: specialties = [], isLoading } = useQuery({
    queryKey: ['specialties'],
    queryFn: specialtyService.getAll,
  });

  const createMutation = useMutation({
    mutationFn: specialtyService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      setShowForm(false);
      setFormData({ name: '', description: '', icon: '' });
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Erreur'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Specialty> }) =>
      specialtyService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['specialties'] });
      setEditingSpecialty(null);
      setFormData({ name: '', description: '', icon: '' });
    },
    onError: (err: any) => setError(err.response?.data?.message || 'Erreur'),
  });

  const deleteMutation = useMutation({
    mutationFn: specialtyService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['specialties'] }),
    onError: (err: any) => setError(err.response?.data?.message || 'Impossible de supprimer'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (editingSpecialty) {
      updateMutation.mutate({ id: editingSpecialty.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const startEdit = (specialty: Specialty) => {
    setEditingSpecialty(specialty);
    setFormData({ name: specialty.name, description: specialty.description || '', icon: specialty.icon || '' });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des Spécialités</h1>
        <button
          onClick={() => { setShowForm(!showForm); setEditingSpecialty(null); setFormData({ name: '', description: '', icon: '' }); }}
          className="btn-primary"
        >
          {showForm ? 'Annuler' : '+ Nouvelle spécialité'}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {editingSpecialty ? 'Modifier la spécialité' : 'Nouvelle spécialité'}
          </h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icône (emoji)</label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                  className="input-field"
                  placeholder="🏥"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={2}
                className="input-field"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
                className="btn-primary disabled:opacity-50"
              >
                {editingSpecialty ? 'Modifier' : 'Créer'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste des spécialités */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {specialties.map((specialty: Specialty) => (
            <div key={specialty.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  {specialty.icon && <span className="text-2xl mr-3">{specialty.icon}</span>}
                  <div>
                    <h3 className="font-semibold text-gray-900">{specialty.name}</h3>
                    {specialty.description && (
                      <p className="text-sm text-gray-500 mt-0.5 line-clamp-2">{specialty.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => startEdit(specialty)}
                  className="flex-1 btn-secondary text-sm py-1.5"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (window.confirm(`Supprimer la spécialité "${specialty.name}" ?`)) {
                      deleteMutation.mutate(specialty.id);
                    }
                  }}
                  className="btn-danger text-sm py-1.5 px-3"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpecialtiesPage;
