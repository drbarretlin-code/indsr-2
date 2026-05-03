import React, { useState } from 'react';
import { BrochureState, PageData, ThemeType, BlockType } from '../types';
import { ChevronDown, ChevronUp, Image as ImageIcon, FileText, BarChart3, Link as LinkIcon, Palette, ChevronLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface InputFormProps {
  state: BrochureState;
  onChange: (page: keyof BrochureState, data: PageData) => void;
  onThemeChange: (theme: ThemeType) => void;
  onCollapse?: () => void;
}

const PAGE_CONFIGS = [
  { id: 'page1', title: 'Page 1: Front Cover', icon: ImageIcon },
  { id: 'page2', title: 'Page 2: Back Cover (Intl. Cooperation)', icon: FileText },
  { id: 'page3', title: 'Page 3: Inside Flap (Whole-of-Society)', icon: FileText },
  { id: 'page4', title: 'Page 4: Inside Left (Security & Threats)', icon: FileText },
  { id: 'page5', title: 'Page 5: Inside Center (Defense Strategy)', icon: FileText },
  { id: 'page6', title: 'Page 6: Inside Right (Military Strategy)', icon: FileText },
] as const;

export function InputForm({ state, onChange, onThemeChange, onCollapse }: InputFormProps) {
  const [openSection, setOpenSection] = useState<string>('page1');

  return (
    <div className="w-full max-w-md bg-white border-r border-slate-200 h-screen overflow-y-auto flex flex-col no-print">
      <div className="p-6 border-b border-slate-200 bg-slate-50 sticky top-0 z-10 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">INDSR Brochure Generator</h1>
          <p className="text-sm text-slate-500 mt-1">Edit content to update preview</p>
        </div>
        {onCollapse && (
          <button 
            onClick={onCollapse}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Theme Selector */}
      <div className="p-4 border-b border-slate-200 bg-white">
        <div className="flex items-center space-x-2 mb-3">
          <Palette className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700">Select Theme</h3>
        </div>
        <select
          value={state.theme}
          onChange={(e) => onThemeChange(e.target.value as ThemeType)}
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white text-slate-900"
        >
          <option value="business">Business (商務風)</option>
          <option value="tech">Cutting-edge Tech (前沿科技風)</option>
          <option value="official">Official Professional (官方專業風)</option>
          <option value="nature">Warm Healing/Nature (溫暖治癒/自然風)</option>
          <option value="academic">Academic/Institutional (學術/機構風)</option>
          <option value="military">Military Weapons (軍事武器風)</option>
          <option value="dashboard">Data Dashboard (數據儀表盤風)</option>
        </select>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {PAGE_CONFIGS.map((config, index) => {
          const isOpen = openSection === config.id;
          const pageId = config.id as 'page1' | 'page2' | 'page3' | 'page4' | 'page5' | 'page6';
          const pageData = state[pageId];
          const Icon = config.icon;

          return (
            <div key={config.id} className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
              <button
                className="w-full px-4 py-3 flex items-center justify-between bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenSection(isOpen ? '' : config.id)}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 text-slate-500" />
                  <span className="font-medium text-slate-700 text-sm">{config.title}</span>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {isOpen && (
                <div className="p-4 space-y-4 border-t border-slate-200">
                  {config.id === 'page1' ? (
                    <FrontCoverForm data={pageData} onChange={(data) => onChange(pageId, data)} />
                  ) : (
                    <StandardPageForm data={pageData} onChange={(data) => onChange(pageId, data)} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CharWarning = ({ text = '', limit }: { text?: string, limit: number }) => {
  const len = text?.length || 0;
  const isOver = len > limit;
  return (
    <div className="mt-1 flex flex-col">
      <div className={cn("text-[10px] text-right", isOver ? "text-red-500 font-medium" : "text-slate-400")}>
        {len} / {limit}
      </div>
      {isOver && (
        <div className="text-[10px] text-red-500 mt-0.5 text-right">
          已超出字數限制，將影響版面配置，請確認
        </div>
      )}
    </div>
  );
};

function FrontCoverForm({ data, onChange }: { data: PageData; onChange: (data: PageData) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Logo URL</label>
        <input
          type="text"
          name="logoUrl"
          value={data.logoUrl || ''}
          onChange={handleChange}
          placeholder="https://example.com/logo.png"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
        />
        <p className="text-[10.5px] text-slate-500 mt-1.5 leading-tight">
          請將圖例上傳至此網址 <a href="https://duk.tw/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 hover:underline font-medium">https://duk.tw/</a> 製作圖片連結
        </p>
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-medium text-slate-700">Logo Size</label>
          <span className="text-xs text-slate-500">{data.logoSize || 128}px</span>
        </div>
        <input
          type="range"
          min="32"
          max="256"
          step="8"
          value={data.logoSize || 128}
          onChange={(e) => onChange({ ...data, logoSize: parseInt(e.target.value) })}
          className="w-full"
        />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-medium text-slate-700">Title</label>
          {data.title && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Size:</span>
              <input
                type="range"
                min="16"
                max="72"
                step="2"
                value={data.titleSize || 36}
                onChange={(e) => onChange({ ...data, titleSize: parseInt(e.target.value) })}
                className="w-20"
              />
              <span className="text-[10px] text-slate-500 w-6">{data.titleSize || 36}px</span>
            </div>
          )}
        </div>
        <input
          type="text"
          name="title"
          value={data.title || ''}
          onChange={handleChange}
          placeholder="Brochure Title"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
        />
        <CharWarning text={data.title} limit={40} />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-medium text-slate-700">Subtitle</label>
          {data.subtitle && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Size:</span>
              <input
                type="range"
                min="12"
                max="48"
                step="2"
                value={data.subtitleSize || 20}
                onChange={(e) => onChange({ ...data, subtitleSize: parseInt(e.target.value) })}
                className="w-20"
              />
              <span className="text-[10px] text-slate-500 w-6">{data.subtitleSize || 20}px</span>
            </div>
          )}
        </div>
        <input
          type="text"
          name="subtitle"
          value={data.subtitle || ''}
          onChange={handleChange}
          placeholder="Brochure Subtitle"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
        />
        <CharWarning text={data.subtitle} limit={80} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Agency</label>
          <textarea
            name="agency"
            value={data.agency || ''}
            onChange={handleChange}
            placeholder="Agency Name"
            rows={2}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
          />
          <CharWarning text={data.agency} limit={80} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Date</label>
          <input
            type="date"
            name="date"
            value={data.date || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
          />
          <CharWarning text={data.date} limit={40} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-700 mb-1">Date/Agency Order</label>
        <select
          name="dateAgencyOrder"
          value={data.dateAgencyOrder || 'date-agency'}
          onChange={handleChange}
          className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 bg-white"
        >
          <option value="date-agency">Date then Agency</option>
          <option value="agency-date">Agency then Date</option>
        </select>
      </div>
    </div>
  );
}

const DEFAULT_BLOCK_ORDER: BlockType[] = ['content', 'image', 'chart', 'source'];

function StandardPageForm({ data, onChange }: { data: PageData; onChange: (data: PageData) => void }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange({ ...data, [e.target.name]: e.target.value });
  };

  const blockOrder = data.blockOrder || DEFAULT_BLOCK_ORDER;

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...blockOrder];
    if (direction === 'up' && index > 0) {
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    } else if (direction === 'down' && index < newOrder.length - 1) {
      [newOrder[index + 1], newOrder[index]] = [newOrder[index], newOrder[index + 1]];
    }
    onChange({ ...data, blockOrder: newOrder });
  };

  const renderBlock = (block: BlockType, index: number) => {
    const moveButtons = (
      <div className="flex items-center gap-1">
        <button 
          onClick={() => handleMoveBlock(index, 'up')} 
          disabled={index === 0} 
          className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-500"
          title="Move Up"
        >
          <ArrowUp size={14} />
        </button>
        <button 
          onClick={() => handleMoveBlock(index, 'down')} 
          disabled={index === blockOrder.length - 1} 
          className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 text-slate-500"
          title="Move Down"
        >
          <ArrowDown size={14} />
        </button>
      </div>
    );

    switch (block) {
      case 'content':
        return (
          <div key="content">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-slate-700">Main Content</label>
              {moveButtons}
            </div>
            <textarea
              name="content"
              value={data.content || ''}
              onChange={handleChange}
              rows={6}
              placeholder="Enter the main text content here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 resize-y text-slate-900"
            />
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Font Size</label>
                <input
                  type="number"
                  name="contentFontSize"
                  value={data.contentFontSize ?? ''}
                  onChange={(e) => onChange({ ...data, contentFontSize: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                  placeholder="14"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-slate-500 mb-1">Line Height</label>
                <input
                  type="number"
                  name="contentLineHeight"
                  value={data.contentLineHeight ?? ''}
                  onChange={(e) => onChange({ ...data, contentLineHeight: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
                  placeholder="1.4"
                  step="0.1"
                  className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
                />
              </div>
            </div>
            <CharWarning text={data.content} limit={400} />
          </div>
        );
      case 'image':
        return (
          <div key="image" className="p-4 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Page Image</h4>
              </div>
              {moveButtons}
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Image URL</label>
                <input
                  type="text"
                  name="imageUrl"
                  value={data.imageUrl || ''}
                  onChange={handleChange}
                  placeholder="https://example.com/image.png"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  請將圖例上傳至此網址 <a href="https://duk.tw/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://duk.tw/</a> 製作圖片連結
                </p>
              </div>
              <div>
                <div className="flex justify-between items-center mb-1 mt-3">
                  <label className="block text-xs font-medium text-slate-700">Image Size (Logo Size)</label>
                  <span className="text-xs text-slate-500">{data.imageSize || 128}px</span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="256"
                  step="8"
                  value={data.imageSize || 128}
                  onChange={(e) => onChange({ ...data, imageSize: parseInt(e.target.value) })}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Image Caption</label>
                <textarea
                  name="imageCaption"
                  value={data.imageCaption || ''}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Enter caption for the image..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
                />
                <div className="mt-2">
                  <label className="block text-[10px] font-medium text-slate-500 mb-1">Caption Position</label>
                  <select
                    name="imageCaptionPosition"
                    value={data.imageCaptionPosition || 'bottom'}
                    onChange={handleChange}
                    className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900 bg-white"
                  >
                    <option value="bottom">Bottom</option>
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1">Font Size</label>
                    <input
                      type="number"
                      name="imageCaptionFontSize"
                      value={data.imageCaptionFontSize ?? ''}
                      onChange={(e) => onChange({ ...data, imageCaptionFontSize: e.target.value === '' ? undefined : parseInt(e.target.value) })}
                      placeholder="12"
                      className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-medium text-slate-500 mb-1">Line Height</label>
                    <input
                      type="number"
                      name="imageCaptionLineHeight"
                      value={data.imageCaptionLineHeight ?? ''}
                      onChange={(e) => onChange({ ...data, imageCaptionLineHeight: e.target.value === '' ? undefined : parseFloat(e.target.value) })}
                      placeholder="1.4"
                      step="0.1"
                      className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'chart':
        return (
          <div key="chart" className="p-4 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-slate-500" />
                <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Chart Data</h4>
              </div>
              {moveButtons}
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Chart Type</label>
                <select
                  name="chartType"
                  value={data.chartType || 'bar'}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white text-slate-900"
                >
                  <option value="bar">Bar Chart (長條圖)</option>
                  <option value="pie">Pie Chart (圓餅圖)</option>
                  <option value="line">Line Chart (折線圖)</option>
                  <option value="scatter">Scatter Plot (散布圖)</option>
                  <option value="radar">Radar Chart (雷達圖)</option>
                  <option value="composed">Composed Chart (組合圖)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Data (CSV or Key:Value)</label>
                <textarea
                  name="chartDataInput"
                  value={data.chartDataInput || ''}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Label, Value&#10;Item 1, 45&#10;Item 2, 30"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 font-mono text-xs text-slate-900"
                />
              </div>
            </div>
          </div>
        );
      case 'source':
        return (
          <div key="source">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-xs font-medium text-slate-700">Source / Citation</label>
              {moveButtons}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                name="source"
                value={data.source || ''}
                onChange={handleChange}
                placeholder="Source URL or text"
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
              />
            </div>
            <CharWarning text={data.source} limit={100} />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-medium text-slate-700">Section Title</label>
          {data.title && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Size:</span>
              <input
                type="range"
                min="16"
                max="48"
                step="2"
                value={data.titleSize || 24}
                onChange={(e) => onChange({ ...data, titleSize: parseInt(e.target.value) })}
                className="w-20"
              />
              <span className="text-[10px] text-slate-500 w-6">{data.titleSize || 24}px</span>
            </div>
          )}
        </div>
        <input
          type="text"
          name="title"
          value={data.title || ''}
          onChange={handleChange}
          placeholder="Section Title"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
        />
        <CharWarning text={data.title} limit={40} />
      </div>
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="block text-xs font-medium text-slate-700">Section Subtitle</label>
          {data.subtitle && (
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500">Size:</span>
              <input
                type="range"
                min="12"
                max="36"
                step="2"
                value={data.subtitleSize || 18}
                onChange={(e) => onChange({ ...data, subtitleSize: parseInt(e.target.value) })}
                className="w-20"
              />
              <span className="text-[10px] text-slate-500 w-6">{data.subtitleSize || 18}px</span>
            </div>
          )}
        </div>
        <input
          type="text"
          name="subtitle"
          value={data.subtitle || ''}
          onChange={handleChange}
          placeholder="Section Subtitle (Optional)"
          className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-900"
        />
        <CharWarning text={data.subtitle} limit={80} />
      </div>
      {blockOrder.map((block, index) => renderBlock(block, index))}
    </div>
  );
}
