import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Sparkles, MessageSquare } from 'lucide-react';
import Container from './Container';

/**
 * Footer component displaying product groups, newsletter placeholder,
 * and copyright information.
 */
const Footer = () => {
  const {
    t
  } = useTranslation('common');
  const currentYear = new Date().getFullYear();
  const sections = [{
    title: 'Platform',
    links: [{
      name: 'Character Creator',
      path: '#'
    }, {
      name: 'Assets & Skins',
      path: '#'
    }, {
      name: 'API Reference',
      path: '#'
    }, {
      name: 'Integrations',
      path: '#'
    }]
  }, {
    title: 'Resources',
    links: [{
      name: 'Documentation',
      path: '#'
    }, {
      name: 'Guides & Tutorials',
      path: '#'
    }, {
      name: 'Community Hub',
      path: '#'
    }, {
      name: 'Support',
      path: '#'
    }]
  }, {
    title: 'Company',
    links: [{
      name: 'About Us',
      path: '/about'
    }, {
      name: 'Blog',
      path: '#'
    }, {
      name: 'Careers',
      path: '#'
    }, {
      name: 'Terms & Privacy',
      path: '#'
    }]
  }];
  return <footer className="bg-dark-950 border-t border-dark-900 pt-16 pb-8 relative z-10">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-dark-900">
          
          {/* Logo & Description Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <div className="p-1.5 bg-primary-600 rounded-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">{t('character', 'Character')}<span className="text-primary-400">U</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">{t('empoweringCreators', 'Empowering creators and game developers with scalable, customizable, and next-generation character generators. Integrate flawlessly using our REST and GraphQL APIs.')}</p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="p-2 bg-dark-900 hover:bg-dark-800 rounded-lg text-slate-400 hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="p-2 bg-dark-900 hover:bg-dark-800 rounded-lg text-slate-400 hover:text-white transition-colors" aria-label="Discord">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 bg-dark-900 hover:bg-dark-800 rounded-lg text-slate-400 hover:text-white transition-colors" aria-label="GitHub">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Dynamic Link Groups */}
          {sections.map(section => <div key={section.title} className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-widest">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map(link => <li key={link.name}>
                    <Link to={link.path} className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                      {link.name}
                    </Link>
                  </li>)}
              </ul>
            </div>)}

        </div>

        {/* Copyright & Sub-links */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-slate-500">
          <p>© {currentYear}{t("characterUAllRightsReserved", "CharacterU. All rights reserved.")}</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <a href="#" className="hover:text-slate-300 transition-colors">{t('privacyPolicy', 'Privacy Policy')}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{t('termsOfService', 'Terms of Service')}</a>
            <a href="#" className="hover:text-slate-300 transition-colors">{t('securityPolicy', 'Security Policy')}</a>
          </div>
        </div>
      </Container>
    </footer>;
};
export default Footer;