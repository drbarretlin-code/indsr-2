import React, { useRef, useState, useEffect } from 'react';
import { BrochureState } from '../types';
import { ChartRenderer } from './ChartRenderer';
import { cn } from '../lib/utils';
import { Shield } from 'lucide-react';

interface BrochurePreviewProps {
  state: BrochureState;
}

export const THEMES = {
  business: {
    sheetBg: 'bg-[#f8fafc]',
    frontCover: 'bg-[#0f172a] text-white',
    panel: 'bg-white border border-slate-200 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]',
    heading: 'text-[#0f172a] font-sans font-bold tracking-tight',
    subheading: 'text-[#3b82f6] font-sans font-semibold uppercase tracking-wider text-xs',
    body: 'text-[#334155] font-sans leading-relaxed',
    source: 'text-[#64748b] font-sans text-xs',
    divider: 'border-slate-200',
    chartColors: ['#0f172a', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    chartText: '#334155',
    chartGrid: '#e2e8f0',
    frontCoverHeading: 'text-white font-sans font-bold tracking-tight',
    frontCoverSubheading: 'text-[#60a5fa] font-sans font-semibold uppercase tracking-wider',
  },
  tech: {
    sheetBg: 'bg-[#050510]',
    frontCover: 'bg-gradient-to-br from-[#0a0a2a] to-[#2a0a4a] text-cyan-300',
    panel: 'bg-[#0a0a20]/80 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)]',
    heading: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 font-sans font-black uppercase tracking-widest',
    subheading: 'text-purple-300 font-mono text-xs font-bold uppercase tracking-widest',
    body: 'text-slate-200 font-sans leading-relaxed',
    source: 'text-cyan-600 font-mono text-xs',
    divider: 'border-cyan-500/20',
    chartColors: ['#06b6d4', '#a855f7', '#3b82f6', '#ec4899', '#22d3ee'],
    chartText: '#94a3b8',
    chartGrid: '#1e293b',
    frontCoverHeading: 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-purple-300 font-sans font-black uppercase tracking-widest',
    frontCoverSubheading: 'text-purple-200 font-mono text-sm font-bold uppercase tracking-widest',
  },
  official: {
    sheetBg: 'bg-navy blueprint-bg',
    frontCover: 'bg-navy text-white',
    panel: 'bg-navy/90 border-gold/50',
    heading: 'text-gold font-sans font-bold tracking-tight',
    subheading: 'text-gold font-sans font-semibold uppercase tracking-wider text-sm',
    body: 'text-white font-sans leading-relaxed font-medium',
    source: 'text-slate-300 font-sans font-medium',
    divider: 'border-gold/30',
    chartColors: ['#D4AF37', '#FFD700', '#C5A059', '#E6C200', '#B8860B'],
    chartText: '#FFFFFF',
    chartGrid: '#D4AF37',
    frontCoverHeading: 'text-white font-sans font-bold tracking-tight',
    frontCoverSubheading: 'text-gold font-sans font-semibold uppercase tracking-wider',
  },
  nature: {
    sheetBg: 'bg-[#fdfbf7]',
    frontCover: 'bg-[#8a9a5b] text-[#fdfbf7]',
    panel: 'bg-[#fdfbf7]/80 backdrop-blur-sm border border-[#8a9a5b]/20 shadow-sm',
    heading: 'text-[#4a5d23] font-serif font-bold tracking-wide',
    subheading: 'text-[#6b7d4a] font-serif italic font-medium',
    body: 'text-[#5a5a4a] font-serif leading-relaxed',
    source: 'text-[#8a9a5b] font-serif text-xs',
    divider: 'border-[#8a9a5b]/30',
    chartColors: ['#8a9a5b', '#c5d3a5', '#e5e1d8', '#b4c6a6', '#d9e0d1'],
    chartText: '#5a5a4a',
    chartGrid: 'rgba(138, 154, 91, 0.2)',
    frontCoverHeading: 'text-[#fdfbf7] font-serif font-bold tracking-wide',
    frontCoverSubheading: 'text-[#e5e1d8] font-serif italic font-medium',
  },
  academic: {
    sheetBg: 'bg-[#ffffff]',
    frontCover: 'bg-[#00204E] text-[#ffffff]',
    panel: 'bg-[#ffffff] border-[#00204E]/20 shadow-sm',
    heading: 'text-[#00204E] font-serif font-bold tracking-tight',
    subheading: 'text-[#00204E]/80 font-sans font-semibold uppercase text-xs tracking-widest',
    body: 'text-[#1a1a1a] font-serif leading-relaxed',
    source: 'text-[#4a4a4a] font-sans text-xs',
    divider: 'border-[#00204E]/30',
    chartColors: ['#00204E', '#335c81', '#6699cc', '#99ccee', '#ccddee'],
    chartText: '#1a1a1a',
    chartGrid: '#e5e7eb',
    frontCoverHeading: 'text-[#ffffff] font-serif font-bold tracking-tight',
    frontCoverSubheading: 'text-[#d1d5db] font-sans font-semibold uppercase text-sm tracking-widest',
  },
  military: {
    sheetBg: 'bg-[#C2B280]',
    frontCover: 'bg-[#4B5320] text-[#f0f0f0]',
    panel: 'bg-[#333333] text-[#f0f0f0]',
    heading: 'text-[#C2B280] font-sans font-black uppercase tracking-widest',
    subheading: 'text-[#00FF00] font-mono text-xs uppercase',
    body: 'text-[#f0f0f0] font-mono text-sm leading-relaxed',
    source: 'text-[#FF8C00] font-mono text-[10px] uppercase',
    divider: 'border-[#4B5320]',
    chartColors: ['#00FF00', '#FF8C00', '#C2B280', '#4B5320', '#333333'],
    chartText: '#f0f0f0',
    chartGrid: '#4B5320',
    frontCoverHeading: 'text-[#C2B280] font-sans font-black uppercase tracking-widest text-4xl',
    frontCoverSubheading: 'text-[#00FF00] font-mono text-lg font-bold uppercase tracking-widest',
  },
  dashboard: {
    sheetBg: 'bg-[#09090b]',
    frontCover: 'bg-[#18181b] text-white',
    panel: 'bg-[#18181b] border border-[#27272a] shadow-lg',
    heading: 'text-white font-sans font-bold tracking-tight',
    subheading: 'text-[#3b82f6] font-mono text-xs uppercase tracking-widest font-bold',
    body: 'text-[#a1a1aa] font-mono text-sm leading-relaxed',
    source: 'text-[#71717a] font-mono text-xs',
    divider: 'border-[#27272a]',
    chartColors: ['#22c55e', '#3b82f6', '#06b6d4', '#8b5cf6', '#f59e0b'],
    chartText: '#a1a1aa',
    chartGrid: '#27272a',
    frontCoverHeading: 'text-white font-sans font-bold tracking-tight',
    frontCoverSubheading: 'text-[#3b82f6] font-mono text-xs uppercase tracking-widest font-bold',
  }
};

export function BrochurePreview({ state }: BrochurePreviewProps) {
  const currentTheme = THEMES[state.theme] || THEMES.business;
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        // A4 landscape width is 297mm. In pixels (96dpi), it's about 1122.5px.
        const containerWidth = containerRef.current.clientWidth;
        // Padding is 32px (p-8 is 2rem = 32px on each side, so 64px total)
        const availableWidth = containerWidth - 64;
        // Calculate the scale needed to fit the available width
        // 1123 is the approximate pixel width of 297mm at 96dpi
        const newScale = Math.min(1, availableWidth / 1123);
        setScale(newScale);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Calculate the margin bottom needed to collapse the empty space left by scaling
  // 210mm is the height of A4 landscape. In pixels it's about 794px.
  const marginBottom = scale < 1 ? `-${794 * (1 - scale)}px` : '0px';

  const sheet1Ref = useRef<HTMLDivElement>(null);
  const sheet2Ref = useRef<HTMLDivElement>(null);

  const exportAsPNG = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!ref.current) return;
    try {
      const { default: domtoimage } = await import('dom-to-image');
      const dataUrl = await domtoimage.toPng(ref.current, {
        quality: 1.0,
        bgcolor: '#ffffff',
      });
      const link = document.createElement('a');
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('PNG export failed:', error);
      alert('PNG export failed. Please try again.');
    }
  };

  const exportAsPDF = async (ref: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!ref.current) return;
    try {
      const { default: html2pdf } = await import('html2pdf.js');
      const opt = {
        margin: 0,
        filename: `${filename}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' as const }
      };
      await html2pdf().set(opt).from(ref.current).save();
    } catch (error) {
      console.error('PDF export failed:', error);
      alert('PDF export failed. Please try again.');
    }
  };

  return (
    <div ref={containerRef} className="w-full flex flex-col items-center print:block">
      <div 
        className="preview-container flex flex-col gap-4 items-center print:block print:gap-0 transition-transform duration-200"
        style={{ 
          '--preview-scale': scale,
          '--preview-margin-bottom': marginBottom
        } as React.CSSProperties}
      >
        {/* Sheet 1: Outside (Flap, Back, Front) */}
        <div ref={sheet1Ref} className={cn("page-sheet shadow-xl print:shadow-none flex flex-row overflow-hidden relative", currentTheme.sheetBg)}>
          {/* Page 3: Inside Flap */}
          <Panel data={state.page3} theme={currentTheme} themeName={state.theme} pageNumber={3} className={cn("border-r border-dashed print:border-none", currentTheme.divider)} />
          
          {/* Page 2: Back Cover */}
          <Panel data={state.page2} theme={currentTheme} themeName={state.theme} pageNumber={2} className={cn("border-r border-dashed print:border-none", currentTheme.divider)} />
          
          {/* Page 1: Front Cover */}
          <FrontCoverPanel data={state.page1} theme={currentTheme} themeName={state.theme} />
        </div>

        {/* Sheet 2: Inside (Left, Center, Right) */}
        <div ref={sheet2Ref} className={cn("page-sheet shadow-xl print:shadow-none flex flex-row overflow-hidden relative", currentTheme.sheetBg)}>
          {/* Page 4: Inside Left */}
          <Panel data={state.page4} theme={currentTheme} themeName={state.theme} pageNumber={4} className={cn("border-r border-dashed print:border-none", currentTheme.divider)} />
          
          {/* Page 5: Inside Center */}
          <Panel data={state.page5} theme={currentTheme} themeName={state.theme} pageNumber={5} className={cn("border-r border-dashed print:border-none", currentTheme.divider)} />
          
          {/* Page 6: Inside Right */}
          <Panel data={state.page6} theme={currentTheme} themeName={state.theme} pageNumber={6} />
        </div>
      </div>
    </div>
  );
}

function Panel({ data, className, theme, themeName, pageNumber }: { data: any; className?: string; theme: any; themeName?: string; pageNumber?: number }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        setIsOverflowing(scrollHeight > clientHeight + 2);
      }
    };
    
    checkOverflow();
    const timeoutId = setTimeout(checkOverflow, 100);
    const timeoutId2 = setTimeout(checkOverflow, 500);
    
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [data, theme, themeName, pageNumber]);

  const renderImage = () => {
    if (!data.imageUrl) return null;
    const position = data.imageCaptionPosition || 'bottom';
    const isCaptionSide = position === 'left' || position === 'right';

    return (
      <div key="image" className={cn("w-full my-4 shrink-0 flex relative", isCaptionSide ? "flex-row items-center gap-4" : "flex-col justify-center items-center")}>
        <div className={cn("flex justify-center", position === 'right' ? "order-1" : "order-0")} style={{ height: data.imageSize || 128 }}>
          <img 
            src={data.imageUrl} 
            alt={data.title ? `Illustration for ${data.title}` : "Page content illustration"} 
            className={cn("max-w-full h-full object-contain", themeName === 'military' ? "filter grayscale sepia hue-rotate-90 brightness-75 contrast-125" : "")} 
            referrerPolicy="no-referrer" 
          />
          {themeName === 'military' && <div className="absolute inset-0 bg-black/20 mix-blend-overlay pointer-events-none" />}
        </div>
        {data.imageCaption && (
          <div 
            className={cn("text-left [overflow-wrap:anywhere] hyphens-auto", theme.body, isCaptionSide ? "flex-1" : "mt-2 text-center")}
            style={{ 
              fontSize: data.imageCaptionFontSize ? `${data.imageCaptionFontSize}px` : '12px',
              lineHeight: data.imageCaptionLineHeight ? `${data.imageCaptionLineHeight}` : '1.4'
            }}
          >
            {data.imageCaption}
          </div>
        )}
      </div>
    );
  };

  const blockOrder = data.blockOrder || ['content', 'image', 'source', 'chart'];

  const renderBlock = (block: string) => {
    switch (block) {
      case 'content':
        return data.content ? (
            <div 
            key="content" 
            className={cn("whitespace-pre-wrap shrink-0 mt-2 text-left [overflow-wrap:anywhere] hyphens-auto", theme.body)} 
            style={{ 
              fontSize: data.contentFontSize ? `${data.contentFontSize}px` : '16px',
              lineHeight: data.contentLineHeight ? `${data.contentLineHeight}` : '1.4'
            }}
            lang="en"
          >
            {data.content.replace(/\n\s*\n/g, '\n')}
          </div>
        ) : null;
      case 'image':
        return renderImage();
      case 'chart':
        return data.chartDataInput ? (
          <div key="chart" className="w-full h-56 flex-shrink-0 mt-auto">
            <ChartRenderer 
              dataInput={data.chartDataInput} 
              chartType={data.chartType} 
              colors={theme.chartColors}
              textColor={theme.chartText}
              gridColor={theme.chartGrid}
            />
          </div>
        ) : null;
      case 'source':
        return data.source ? (
          <div key="source" className={cn("mt-3 pt-2 border-t text-xs italic flex-shrink-0 text-left [overflow-wrap:anywhere] hyphens-auto", theme.source, theme.divider)} lang="en">
            Source: {data.source.startsWith('http') ? (
              <a href={data.source} target="_blank" rel="noopener noreferrer" className="hover:underline text-blue-600">
                {data.source}
              </a>
            ) : (
              data.source
            )}
          </div>
        ) : null;
      default:
        return null;
    }
  };

  return (
    <div className={cn("flex-1 p-8 flex flex-col h-full overflow-hidden relative", theme.panel, className)}>
      {themeName === 'military' && (
        <>
          <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-[#4B5320]" />
          <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-[#4B5320]" />
          <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-[#4B5320]" />
          <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-[#4B5320]" />
        </>
      )}
      {isOverflowing && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-xs px-3 py-1.5 rounded shadow-md print:hidden z-50 whitespace-nowrap font-bold animate-pulse">
          請調整資料量、以完整顯示個卡片內容
        </div>
      )}
      <div ref={contentRef} className="flex flex-col justify-start gap-2 relative z-10 h-full overflow-hidden">
        <div className="flex items-start gap-3 shrink-0">
          {themeName === 'official' && pageNumber && (
            <div className="w-8 h-8 rounded-full bg-[#0f172a] text-[#b48600] border-2 border-[#b48600] flex items-center justify-center font-bold shrink-0 mt-1 shadow-sm">
              {pageNumber}
            </div>
          )}
          <div className="flex-1">
            {themeName === 'military' && <span className="text-[8px] font-mono text-[#00FF00] block mb-0.5">SN: {Math.random().toString(36).substr(2, 8).toUpperCase()}</span>}
            {data.title && (
              <h2 
                className={cn("shrink-0", theme.heading)}
                style={{ fontSize: data.titleSize ? `${data.titleSize}px` : '1.5rem', lineHeight: 1.2 }}
              >
                {data.title}
              </h2>
            )}
            {data.subtitle && (
              <h3 
                className={cn("shrink-0 mt-1", theme.subheading)}
                style={{ fontSize: data.subtitleSize ? `${data.subtitleSize}px` : '1.125rem', lineHeight: 1.2 }}
              >
                {data.subtitle}
              </h3>
            )}
          </div>
        </div>
        
        <div className="flex flex-col flex-1 gap-0.5">
          {blockOrder.map((block, index) => {
            const element = renderBlock(block);
            if (!element) return null;
            
            // Find if this is the last actually rendered block
            const remainingBlocks = blockOrder.slice(index + 1);
            const isLastRendered = !remainingBlocks.some(b => {
              if (b === 'content') return !!data.content;
              if (b === 'image') return !!data.imageUrl;
              if (b === 'chart') return !!data.chartDataInput;
              if (b === 'source') return !!data.source;
              return false;
            });

            const hasChartRendered = !!data.chartDataInput && blockOrder.includes('chart');

            if (isLastRendered && !hasChartRendered) {
              return (
                <div key={`wrapper-${block}`} className="mt-auto">
                  {element}
                </div>
              );
            }
            return element;
          })}
        </div>
      </div>
    </div>
  );
}

function FrontCoverPanel({ data, className, theme, themeName }: { data: any; className?: string; theme: any; themeName?: string }) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    const checkOverflow = () => {
      if (contentRef.current) {
        const { scrollHeight, clientHeight } = contentRef.current;
        setIsOverflowing(scrollHeight > clientHeight + 2);
      }
    };
    
    checkOverflow();
    const timeoutId = setTimeout(checkOverflow, 100);
    const timeoutId2 = setTimeout(checkOverflow, 500);
    
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.removeEventListener('resize', checkOverflow);
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [data, theme, themeName]);

  return (
    <div className={cn("flex-1 p-10 flex flex-col h-full overflow-hidden relative", theme.frontCover, className)}>
      {themeName === 'military' && (
        <>
          <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-[#C2B280]" />
          <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-[#C2B280]" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-2 border-[#C2B280]" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-[#C2B280]" />
        </>
      )}
      {isOverflowing && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-red-500/90 text-white text-xs px-3 py-1.5 rounded shadow-md print:hidden z-50 whitespace-nowrap font-bold animate-pulse">
          請調整資料量、以完整顯示個卡片內容
        </div>
      )}
      <div ref={contentRef} className="flex flex-col h-full overflow-hidden relative z-10">
        {/* Background graphic for official theme */}
        {themeName === 'official' && (
          <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
            <Shield className="w-96 h-96 text-white" />
          </div>
        )}
        
        <div className="flex-grow flex flex-col items-center justify-start text-center gap-3 relative z-10">
        {themeName === 'military' && <span className="text-[10px] font-mono text-[#00FF00] block mb-1">SN: {Math.random().toString(36).substr(2, 12).toUpperCase()}</span>}
        {data.logoUrl ? (
          <img 
            src={data.logoUrl} 
            alt={data.agency ? `${data.agency} Logo` : "Agency Logo"} 
            style={{ width: data.logoSize || 128, height: data.logoSize || 128 }}
            className={cn("shrink-0", themeName === 'official' ? "rounded-full border-4 border-[#b48600] p-1 bg-white object-cover" : "object-contain", themeName === 'military' ? "filter grayscale sepia hue-rotate-90 brightness-75 contrast-125" : "")} 
            referrerPolicy="no-referrer" 
          />
        ) : (
          themeName === 'official' && (
            <div 
              style={{ width: data.logoSize || 128, height: data.logoSize || 128 }}
              className="rounded-full border-4 border-[#b48600] flex items-center justify-center bg-[#0f172a] shrink-0 shadow-lg"
            >
              <Shield className="w-1/2 h-1/2 text-[#b48600]" />
            </div>
          )
        )}
        
        {data.title && (
          <h1 
            className={cn("leading-tight shrink-0 mt-4", theme.frontCoverHeading || theme.heading)}
            style={{ fontSize: data.titleSize ? `${data.titleSize}px` : '2.25rem' }}
          >
            {data.title}
          </h1>
        )}
        
        {data.subtitle && (
          <h2 
            className={cn("shrink-0", theme.frontCoverSubheading || theme.subheading)}
            style={{ fontSize: data.subtitleSize ? `${data.subtitleSize}px` : '1.25rem' }}
          >
            {data.subtitle}
          </h2>
        )}
      </div>
      
      {(data.date || data.agency) && (
        <div className={cn("mt-auto text-center border-t pt-3 flex-shrink-0", theme.divider)}>
          {data.dateAgencyOrder === 'agency-date' ? (
            <>
              {data.agency && <div className={cn("text-base whitespace-pre-wrap mb-1", theme.frontCoverHeading || theme.heading)}>{data.agency}</div>}
              {data.date && <div className={cn("text-sm", theme.frontCoverSubheading || theme.subheading)}>{data.date}</div>}
            </>
          ) : (
            <>
              {data.date && <div className={cn("text-sm mb-1", theme.frontCoverSubheading || theme.subheading)}>{data.date}</div>}
              {data.agency && <div className={cn("text-base whitespace-pre-wrap", theme.frontCoverHeading || theme.heading)}>{data.agency}</div>}
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
