import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';

const resetSchema = z.object({
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caracteres'),
  password_confirmation: z.string().min(8, 'Confirmez le mot de passe'),
}).refine((data) => data.password === data.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
});

type ResetFormData = z.infer<typeof resetSchema>;

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    if (!token || !email) {
      setError('Lien de reinitialisation invalide. Veuillez refaire une demande.');
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await authService.resetPassword({
        email,
        token,
        password: data.password,
        password_confirmation: data.password_confirmation,
      });
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Une erreur est survenue. Veuillez reessayer.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4">
        <div className="max-w-md w-full">
          <div className="card text-center">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              <p className="font-medium">Lien invalide</p>
              <p className="text-sm mt-1">Ce lien de reinitialisation est invalide ou a expire.</p>
            </div>
            <Link to="/forgot-password" className="btn-primary py-2 px-4 inline-block">
              Refaire une demande
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-blue-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">MediConsult</h1>
          <p className="text-gray-600 mt-2">Nouveau mot de passe</p>
        </div>

        <div className="card">
          {success ? (
            <div>
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                <p className="font-medium">Mot de passe reinitialise !</p>
                <p className="text-sm mt-1">
                  Votre mot de passe a ete modifie avec succes. Vous pouvez maintenant vous connecter.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full btn-primary py-3 block text-center"
              >
                Se connecter
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Reinitialiser le mot de passe</h2>
              <p className="text-sm text-gray-600 mb-6">
                Choisissez un nouveau mot de passe pour votre compte <strong>{email}</strong>.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Nouveau mot de passe
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...register('password')}
                    className="input-field"
                    placeholder="Minimum 8 caracteres"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmer le mot de passe
                  </label>
                  <input
                    id="password_confirmation"
                    type="password"
                    {...register('password_confirmation')}
                    className="input-field"
                    placeholder="Retapez le mot de passe"
                  />
                  {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Reinitialisation...' : 'Reinitialiser le mot de passe'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link to="/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                  Retour a la connexion
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
