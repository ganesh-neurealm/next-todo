'use client';

import { useState } from 'react';
import Plot from 'react-plotly.js';
import { Layout, Config, Data } from 'plotly.js';
import { Typography, Space, Divider, Select } from 'antd';

const { Title } = Typography;
const { Option } = Select;

export default function FullChartDashboard() {
  const x = [1, 2, 3, 4, 5, 6, 7, 8];
  const y = [2, 4, 1, 8, 6, 3, 5, 7];
  const z = [1, 3, 5, 2, 4, 6, 8, 7];

  const surfaceZ = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [3, 4, 5, 6],
    [4, 5, 6, 7],
  ];

  const [dragMode, setDragMode] = useState<'zoom' | 'pan' | 'select' | 'lasso' | 'orbit' | 'turntable'>('zoom');
  const [hoverMode, setHoverMode] = useState<'closest' | 'x' | 'y' | false>('closest');
  const [fixedRangeX, setFixedRangeX] = useState(false);
  const [fixedRangeY, setFixedRangeY] = useState(false);

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

  const commonLayout: Partial<Layout> = {
    dragmode: dragMode,
    hovermode: hoverMode,
    autosize: true,
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space wrap>
          <Select value={dragMode} onChange={(val) => setDragMode(val)} style={{ width: 160 }}>
            <Option value="zoom">Zoom</Option>
            <Option value="pan">Pan</Option>
            <Option value="select">Select</Option>
            <Option value="lasso">Lasso Select</Option>
            <Option value="orbit">Orbit (3D)</Option>
            <Option value="turntable">Turntable (3D)</Option>
          </Select>

          <Select value={hoverMode} onChange={(val) => setHoverMode(val)} style={{ width: 160 }}>
            <Option value="closest">Hover Closest</Option>
            <Option value="x">Hover X</Option>
            <Option value="y">Hover Y</Option>
            <Option value={false}>Hover Off</Option>
          </Select>

          <Select
            value={fixedRangeX ? 'fixed' : 'free'}
            onChange={(val) => setFixedRangeX(val === 'fixed')}
            style={{ width: 140 }}
          >
            <Option value="free">X Zoom Free</Option>
            <Option value="fixed">X Zoom Fixed</Option>
          </Select>

          <Select
            value={fixedRangeY ? 'fixed' : 'free'}
            onChange={(val) => setFixedRangeY(val === 'fixed')}
            style={{ width: 140 }}
          >
            <Option value="free">Y Zoom Free</Option>
            <Option value="fixed">Y Zoom Fixed</Option>
          </Select>
        </Space>

        <Divider />

        <div>
          <Title level={4}>1. Histogram</Title>
          <Plot
            data={[
              {
                type: 'histogram',
                x,
                marker: { color: 'rgba(100, 149, 237, 0.7)' },
                name: 'X Histogram',
              },
            ] as Data[]}
            layout={{
              ...commonLayout,
              title: 'Histogram of X',
              xaxis: {
                rangeslider: { visible: true },
                title: 'X',
                fixedrange: fixedRangeX,
              },
              yaxis: {
                title: 'Count',
                fixedrange: fixedRangeY,
              },
            } as Partial<Layout>}
            config={config}
            useResizeHandler
            style={{ width: '100%', height: 400 }}
          />
        </div>

        <Divider />

        <div>
          <Title level={4}>2. 2D Scatter Plot</Title>
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'markers',
                x,
                y,
                marker: {
                  color: 'crimson',
                  size: 10,
                  line: { color: 'black', width: 1 },
                },
                name: 'Y vs X',
              },
            ] as Data[]}
            layout={{
              ...commonLayout,
              title: 'Scatter Plot (X vs Y)',
              xaxis: {
                rangeslider: { visible: true },
                title: 'X',
                fixedrange: fixedRangeX,
              },
              yaxis: {
                title: 'Y',
                fixedrange: fixedRangeY,
              },
            } as Partial<Layout>}
            config={config}
            useResizeHandler
            style={{ width: '100%', height: 400 }}
          />
        </div>

        <Divider />

        <div>
          <Title level={4}>3. Range Slider + Scatter</Title>
          <Plot
            data={[
              {
                type: 'scatter',
                mode: 'lines+markers',
                x,
                y,
                name: 'Interactive Data',
                marker: { color: 'green' },
              },
            ] as Data[]}
            layout={{
              ...commonLayout,
              title: 'Scatter with Range Slider',
              xaxis: {
                rangeslider: { visible: true },
                title: 'X',
                fixedrange: fixedRangeX,
              },
              yaxis: {
                title: 'Y',
                fixedrange: fixedRangeY,
              },
            } as Partial<Layout>}
            config={config}
            useResizeHandler
            style={{ width: '100%', height: 400 }}
          />
        </div>

        <Divider />

        <div>
          <Title level={4}>4. 3D Scatter Plot</Title>
          <Plot
            data={[
              {
                type: 'scatter3d',
                mode: 'markers',
                x,
                y,
                z,
                marker: {
                  size: 6,
                  color: z,
                  colorscale: 'Portland',
                  opacity: 0.8,
                },
                name: '3D Points',
              },
            ] as Data[]}
            layout={{
              ...commonLayout,
              title: '3D Scatter Plot',
              scene: {
                xaxis: { title: 'X' },
                yaxis: { title: 'Y' },
                zaxis: { title: 'Z' },
              },
            } as Partial<Layout>}
            config={config}
            useResizeHandler
            style={{ width: '100%', height: 500 }}
          />
        </div>

        <Divider />

        <div>
          <Title level={4}>5. 3D Surface Plot</Title>
          <Plot
            data={[
              {
                type: 'surface',
                z: surfaceZ,
                colorscale: 'YlGnBu',
                contours: {
                  z: {
                    show: true,
                    usecolormap: true,
                    highlightcolor: '#42f462',
                    project: { z: true },
                  },
                },
              },
            ] as unknown as Data[]}
            layout={{
              ...commonLayout,
              title: '3D Surface Plot',
              scene: {
                xaxis: { title: 'X' },
                yaxis: { title: 'Y' },
                zaxis: { title: 'Z' },
              },
            } as Partial<Layout>}
            config={config}
            useResizeHandler
            style={{ width: '100%', height: 500 }}
          />
        </div>
      </Space>
    </div>
  );
}
