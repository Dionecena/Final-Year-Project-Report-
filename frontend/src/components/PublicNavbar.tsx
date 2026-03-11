import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu quand on clique sur un lien ancre
  const handleLinkClick = () => setIsMenuOpen(false);

  // Bloquer le scroll du body quand le menu est ouvert
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-400 ${
        scrolled || isMenuOpen
          ? 'py-3 bg-gray-50/90 backdrop-blur-xl border-b border-gray-200'
          : 'py-5 bg-transparent'
      }`}
    >
      {/* Logo */}
      <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-900 z-50">
        Medi<span className="font-normal text-primary-600">Consult</span>
      </Link>

      {/* Nav links desktop */}
      <div className="hidden md:flex items-center gap-9">
        <a
          href="#services"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Services
        </a>
        <a
          href="#equipe"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Equipe
        </a>
        <a
          href="#processus"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Comment ca marche
        </a>
        <a
          href="#temoignages"
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
        >
          Temoignages
        </a>
        <Link
          to="/login"
          className="px-7 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary-600/30"
        >
          Se connecter
        </Link>
      </div>

      {/* Mobile menu button - burger / X toggle */}
      <button
        className="md:hidden p-2 text-gray-600 hover:text-gray-900 z-50 relative"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={isMenuOpen}
      >
        {isMenuOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile menu dropdown */}
      <div
        className={`absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-xl z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="flex flex-col px-6 py-6 space-y-1">
          <a
            href="#services"
            onClick={handleLinkClick}
            className="py-3 px-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Services
          </a>
          <a
            href="#equipe"
            onClick={handleLinkClick}
            className="py-3 px-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Equipe
          </a>
          <a
            href="#processus"
            onClick={handleLinkClick}
            className="py-3 px-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Comment ca marche
          </a>
          <a
            href="#temoignages"
            onClick={handleLinkClick}
            className="py-3 px-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Temoignages
          </a>

          <div className="border-t border-gray-200 my-3"></div>

          <Link
            to="/login"
            onClick={handleLinkClick}
            className="py-3 px-4 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            Se connecter
          </Link>
          <Link
            to="/register"
            onClick={handleLinkClick}
            className="mt-2 py-3 px-4 bg-primary-600 hover:bg-primary-700 text-white text-base font-semibold rounded-lg text-center transition-all"
          >
            Creer un compte
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default PublicNavbar;
