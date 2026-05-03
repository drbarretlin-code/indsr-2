import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ScatterChart,
  Scatter,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  Area,
} from 'recharts';

interface ChartRendererProps {
  dataInput?: string;
  chartType?: 'bar' | 'pie' | 'line' | 'scatter' | 'radar' | 'composed';
  colors?: string[];
  textColor?: string;
  gridColor?: string;
}

const DEFAULT_COLORS = ['#0f172a', '#334155', '#64748b', '#94a3b8', '#cbd5e1', '#e2e8f0'];

export function ChartRenderer({ 
  dataInput, 
  chartType = 'bar',
  colors = DEFAULT_COLORS,
  textColor = '#64748b',
  gridColor = '#e2e8f0'
}: ChartRendererProps) {
  const data = useMemo(() => {
    if (!dataInput) return [];
    
    const lines = dataInput.trim().split('\n');
    const parsedData = lines.map((line) => {
      const parts = line.split(/[,:\t]/);
      if (parts.length >= 2) {
        const item: any = {
          name: parts[0].trim(),
          value: parseFloat(parts[1].trim()) || 0,
        };
        // Parse additional values if present
        for (let i = 2; i < parts.length; i++) {
          item[`value${i}`] = parseFloat(parts[i].trim()) || 0;
        }
        return item;
      }
      return null;
    }).filter(Boolean);
    
    return parsedData;
  }, [dataInput]);

  if (!data || data.length === 0) {
    return null;
  }

  const tooltipStyle = {
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderColor: gridColor,
    color: '#fff',
    borderRadius: '4px',
    fontSize: '12px'
  };

  const renderChart = () => {
    switch (chartType) {
      case 'pie': {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        const pieData = data.map(item => ({
          ...item,
          legendName: `${item.name} ${total > 0 ? Math.round((item.value / total) * 100) : 0}%`
        }));

        return (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
              <Pie
                data={pieData}
                cx="50%"
                cy="40%"
                labelLine={false}
                outerRadius="75%"
                dataKey="value"
                nameKey="legendName"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
              <Legend 
                layout="horizontal"
                verticalAlign="bottom" 
                align="left"
                iconType="circle" 
                wrapperStyle={{ fontSize: '11px', color: textColor, paddingTop: '10px' }} 
              />
            </PieChart>
          </ResponsiveContainer>
        );
      }
      case 'line':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: textColor }} stroke={textColor} tickMargin={10} />
              <YAxis tick={{ fontSize: 11, fill: textColor }} stroke={textColor} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
              <Line type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={2} dot={{ r: 4, fill: colors[0] }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" type="category" allowDuplicatedCategory={false} tick={{ fontSize: 11, fill: textColor }} stroke={textColor} tickMargin={10} />
              <YAxis dataKey="value" type="number" tick={{ fontSize: 11, fill: textColor }} stroke={textColor} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
              <Scatter name="Data" data={data} fill={colors[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case 'radar':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
              <PolarGrid stroke={gridColor} />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: textColor }} />
              <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={{ fontSize: 11, fill: textColor }} />
              <Radar name="Data" dataKey="value" stroke={colors[0]} fill={colors[0]} fillOpacity={0.6} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
            </RadarChart>
          </ResponsiveContainer>
        );
      case 'composed':
        return (
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: textColor }} stroke={textColor} tickMargin={10} />
              <YAxis tick={{ fontSize: 11, fill: textColor }} stroke={textColor} />
              <Tooltip contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
              <Legend wrapperStyle={{ fontSize: '11px', color: textColor, paddingTop: '10px' }} />
              <Area type="monotone" dataKey="value" fill={colors[0]} stroke={colors[0]} fillOpacity={0.2} />
              <Bar dataKey="value" barSize={20} fill={colors[1] || colors[0]} />
              <Line type="monotone" dataKey={data[0]?.value2 !== undefined ? 'value2' : 'value'} stroke={colors[2] || colors[0]} strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        );
      case 'bar':
      default:
        return (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: textColor }} stroke={textColor} tickMargin={10} />
              <YAxis tick={{ fontSize: 11, fill: textColor }} stroke={textColor} />
              <Tooltip cursor={{ fill: gridColor, opacity: 0.4 }} contentStyle={tooltipStyle} itemStyle={{ color: '#fff' }} />
              <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {renderChart()}
    </div>
  );
}
