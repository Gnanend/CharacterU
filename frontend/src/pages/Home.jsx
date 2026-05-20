import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Cpu, Layers, Zap, ArrowRight, UserPlus, Play } from 'lucide-react';
import Container from '../components/Container';

/**
 * Home page showcasing a premium, modern SaaS landing page.
 * Uses micro-interactions, dark mode gradients, and rich visuals.
 */
const Home = () => {
  const stats = [
    { value: '1.2M+', label: 'Characters Generated' },
    { value: '99.9%', label: 'API Uptime' },
    { value: '10ms', label: 'Average Response' },
    { value: '15k+', label: 'Active Developers' },
  ];

  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-primary-400" />,
      title: 'Advanced AI Generators',
      description: 'Generate high-fidelity, standardized 3D/2D characters utilizing advanced procedural generation algorithms.',
    },
    {
      icon: <Layers className="w-6 h-6 text-primary-400" />,
      title: 'Extensible Asset Pipeline',
      description: 'Overlay custom clothes, skins, armor, and hairstyles using our streamlined visual customization assets.',
    },
    {
      icon: <Zap className="w-6 h-6 text-primary-400" />,
      title: 'Lightning-Fast Integration',
      description: 'Integrate the character creator right into your game engine or application with our REST or GraphQL API endpoints.',
    },
  ];

  return (
    <div className="relative overflow-hidden pb-20">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-20 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-80 right-1/4 translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 md:pt-20 md:pb-32">
        <Container>
          <div className="text-center max-w-4xl mx-auto space-y-8">
            
            {/* Promo Pill */}
            <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-1.5 text-xs font-semibold text-primary-300 tracking-wide hover:bg-primary-500/20 transition-all duration-300 select-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Introducing CharacterU v2.0</span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1] font-sans">
              The Next-Gen <br />
              <span className="bg-gradient-to-r from-primary-400 via-primary-500 to-indigo-400 bg-clip-text text-transparent">
                Character Engine
              </span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Create, configure, and deploy responsive character creators directly in your SaaS or gaming platform. Leverage production-ready APIs and customizable design models.
            </p>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/get-started"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold text-white bg-gradient-to-r from-primary-600 to-primary-500 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-300 group"
              >
                Start Creator <UserPlus className="w-5 h-5" />
              </Link>
              
              <a
                href="#demo"
                className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold text-slate-300 bg-dark-900 border border-dark-800 hover:bg-dark-800 hover:text-white transition-all duration-300"
              >
                Watch Demo <Play className="w-4 h-4 text-slate-400" />
              </a>
            </div>

          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-dark-900/60 bg-dark-950/40 relative z-10">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center space-y-1">
                <p className="text-3xl md:text-4xl font-extrabold text-white tracking-tight bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-xs md:text-sm text-slate-500 font-medium uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 relative z-10">
        <Container>
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-20">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Built for Scale and Customization
            </h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed">
              We provide the core tools, state machinery, and assets required to implement customizable characters in under 10 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-dark-900/40 border border-dark-800 hover:border-primary-500/50 hover:bg-dark-900/60 p-8 rounded-3xl transition-all duration-300 shadow-md hover:shadow-lg shadow-black/10 hover:shadow-primary-500/5"
              >
                {/* Icon wrapper */}
                <div className="p-3 bg-dark-800 border border-dark-700/80 rounded-2xl w-fit mb-6 group-hover:bg-primary-500/10 group-hover:border-primary-500/35 transition-all duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-primary-300 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                <p className="text-sm text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mini CTA Callout */}
      <section className="pt-12">
        <Container>
          <div className="relative rounded-3xl bg-gradient-to-r from-primary-900/40 to-indigo-950/40 border border-primary-800/30 p-8 md:p-12 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary-500/10 rounded-full blur-[80px] pointer-events-none"></div>
            <div className="relative z-10 max-w-xl space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Ready to power up your game creation workflow?
              </h2>
              <p className="text-sm md:text-base text-slate-300 leading-relaxed">
                Connect with us or read our getting started guides to learn how you can utilize CharacterU SDKs.
              </p>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 font-semibold text-primary-400 hover:text-primary-300 hover:translate-x-1 duration-200"
              >
                Learn more about our mission <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default Home;
