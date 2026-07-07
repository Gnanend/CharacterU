import { useTranslation } from 'react-i18next';

import { Link } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import Container from '../components/Container';

/**
 * Custom 404 NotFound page.
 */
const NotFound = () => {
  const { t } = useTranslation('common');

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-16">
      <Container>
        <div className="text-center max-w-md mx-auto space-y-6">
          
          {/* 404 Decorative Icon */}
          <div className="relative inline-flex items-center justify-center">
            <div className="absolute inset-0 bg-primary-600/20 rounded-full blur-xl animate-pulse"></div>
            <div className="relative p-6 bg-dark-900 border border-dark-800 rounded-3xl text-primary-400">
              <HelpCircle className="w-16 h-16" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-6xl font-black text-white tracking-tight">404</h1>
          
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-slate-200">{t('pageNotFound', 'Page Not Found')}</h2>
            <p className="text-sm text-slate-400 leading-relaxed">{t('weCouldnTFindThe', "We couldn't find the page you are looking for. It might have been moved, deleted, or never existed.")}</p>
          </div>

          {/* Action Button */}
          <div className="pt-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/25"
            >
              <ArrowLeft className="w-4 h-4" />{t('backToSafety', 'Back to Safety')}</Link>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default NotFound;
