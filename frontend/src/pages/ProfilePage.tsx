import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';

const profileSchema = z.object({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caracteres'),
  email: z.string().email('Adresse email invalide'),
  phone: z.string().max(20).optional().or(z.literal('')),
  current_password: z.string().optional().or(z.literal('')),
  new_password: z.string().optional().or(z.literal('')),
  new_password_confirmation: z.string().optional().or(z.literal('')),
}).refine((data) => {
  if (data.new_password && data.new_password.length > 0) {
    return data.new_password.length >= 8;
  }
  return true;
}, {
  message: 'Le nouveau mot de passe doit contenir au moins 8 caracteres',
  path: ['new_password'],
}).refine((data) => {
  if (data.new_password && data.new_password.length > 0) {
    return data.new_password === data.new_password_confirmation;
  }
  return true;
}, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['new_password_confirmation'],
}).refine((data) => {
  if (data.new_password && data.new_password.length > 0) {
    return data.current_password && data.current_password.length > 0;
  }
  return true;
}, {
  message: 'Le mot de passe actuel est requis pour changer de mot de passe',
  path: ['current_password'],
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const payload: any = {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
      };

      if (data.new_password && data.new_password.length > 0) {
        payload.current_password = data.current_password;
        payload.new_password = data.new_password;
        payload.new_password_confirmation = data.new_password_confirmation;
      }

      await authService.updateProfile(payload);
      setSuccess('Profil mis a jour avec succes !');

      // Reset password fields
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: '',
      });
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors).flat().join(', ');
        setError(messages);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Une erreur est survenue. Veuillez reessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabels: Record<string, string> = {
    patient: 'Patient',
    doctor: 'Medecin',
    secretary: 'Secretaire',
    admin: 'Administrateur',
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-gray-600 mt-1">Gerez vos informations personnelles et votre mot de passe.</p>
      </div>

      <div className="card">
        {/* Role badge */}
        <div className="mb-6 flex items-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
            {roleLabels[user?.role || ''] || user?.role}
          </span>
          <span className="ml-3 text-sm text-gray-500">
            Membre depuis {user?.created_at ? new Date(user.created_at).toLocaleDateString('fr-FR') : 'N/A'}
          </span>
        </div>

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informations personnelles */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet
                </label>
                <input
                  id="name"
                  type="text"
                  {...register('name')}
                  className="input-field"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="input-field"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Telephone
                </label>
                <input
                  id="phone"
                  type="tel"
                  {...register('phone')}
                  className="input-field"
                  placeholder="+221 77 123 45 67"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Separator */}
          <hr className="border-gray-200" />

          {/* Changement de mot de passe */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Changer le mot de passe</h3>
            <p className="text-sm text-gray-500 mb-4">Laissez vide si vous ne souhaitez pas changer de mot de passe.</p>
            <div className="space-y-4">
              <div>
                <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de passe actuel
                </label>
                <input
                  id="current_password"
                  type="password"
                  {...register('current_password')}
                  className="input-field"
                  placeholder="Votre mot de passe actuel"
                />
                {errors.current_password && (
                  <p className="text-red-500 text-sm mt-1">{errors.current_password.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="new_password"
                    type="password"
                    {...register('new_password')}
                    className="input-field"
                    placeholder="Minimum 8 caracteres"
                  />
                  {errors.new_password && (
                    <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="new_password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le nouveau mot de passe
                  </label>
                  <input
                    id="new_password_confirmation"
                    type="password"
                    {...register('new_password_confirmation')}
                    className="input-field"
                    placeholder="Retapez le mot de passe"
                  />
                  {errors.new_password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errors.new_password_confirmation.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
