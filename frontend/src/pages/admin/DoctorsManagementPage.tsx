import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface Doctor {
  id: number;
  user_id: number;
  specialty_id: number;
  user?: { name: string; email: string; phone?: string };
  specialty?: { name: string };
  bio?: string;
  consultation_fee?: number;
  created_at: string;
}

interface Specialty {
  id: number;
  name: string;
}

interface DoctorForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  specialty_id: string;
  bio: string;
  consultation_fee: string;
}

const emptyForm: DoctorForm = {
  name: '',
  email: '',
  phone: '',
  password: '',
  specialty_id: '',
  bio: '',
  consultation_fee: '',
};

const DoctorsManagementPage: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [form, setForm] = useState<DoctorForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchDoctors = async () => {
    try {
      const res = await api.get('/doctors');
      setDoctors(res.data.data || res.data);
    } catch (err) {
      console.error('Erreur chargement medecins:', err);
    }
  };

  const fetchSpecialties = async () => {
    try {
      const res = await api.get('/specialties');
      setSpecialties(res.data.data || res.data);
    } catch (err) {
      console.error('Erreur chargement specialites:', err);
    }
  };

  useEffect(() => {
    Promise.all([fetchDoctors(), fetchSpecialties()]).finally(() => setLoading(false));
  }, []);

  const openAddModal = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setError(null);
    setShowModal(true);
  };

  const openEditModal = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setForm({
      name: doctor.user?.name || '',
      email: doctor.user?.email || '',
      phone: doctor.user?.phone || '',
      password: '',
      specialty_id: String(doctor.specialty_id),
      bio: doctor.bio || '',
      consultation_fee: doctor.consultation_fee ? String(doctor.consultation_fee) : '',
    });
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingDoctor(null);
    setForm(emptyForm);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        specialty_id: parseInt(form.specialty_id),
        bio: form.bio || null,
        consultation_fee: form.consultation_fee ? parseFloat(form.consultation_fee) : null,
      };

      if (!editingDoctor) {
        payload.password = form.password;
        payload.password_confirmation = form.password;
        await api.post('/doctors', payload);
        setSuccess('Medecin ajoute avec succes !');
      } else {
        if (form.password) {
          payload.password = form.password;
          payload.password_confirmation = form.password;
        }
        await api.put('/doctors/' + editingDoctor.id, payload);
        setSuccess('Medecin modifie avec succes !');
      }

      closeModal();
      fetchDoctors();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat().join(', ');
        setError(messages);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Une erreur est survenue.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete('/doctors/' + id);
      setSuccess('Medecin supprime avec succes !');
      setDeleteConfirm(null);
      fetchDoctors();
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la suppression.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Medecins</h1>
          <p className="text-gray-600 mt-1">{doctors.length} medecin(s) enregistre(s)</p>
        </div>
        <button onClick={openAddModal} className="btn-primary px-4 py-2 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un medecin
        </button>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medecin</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialite</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Telephone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarif</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                    Aucun medecin enregistre.
                  </td>
                </tr>
              ) : (
                doctors.map((doctor) => (
                  <tr key={doctor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{doctor.user?.name || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{doctor.user?.email || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {doctor.specialty?.name || 'Non definie'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{doctor.user?.phone || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {doctor.consultation_fee ? doctor.consultation_fee + ' FCFA' : '-'}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button onClick={() => openEditModal(doctor)} className="text-primary-600 hover:text-primary-900 text-sm font-medium">
                        Modifier
                      </button>
                      {deleteConfirm === doctor.id ? (
                        <span className="inline-flex items-center space-x-2">
                          <button onClick={() => handleDelete(doctor.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Confirmer</button>
                          <button onClick={() => setDeleteConfirm(null)} className="text-gray-500 hover:text-gray-700 text-sm">Annuler</button>
                        </span>
                      ) : (
                        <button onClick={() => setDeleteConfirm(doctor.id)} className="text-red-600 hover:text-red-900 text-sm font-medium">Supprimer</button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingDoctor ? 'Modifier le medecin' : 'Ajouter un medecin'}
              </h3>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Telephone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" placeholder="+221 77 123 45 67" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {editingDoctor ? 'Mot de passe (laisser vide pour ne pas changer)' : 'Mot de passe *'}
                </label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="input-field" required={!editingDoctor} minLength={8} placeholder="Minimum 8 caracteres" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialite *</label>
                <select value={form.specialty_id} onChange={(e) => setForm({ ...form, specialty_id: e.target.value })} className="input-field" required>
                  <option value="">Selectionner une specialite</option>
                  {specialties.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="input-field" rows={3} placeholder="Parcours et experience du medecin..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tarif consultation (FCFA)</label>
                <input type="number" value={form.consultation_fee} onChange={(e) => setForm({ ...form, consultation_fee: e.target.value })} className="input-field" placeholder="15000" min="0" />
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Annuler</button>
                <button type="submit" disabled={submitting} className="btn-primary px-4 py-2 disabled:opacity-50">
                  {submitting ? 'Enregistrement...' : editingDoctor ? 'Modifier' : 'Ajouter'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsManagementPage;