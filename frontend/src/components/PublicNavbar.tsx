import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PublicNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 transition-all duration-400 ${
        scrolled
          ? 'py-3 bg-gray-50/90 backdrop-blur-xl border-b border-gray-200'
          : 'py-5 bg-transparent'
      }`}
    >
      {/* Logo */}
      <Link to="/" className="text-2xl font-extrabold tracking-tight text-gray-900">
        Medi<span className="font-normal text-primary-600">Consult</span>
      </Link>

      {/* Nav links (hidden on mobile) */}
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

      {/* Mobile menu button */}
      <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </nav>
  );
};

export default PublicNavbar;
