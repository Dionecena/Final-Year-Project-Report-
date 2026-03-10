import React, { useState, useEffect } from 'react';
import api from '../../services/api';

interface PreConsultation {
  id: number;
  patient_id: number;
  suggested_specialty_id: number | null;
  symptoms_selected: number[];
  confidence_score: number | null;
  additional_notes: string | null;
  ai_recommendation: string | null;
  created_at: string;
  updated_at: string;
  patient?: { id: number; name: string; email: string; phone?: string };
  suggested_specialty?: { id: number; name: string };
  symptoms?: { id: number; name: string; category: string }[];
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const PatientFilesPage: React.FC = () => {
  const [files, setFiles] = useState<PreConsultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<PreConsultation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async (pageNum: number = 1) => {
    setLoading(true);
    try {
      const res = await api.get('/doctor/pre-consultations', {
        params: { page: pageNum, per_page: 15 },
      });
      const data = res.data.data;
      setFiles(data.data || data);
      if (data.current_page) {
        setMeta({
          current_page: data.current_page,
          last_page: data.last_page,
          per_page: data.per_page,
          total: data.total,
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du chargement des fiches.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(page);
  }, [page]);

  const getConfidenceBadge = (score: number | null) => {
    if (score === null) return <span className="text-xs text-gray-400">N/A</span>;
    const pct = Math.round(score * 100);
    let color = 'bg-gray-100 text-gray-800';
    if (pct >= 80) color = 'bg-green-100 text-green-800';
    else if (pct >= 60) color = 'bg-yellow-100 text-yellow-800';
    else if (pct >= 40) color = 'bg-orange-100 text-orange-800';
    else color = 'bg-red-100 text-red-800';

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
        {pct}%
      </span>
    );
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading && files.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <p className="font-medium">Erreur</p>
        <p className="text-sm mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Fiches de Pre-consultation</h1>
        <p className="text-gray-600 mt-1">
          {meta ? `${meta.total} fiche(s) de vos patients` : `${files.length} fiche(s)`}
        </p>
      </div>

      {files.length === 0 ? (
        <div className="card p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Aucune fiche</h3>
          <p className="mt-2 text-gray-500">Les fiches de pre-consultation de vos patients apparaitront ici.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Specialite suggeree</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Symptomes</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Confiance IA</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{file.patient?.name || 'Patient'}</div>
                        <div className="text-sm text-gray-500">{file.patient?.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {file.suggested_specialty?.name || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {(file.symptoms || []).slice(0, 3).map((s) => (
                          <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                            {s.name}
                          </span>
                        ))}
                        {(file.symptoms || []).length > 3 && (
                          <span className="text-xs text-gray-500">+{file.symptoms!.length - 3}</span>
                        )}
                        {(!file.symptoms || file.symptoms.length === 0) && (
                          <span className="text-xs text-gray-400">{file.symptoms_selected.length} symptome(s)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">{getConfidenceBadge(file.confidence_score)}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{formatDate(file.created_at)}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedFile(file)}
                        className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                      >
                        Voir details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page {meta.current_page} sur {meta.last_page} ({meta.total} fiches)
              </p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
                >
                  Precedent
                </button>
                <button
                  onClick={() => setPage(Math.min(meta.last_page, page + 1))}
                  disabled={page >= meta.last_page}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-100"
                >
                  Suivant
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Detail de la fiche</h3>
              <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Patient</p>
                  <p className="text-sm text-gray-900">{selectedFile.patient?.name}</p>
                  <p className="text-xs text-gray-500">{selectedFile.patient?.email}</p>
                  {selectedFile.patient?.phone && (
                    <p className="text-xs text-gray-500">{selectedFile.patient.phone}</p>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Specialite suggeree</p>
                  <p className="text-sm text-gray-900">{selectedFile.suggested_specialty?.name || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Score de confiance IA</p>
                  {getConfidenceBadge(selectedFile.confidence_score)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Date de creation</p>
                  <p className="text-sm text-gray-900">{formatDate(selectedFile.created_at)}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500 mb-2">Symptomes selectionnes</p>
                <div className="flex flex-wrap gap-2">
                  {(selectedFile.symptoms || []).length > 0 ? (
                    selectedFile.symptoms!.map((s) => (
                      <span key={s.id} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700">
                        {s.name}
                        {s.category && <span className="ml-1 text-blue-400 text-xs">({s.category})</span>}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">
                      {selectedFile.symptoms_selected.length} symptome(s) (IDs: {selectedFile.symptoms_selected.join(', ')})
                    </span>
                  )}
                </div>
              </div>

              {selectedFile.additional_notes && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Notes du patient</p>
                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700">{selectedFile.additional_notes}</div>
                </div>
              )}

              {selectedFile.ai_recommendation && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Recommandation IA</p>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm text-purple-700">
                    {selectedFile.ai_recommendation}
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-3 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setSelectedFile(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientFilesPage;
