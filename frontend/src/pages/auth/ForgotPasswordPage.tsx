import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const forgotSchema = z.object({
  email: z.string().email('Adresse email invalide'),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

const ForgotPasswordPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setError(null);
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(data.email);
      setSuccess(true);
    } catch (err: any) {
      setError('Une erreur est survenue. Veuillez reessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <p className="text-gray-600 mt-2">Reinitialisation du mot de passe</p>
        </div>

        <div className="card">
          {success ? (
            <div>
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                <p className="font-medium">Email envoye !</p>
                <p className="text-sm mt-1">
                  Si cette adresse est associee a un compte, vous recevrez un email avec un lien de reinitialisation.
                </p>
              </div>
              <Link
                to="/login"
                className="w-full btn-primary py-3 block text-center"
              >
                Retour a la connexion
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Mot de passe oublie ?</h2>
              <p className="text-sm text-gray-600 mb-6">
                Entrez votre adresse email et nous vous enverrons un lien pour reinitialiser votre mot de passe.
              </p>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse email
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className="input-field"
                    placeholder="votre@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Envoyer le lien de reinitialisation'}
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

export default ForgotPasswordPage;
