import React from 'react';
import { Target, Users, ShieldAlert, Award } from 'lucide-react';
import Container from '../components/Container';

/**
 * About page detailing CharacterU's vision, mission, and core engineering philosophy.
 */
const About = () => {
  const values = [
    {
      icon: <Target className="w-5 h-5 text-primary-400" />,
      title: 'Our Mission',
      description: 'To democratize high-fidelity character customization by making it accessible via lightweight API integrations.',
    },
    {
      icon: <Users className="w-5 h-5 text-primary-400" />,
      title: 'Built for Developers',
      description: 'Created by developers, for developers. We build robust documentation and provide extensive custom styling capabilities.',
    },
    {
      icon: <ShieldAlert className="w-5 h-5 text-primary-400" />,
      title: 'Privacy & Security',
      description: 'Your assets and player data are secured through end-to-end token validation and isolated environments.',
    },
    {
      icon: <Award className="w-5 h-5 text-primary-400" />,
      title: 'Quality First',
      description: 'Procedurally optimize meshes, materials, and textures for lightning-fast loads on both web and native targets.',
    },
  ];

  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-primary-600/5 rounded-full blur-[100px] pointer-events-none"></div>

      <Container>
        <div className="max-w-4xl mx-auto space-y-16">
          
          {/* Header Title */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
              About <span className="text-primary-500">CharacterU</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              We are a team of gaming enthusiasts, software architects, and designers pioneering procedural character configurations for websites, game platforms, and virtual worlds.
            </p>
          </div>

          {/* Story Card */}
          <div className="bg-dark-900/30 border border-dark-800 p-8 md:p-12 rounded-3xl space-y-6 relative">
            <h2 className="text-2xl font-bold text-white tracking-tight">Our Story</h2>
            <div className="text-slate-400 space-y-4 text-sm md:text-base leading-relaxed">
              <p>
                CharacterU was founded on the belief that customized user profiles and gaming avatars should not be locked inside proprietary closed engines. The gaming landscape is moving towards decentralized experiences, interoperable applications, and customizable web environments.
              </p>
              <p>
                To enable this future, we created a system that handles state machinery, high-quality asset layers, custom shaders, and instant web APIs, all packaged inside a developer-centric SaaS architecture.
              </p>
            </div>
          </div>

          {/* Core Philosophy Grid */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-white tracking-tight">Our Core Philosophy</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((val, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-6 bg-dark-900/40 border border-dark-800 rounded-2xl"
                >
                  <div className="p-2.5 bg-dark-800 border border-dark-700/80 rounded-xl h-fit">
                    {val.icon}
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-bold text-slate-200">{val.title}</h3>
                    <p className="text-xs md:text-sm text-slate-400 leading-relaxed">{val.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center pt-8">
            <p className="text-slate-500 text-xs uppercase tracking-wider mb-2">Want to partner with us?</p>
            <a
              href="mailto:partner@characteru.com"
              className="text-primary-400 hover:text-primary-300 font-semibold transition-colors duration-200"
            >
              partner@characteru.com
            </a>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default About;
