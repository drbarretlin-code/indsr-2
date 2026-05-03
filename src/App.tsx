/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BrochureState, PageData, ThemeType } from './types';
import { InputForm } from './components/InputForm';
import { BrochurePreview } from './components/BrochurePreview';
import { Printer, Share2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from './lib/utils';

const DEFAULT_STATE: BrochureState = {
  theme: 'official',
  page1: {
    title: 'National Defense Strategy',
    subtitle: 'Securing Our Future',
    date: '2026-04-01',
    agency: 'Department of Defense',
    logoUrl: 'https://duk.tw/3TVWN6.png',
    logoSize: 200,
  },
  page2: {
    title: 'International Cooperation & Pillars',
    content: 'Strong alliances and partnerships are the cornerstone of our security strategy. We work closely with international allies to promote stability, uphold international law, and address shared challenges.\nTogether, we build the pillars of lasting peace and prosperity.',
    source: 'https://indsr.org.tw/',
    imageUrl: 'https://duk.tw/eSjIdV.jpg',
    chartType: 'scatter',
    chartDataInput: 'Govt, 30\nPrivate Sector, 50\nPublic, 20',
  },
  page3: {
    title: 'Whole-of-Society Defense & Resilience',
    content: 'National defense is not solely the responsibility of the military. It requires a whole-of-society effort, involving government agencies, private sector partners, and the public.\nBuilding resilience in our critical infrastructure and supply chains is paramount to withstanding and recovering from disruptions.',
    chartType: 'bar',
    chartDataInput: 'Govt, 30\nPrivate Sector, 50\nPublic, 20',
  },
  page4: {
    title: 'Security Environment & Threats',
    content: 'The global security environment is increasingly complex and dynamic. We face a range of challenges from state and non-state actors, requiring a comprehensive and adaptable approach to national defense.\nKey areas of concern include cyber warfare, regional instability, and the proliferation of advanced technologies.',
    chartType: 'bar',
    chartDataInput: 'Cyber Attacks, 85\nRegional Conflicts, 60\nTerrorism, 40\nEspionage, 55',
    source: 'Annual Threat Assessment 2025',
  },
  page5: {
    title: 'National Defense Strategy & Objectives',
    content: 'Our primary objective is to deter aggression and protect the homeland. We achieve this through a combination of military readiness, strategic partnerships, and technological superiority.\n1. Defend the Homeland\n2. Deter Strategic Attacks\n3. Build a Resilient Joint Force',
    chartType: 'pie',
    chartDataInput: 'Readiness, 40\nModernization, 35\nOperations, 25',
  },
  page6: {
    title: 'Military Strategy & Operational Concepts',
    content: 'We employ a multi-domain operational concept, integrating land, sea, air, space, and cyberspace capabilities. This ensures we can rapidly respond to crises and maintain a decisive advantage over potential adversaries.',
    chartType: 'line',
    chartDataInput: '2022, 100\n2023, 120\n2024, 150\n2025, 180\n2026, 210',
    source: 'Force Posture Review',
  },
};

export default function App() {
  const [state, setState] = useState<BrochureState>(DEFAULT_STATE);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load state from localStorage or URL hash on mount
  useEffect(() => {
    try {
      // 1. Try localStorage
      const savedState = localStorage.getItem('brochureState');
      if (savedState) {
        const parsed = JSON.parse(savedState);
        // Simple validation: check if it has a theme
        if (parsed && parsed.theme) {
          setState(parsed);
          return;
        } else {
          localStorage.removeItem('brochureState');
        }
      }

      // 2. Fallback to URL hash
      const hash = window.location.hash.slice(1);
      if (hash) {
        const decoded = JSON.parse(decodeURIComponent(hash));
        if (decoded && decoded.theme) {
          setState(decoded);
          return;
        }
      }
      
      // 3. Ensure default state is applied
      setState(DEFAULT_STATE);
    } catch (e) {
      console.error('Failed to load state', e);
      setState(DEFAULT_STATE);
    }
  }, []);

  // Auto-save state to localStorage on change
  useEffect(() => {
    localStorage.setItem('brochureState', JSON.stringify(state));
  }, [state]);

  // Safety check: ensure state is populated
  useEffect(() => {
    if (!state.theme) {
      setState({ ...DEFAULT_STATE });
    }
  }, [state]);

  const handlePageChange = (pageId: keyof BrochureState, data: PageData) => {
    setState((prev) => ({
      ...prev,
      [pageId]: data,
    }));
  };

  const handleThemeChange = (theme: ThemeType) => {
    setState((prev) => ({
      ...prev,
      theme,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="flex h-screen w-full bg-navy overflow-hidden font-sans print:h-auto print:bg-white print:overflow-visible print:block relative">
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden no-print"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar - Input Form */}
      <aside className={cn(
        "transition-all duration-300 ease-in-out flex-shrink-0 border-r border-slate-200 bg-white no-print absolute md:relative z-40 h-full",
        isSidebarOpen ? "w-full max-w-sm sm:max-w-md translate-x-0" : "w-full max-w-sm sm:max-w-md -translate-x-full md:w-0 md:translate-x-0 md:overflow-hidden md:border-none"
      )}>
        <InputForm 
          state={state} 
          onChange={handlePageChange} 
          onThemeChange={handleThemeChange} 
          onCollapse={() => setIsSidebarOpen(false)}
        />
      </aside>

      {/* Right Side - Live Preview */}
      <section className="flex-1 h-full overflow-y-auto relative print:overflow-visible print:p-0 overflow-x-hidden print:block print:h-auto" aria-label="Brochure Preview">
        {/* Floating Action Buttons */}
        <div className="fixed top-4 right-4 md:top-6 md:right-6 flex flex-col md:flex-row items-end md:items-center space-y-2 md:space-y-0 md:space-x-3 z-50 no-print">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center justify-center w-10 h-10 bg-white text-slate-700 rounded-full shadow-md hover:shadow-lg transition-all border border-slate-200"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-4 py-2 bg-slate-900 text-white rounded-full shadow-md hover:shadow-lg hover:bg-slate-800 transition-all font-medium text-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>

        {/* Preview Container */}
        <div className="p-8 min-h-full flex flex-col items-center justify-center print:p-0 print:block">
          <BrochurePreview state={state} />
        </div>
      </section>
    </main>
  );
}
