import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import PORTFOLIO_CONFIG from './portfolioData';
import { useReducedMotion } from './useReducedMotion';
import { FiCode as Code, FiCpu as Cpu, FiCheckCircle as CheckCircle } from 'react-icons/fi';

type Skill = typeof PORTFOLIO_CONFIG.skills[number];

type TabCategory = 'all' | 'Frontend' | 'Backend & Données' | '3d-design' | 'Outils' | 'learning';

interface TabItem {
  id: TabCategory;
  label: string;
  badge: number;
}

export const SkillsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabCategory>('all');
  const reducedMotion = useReducedMotion();

  const allSkills = PORTFOLIO_CONFIG.skills;
  const learningSkills = PORTFOLIO_CONFIG.learningSkills;

  const count3DDesign = allSkills.filter(
    (s) => s.category === 'Création 3D' || s.category === 'Design'
  ).length;

  const tabs: TabItem[] = [
    { id: 'all', label: 'TOUTES', badge: allSkills.length },
    { id: 'Frontend', label: 'FRONTEND', badge: allSkills.filter((s) => s.category === 'Frontend').length },
    { id: 'Backend & Données', label: 'BACKEND & DATA', badge: allSkills.filter((s) => s.category === 'Backend & Données').length },
    { id: '3d-design', label: '3D & CRÉATION', badge: count3DDesign },
    { id: 'Outils', label: 'OUTILS & DEVOPS', badge: allSkills.filter((s) => s.category === 'Outils').length },
    { id: 'learning', label: 'VEILLE ACTIVE', badge: learningSkills.length },
  ];

  const getFilteredSkills = (): Skill[] => {
    if (activeTab === 'all') return allSkills;
    if (activeTab === '3d-design') {
      return allSkills.filter((s) => s.category === 'Création 3D' || s.category === 'Design');
    }
    if (activeTab === 'learning') return [];
    return allSkills.filter((s) => s.category === activeTab);
  };

  const filteredSkills = getFilteredSkills();
  const showLearningDirectly = activeTab === 'learning' || activeTab === 'all';

  return (
    <div className="space-y-8">
      {/* Category Tabs Bar */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 border-b-2 border-black pb-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const isLearningTab = tab.id === 'learning';

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 font-mono text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-2 border-2 border-black ${
                isActive
                  ? isLearningTab
                    ? 'bg-[#7C3AED] text-white shadow-[4px_4px_0px_#000000]'
                    : 'bg-[#0055FF] text-white shadow-[4px_4px_0px_#000000]'
                  : 'bg-white text-[#475569] hover:text-black hover:bg-[#F8FAFC] shadow-[2px_2px_0px_#000000]'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 font-mono font-bold border ${
                  isActive
                    ? 'bg-black text-white border-white/40'
                    : 'bg-[#F1F5F9] text-black border-black/30'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Primary Production Technologies Grid */}
      {activeTab !== 'learning' && (
        <div className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
          <div className="flex items-center justify-between border-b border-black/15 pb-4 mb-6 font-mono text-xs">
            <span className="text-[#0055FF] font-bold flex items-center gap-2">
              <Code size={16} />
              STACK // PRODUCTION & ARCHITECTURE
            </span>
            <span className="text-[#64748B] font-bold">
              {filteredSkills.length} TECHNOLOGIE{filteredSkills.length > 1 ? 'S' : ''} RÉPERTORIÉE{filteredSkills.length > 1 ? 'S' : ''}
            </span>
          </div>

          <motion.div
            layout={!reducedMotion}
            className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3"
          >
            <AnimatePresence mode="popLayout">
              {filteredSkills.map((skill) => {
                const IconComponent = skill.icon;
                return (
                  <motion.div
                    key={skill.name}
                    layout={!reducedMotion}
                    initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={reducedMotion ? undefined : { opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.18 }}
                    className="flex items-center gap-3 px-3.5 py-3 bg-[#F8FAFC] border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#0055FF] hover:text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000] transition-all group cursor-default"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-white border border-black text-[#0055FF] group-hover:bg-black group-hover:text-white group-hover:border-white transition-colors shrink-0">
                      <IconComponent size={18} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-xs font-bold block truncate">
                        {skill.name}
                      </span>
                      <span className="text-[10px] text-[#64748B] group-hover:text-white/80 font-mono block truncate">
                        {skill.category}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Dedicated R&D & Veille Active Box */}
      {showLearningDirectly && (
        <div className="bg-[#FAF5FF] border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_#000000]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/15 pb-4 mb-6 font-mono text-xs">
            <span className="text-[#7C3AED] font-bold flex items-center gap-2">
              <Cpu size={16} />
              LAB_RECHERCHE // VEILLE TECHNOLOGIQUE & EXPÉRIMENTATION
            </span>
            <span className="px-2.5 py-0.5 bg-[#7C3AED] text-white font-bold border border-black shadow-[2px_2px_0px_#000000]">
              EN PROGRESSION ACTIVE
            </span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3.5">
            {learningSkills.map((skill) => {
              const IconComponent = skill.icon;
              return (
                <div
                  key={skill.name}
                  className="flex items-center gap-3.5 px-4 py-3.5 bg-white border-2 border-black shadow-[3px_3px_0px_#000000] hover:bg-[#7C3AED] hover:text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_#000000] transition-all group"
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-[#F3E8FF] border border-[#7C3AED] text-[#7C3AED] group-hover:bg-white group-hover:text-black group-hover:border-black transition-colors shrink-0">
                    <IconComponent size={18} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-bold block truncate">
                        {skill.name}
                      </span>
                      <CheckCircle size={12} className="text-[#7C3AED] group-hover:text-white shrink-0" />
                    </div>
                    <span className="text-[10px] text-[#64748B] group-hover:text-white/80 font-mono block">
                      En cours d'adoption
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsHub;
