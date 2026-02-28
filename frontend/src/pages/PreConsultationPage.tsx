import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import preConsultationService from '../services/preConsultationService';
import { Symptom, SpecialtySuggestion } from '../types';

type Step = 'symptoms' | 'suggestion' | 'confirm';

const SYMPTOM_CATEGORIES = [
  'Douleur', 'Cardiovasculaire', 'Respiratoire', 'Neurologique',
  'Digestif', 'Pédiatrique', 'Peau', 'Vision', 'ORL',
  'Gynécologique', 'Traumatisme', 'Fièvre', 'Général',
];

const PreConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('symptoms');
  const [selectedSymptoms, setSelectedSymptoms] = useState<number[]>([]);
  const [additionalNotes, setAdditionalNotes] = useState('');
  const [suggestions, setSuggestions] = useState<SpecialtySuggestion[]>([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tous');

  // Charger les symptômes
  const { data: symptoms = [], isLoading } = useQuery({
    queryKey: ['symptoms'],
    queryFn: async () => {
      const response = await api.get<{ data: Symptom[] }>('/symptoms');
      return response.data.data;
    },
  });

  // Mutation pour obtenir les suggestions
  const suggestMutation = useMutation({
    mutationFn: () => preConsultationService.getSuggestions(selectedSymptoms),
    onSuccess: (data) => {
      setSuggestions(data);
      if (data.length > 0) {
        setSelectedSpecialty(data[0].specialty.id);
      }
      setStep('suggestion');
    },
  });

  // Mutation pour soumettre la préconsultation
  const submitMutation = useMutation({
    mutationFn: () => preConsultationService.submit({
      symptoms_selected: selectedSymptoms,
      additional_notes: additionalNotes || undefined,
    }),
    onSuccess: (preConsultation) => {
      navigate('/appointments/new', {
        state: {
          preConsultationId: preConsultation.id,
          specialtyId: selectedSpecialty,
        },
      });
    },
  });

  const toggleSymptom = (id: number) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const filteredSymptoms = activeCategory === 'Tous'
    ? symptoms
    : symptoms.filter(s => s.category === activeCategory);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Préconsultation Médicale</h1>
        <p className="text-gray-600 mt-1">
          Décrivez vos symptômes pour que notre système vous suggère le spécialiste adapté
        </p>
      </div>

      {/* Indicateur d'étapes */}
      <div className="flex items-center mb-8">
        {[
          { key: 'symptoms', label: '1. Symptômes' },
          { key: 'suggestion', label: '2. Suggestion' },
          { key: 'confirm', label: '3. Confirmation' },
        ].map((s, i) => (
          <React.Fragment key={s.key}>
            <div className={`flex items-center ${step === s.key ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s.key ? 'bg-primary-600 text-white' :
                (i < ['symptoms', 'suggestion', 'confirm'].indexOf(step)) ? 'bg-green-500 text-white' :
                'bg-gray-200 text-gray-500'
              }`}>
                {i + 1}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:block">{s.label.split('. ')[1]}</span>
            </div>
            {i < 2 && <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Étape 1 : Sélection des symptômes */}
      {step === 'symptoms' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quels symptômes ressentez-vous ?
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Sélectionnez tous les symptômes qui correspondent à votre état actuel
          </p>

          {/* Filtre par catégorie */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory('Tous')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                activeCategory === 'Tous'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Tous
            </button>
            {SYMPTOM_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grille de symptômes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {filteredSymptoms.map(symptom => (
              <button
                key={symptom.id}
                onClick={() => toggleSymptom(symptom.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${
                  selectedSymptoms.includes(symptom.id)
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                    selectedSymptoms.includes(symptom.id)
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-gray-300'
                  }`}>
                    {selectedSymptoms.includes(symptom.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{symptom.name}</p>
                    <p className="text-xs text-gray-400">{symptom.category}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Notes supplémentaires */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes supplémentaires (optionnel)
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
              className="input-field"
              placeholder="Décrivez vos symptômes en détail, leur durée, leur intensité..."
            />
          </div>

          {/* Compteur et bouton */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {selectedSymptoms.length} symptôme(s) sélectionné(s)
            </p>
            <button
              onClick={() => suggestMutation.mutate()}
              disabled={selectedSymptoms.length === 0 || suggestMutation.isPending}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {suggestMutation.isPending ? 'Analyse en cours...' : 'Obtenir une suggestion →'}
            </button>
          </div>

          {/* Option de prise de RDV directe */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-500">
              Vous connaissez déjà votre spécialiste ?{' '}
              <button
                onClick={() => navigate('/appointments/new')}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Prendre un RDV directement
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Étape 2 : Suggestions de spécialités */}
      {step === 'suggestion' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Résultats de l'analyse
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Basé sur vos {selectedSymptoms.length} symptôme(s), voici les spécialistes recommandés
          </p>

          {suggestions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune suggestion disponible pour ces symptômes.</p>
              <button onClick={() => setStep('symptoms')} className="btn-secondary mt-4">
                ← Modifier les symptômes
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.specialty.id}
                    onClick={() => setSelectedSpecialty(suggestion.specialty.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedSpecialty === suggestion.specialty.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        {index === 0 && (
                          <span className="bg-green-100 text-green-700 text-xs font-medium px-2 py-0.5 rounded mr-2">
                            Recommandé
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900">
                          {suggestion.specialty.name}
                        </h3>
                      </div>
                      <span className="text-lg font-bold text-gray-700">
                        {suggestion.percentage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getScoreColor(suggestion.percentage)}`}
                        style={{ width: `${suggestion.percentage}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {suggestion.specialty.description}
                    </p>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep('symptoms')}
                  className="btn-secondary"
                >
                  ← Modifier les symptômes
                </button>
                <button
                  onClick={() => setStep('confirm')}
                  disabled={!selectedSpecialty}
                  className="btn-primary disabled:opacity-50"
                >
                  Confirmer et prendre RDV →
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Étape 3 : Confirmation */}
      {step === 'confirm' && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Confirmation de la préconsultation
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">Récapitulatif</h3>
            <p className="text-sm text-gray-600">
              <strong>Symptômes :</strong> {selectedSymptoms.length} symptôme(s) sélectionné(s)
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Spécialiste suggéré :</strong>{' '}
              {suggestions.find(s => s.specialty.id === selectedSpecialty)?.specialty.name}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              <strong>Score de correspondance :</strong>{' '}
              {suggestions.find(s => s.specialty.id === selectedSpecialty)?.percentage}%
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              ℹ️ Cette préconsultation sera enregistrée et transmise au médecin lors de votre rendez-vous.
              Elle lui permettra de mieux préparer votre consultation.
            </p>
          </div>

          {submitMutation.isError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              Une erreur est survenue. Veuillez réessayer.
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setStep('suggestion')}
              className="btn-secondary"
            >
              ← Retour
            </button>
            <button
              onClick={() => submitMutation.mutate()}
              disabled={submitMutation.isPending}
              className="btn-primary disabled:opacity-50"
            >
              {submitMutation.isPending ? 'Enregistrement...' : 'Enregistrer et prendre RDV →'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreConsultationPage;
