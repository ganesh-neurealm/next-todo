'use client';

import { useState } from 'react';
import Plot from 'react-plotly.js';
import { Config, Data } from 'plotly.js';
import { Typography, Space, Divider, Select } from 'antd';

const { Title } = Typography;
const { Option } = Select;

const chartConfigs = [
  {
    title: 'Histogram',
    type: 'histogram',
    data: { x: [1, 2, 2, 3, 4, 4, 4, 5, 6] },
    layout: {},
  },
  {
    title: 'Bar Chart',
    type: 'bar',
    data: { x: ['A', 'B', 'C'], y: [20, 14, 23] },
    layout: {},
  },
  {
    title: 'Box Plot',
    type: 'box',
    data: { y: [7, 8, 5, 6, 9, 4, 5, 3, 7, 6] },
    layout: {},
  },
  {
    title: 'Violin Plot',
    type: 'violin',
    data: { y: [7, 8, 5, 6, 9, 4, 5, 3, 7, 6], box: { visible: true }, line: { color: 'blue' } },
    layout: {},
  },
  {
    title: 'Heatmap',
    type: 'heatmap',
    data: { z: [[1, 20, 30], [20, 1, 60], [30, 60, 1]] },
    layout: {},
  },
  {
    title: 'Contour Plot',
    type: 'contour',
    data: { z: [[10, 10.625, 12.5], [5.625, 6.25, 8.125], [2.5, 3.125, 5]] },
    layout: {},
  },
  {
    title: 'Pie Chart',
    type: 'pie',
    data: { values: [19, 26, 55], labels: ['Residential', 'Non-Residential', 'Utility'] },
    layout: {},
  },
  {
    title: 'Sunburst',
    type: 'sunburst',
    data: {
      labels: ['Eve', 'Cain', 'Seth', 'Enos', 'Noam'],
      parents: ['', 'Eve', 'Eve', 'Seth', 'Seth'],
    },
    layout: {},
  },
  {
    title: 'Treemap',
    type: 'treemap',
    data: {
      labels: ['A', 'B', 'C', 'D', 'E'],
      parents: ['', 'A', 'A', 'B', 'B'],
    },
    layout: {},
  },
  {
    title: 'Line Chart',
    type: 'scatter',
    data: { x: [1, 2, 3, 4], y: [10, 15, 13, 17], mode: 'lines' },
    layout: {},
  },
  {
    title: 'Area Chart',
    type: 'scatter',
    data: { x: [1, 2, 3, 4], y: [10, 15, 13, 17], fill: 'tozeroy', mode: 'none' },
    layout: {},
  },
  {
    title: 'Bubble Chart',
    type: 'scatter',
    data: {
      x: [1, 2, 3, 4],
      y: [10, 15, 13, 17],
      mode: 'markers',
      marker: { size: [40, 60, 80, 100] },
    },
    layout: {},
  },
  {
    title: 'Funnel',
    type: 'funnel',
    data: { y: ['Website', 'Signup', 'Purchase'], x: [100, 60, 30] },
    layout: {},
  },
  {
    title: 'Polar Chart',
    type: 'scatterpolar',
    data: {
      r: [39, 28, 8, 7, 28, 39],
      theta: ['A', 'B', 'C', 'D', 'E', 'A'],
      mode: 'lines',
    },
    layout: { polar: { radialaxis: { visible: true } } },
  },
  {
    title: 'OHLC Chart',
    type: 'ohlc',
    data: {
      x: ['2024-01-01', '2024-01-02'],
      open: [33, 35],
      high: [35, 37],
      low: [30, 32],
      close: [34, 36],
    },
    layout: {},
  },
  {
    title: 'Candlestick Chart',
    type: 'candlestick',
    data: {
      x: ['2024-01-01', '2024-01-02'],
      open: [33, 35],
      high: [35, 37],
      low: [30, 32],
      close: [34, 36],
    },
    layout: {},
  },
  {
    title: 'Parallel Coordinates',
    type: 'parcoords',
    data: {
      dimensions: [
        { label: 'A', values: [1, 4] },
        { label: 'B', values: [3, 2] },
      ],
    },
    layout: {},
  },
  {
    title: 'Sankey Diagram',
    type: 'sankey',
    data: {
      node: { label: ['A', 'B', 'C'] },
      link: { source: [0, 1], target: [1, 2], value: [10, 5] },
    },
    layout: {},
  },
  {
    title: 'Table',
    type: 'table',
    data: {
      header: { values: [['Name'], ['Age']], align: 'center' },
      cells: { values: [['Alice', 'Bob'], [24, 27]], align: 'center' },
    },
    layout: {},
  },
];

export default function FullChartDashboard() {
  const [dragMode, setDragMode] = useState<'zoom' | 'pan' | 'select' | 'lasso' | 'orbit' | 'turntable'>('zoom');
  const [hoverMode, setHoverMode] = useState<'closest' | 'x' | 'y' | false>('closest');

  const config: Partial<Config> = {
    responsive: true,
    scrollZoom: true,
    displaylogo: false,
    modeBarButtonsToAdd: [
      'zoomIn2d',
      'zoomOut2d',
      'resetScale2d',
      'autoScale2d',
      'pan2d',
      'select2d',
      'lasso2d',
      'orbitRotation',
    ],
    modeBarButtonsToRemove: ['toImage'],
  };

  return (
    <div className="px-4 p-4 max-w-5xl mx-auto">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space wrap>
          <Select value={dragMode} onChange={(val) => setDragMode(val)} style={{ width: 160 }}>
            <Option value="zoom">Zoom</Option>
            <Option value="pan">Pan</Option>
            <Option value="select">Select</Option>
            <Option value="lasso">Lasso</Option>
            <Option value="orbit">Orbit</Option>
            <Option value="turntable">Turntable</Option>
          </Select>
          <Select value={hoverMode} onChange={(val) => setHoverMode(val)} style={{ width: 160 }}>
            <Option value="closest">Closest</Option>
            <Option value="x">X</Option>
            <Option value="y">Y</Option>
            <Option value={false}>Off</Option>
          </Select>
        </Space>
        {chartConfigs.map((cfg, idx) => (
          <div key={idx}>
            <Divider />
            <Title level={4}>{cfg.title}</Title>
            <Plot
              data={[{ type: cfg.type, ...cfg.data }] as Data[]}
              layout={{
                dragmode: dragMode,
                hovermode: hoverMode,
                autosize: true,
                ...cfg.layout,
              }}
              config={config}
              useResizeHandler
              style={{ width: '100%', height: 400 }}
            />
          </div>
        ))}
      </Space>
    </div>
  );
}
