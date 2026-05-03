export type ChartType = 'bar' | 'pie' | 'line' | 'scatter' | 'radar' | 'composed';
export type ThemeType = 'business' | 'tech' | 'official' | 'nature' | 'academic' | 'military' | 'dashboard';
export type ImagePosition = 'top' | 'middle' | 'bottom';
export type BlockType = 'content' | 'image' | 'chart' | 'source';

export interface PageData {
  title?: string;
  titleSize?: number;
  subtitle?: string;
  subtitleSize?: number;
  date?: string;
  agency?: string;
  dateAgencyOrder?: 'date-agency' | 'agency-date';
  logoUrl?: string;
  logoSize?: number;
  source?: string;
  content?: string;
  contentFontSize?: number;
  contentLineHeight?: number;
  imageCaption?: string;
  imageCaptionPosition?: 'left' | 'right';
  imageCaptionFontSize?: number;
  imageCaptionLineHeight?: number;
  chartDataInput?: string;
  chartType?: ChartType;
  imageUrl?: string;
  imagePosition?: ImagePosition;
  imageSize?: number;
  blockOrder?: BlockType[];
}

export interface BrochureState {
  theme: ThemeType;
  page1: PageData; // Front Cover
  page2: PageData; // Inside Left
  page3: PageData; // Inside Center
  page4: PageData; // Inside Right
  page5: PageData; // Inside Flap
  page6: PageData; // Back Cover
}
