import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import doctorService from '../services/doctorService';
import specialtyService from '../services/specialtyService';
import { Doctor } from '../types';
import { useAuth } from '../contexts/AuthContext';

const DoctorsPage: React.FC = () => {
  const { user } = useAuth();
  const [filterSpecialty, setFilterSpecialty] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: doctors = [], isLoading } = useQuery({
    queryKey: ['doctors', filterSpecialty],
    queryFn: () => filterSpecialty
      ? doctorService.getBySpecialty(filterSpecialty)
      : doctorService.getAll(),
  });

  const { data: specialties = [] } = useQuery({
    queryKey: ['specialties'],
    queryFn: specialtyService.getAll,
  });

  const filteredDoctors = doctors.filter((doctor: Doctor) =>
    doctor.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nos Médecins</h1>
        {user?.role === 'admin' && (
          <button className="btn-primary">+ Ajouter un médecin</button>
        )}
      </div>

      {/* Recherche et filtres */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un médecin..."
            className="input-field"
          />
        </div>
        <select
          value={filterSpecialty || ''}
          onChange={(e) => setFilterSpecialty(e.target.value ? Number(e.target.value) : null)}
          className="input-field sm:w-64"
        >
          <option value="">Toutes les spécialités</option>
          {specialties.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Grille des médecins */}
      {filteredDoctors.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Aucun médecin trouvé</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor: Doctor) => (
            <div key={doctor.id} className="card hover:shadow-md transition-shadow">
              {/* Photo et nom */}
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  {doctor.photo ? (
                    <img
                      src={doctor.photo}
                      alt={doctor.user?.name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-xl font-bold text-primary-600">
                      {doctor.user?.name?.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Dr. {doctor.user?.name}</h3>
                  <p className="text-sm text-primary-600 font-medium">
                    {doctor.specialty?.name}
                  </p>
                </div>
              </div>

              {/* Bio */}
              {doctor.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{doctor.bio}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                {user?.role === 'patient' && (
                  <Link
                    to="/appointments/new"
                    state={{ specialtyId: doctor.specialty_id }}
                    className="flex-1 btn-primary text-center text-sm py-2"
                  >
                    Prendre RDV
                  </Link>
                )}
                {(user?.role === 'admin' || user?.role === 'secretary') && (
                  <Link
                    to={`/doctors/${doctor.id}/schedule`}
                    className="flex-1 btn-secondary text-center text-sm py-2"
                  >
                    Planning
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorsPage;
