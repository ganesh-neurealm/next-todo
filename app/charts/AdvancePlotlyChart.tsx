'use client';

import Plot from 'react-plotly.js';
import { Layout, Config, Data } from 'plotly.js';
import { Typography, Space, Divider } from 'antd';

const { Title } = Typography;

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

  return (
    <div className="p-4 max-w-6xl mx-auto">

      <Space direction="vertical" size="large" style={{ width: '100%' }}>
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
            layout={{ title: 'Histogram of X', autosize: true } as Partial<Layout>}
            config={{ responsive: true } as Partial<Config>}
            useResizeHandler
            style={{ width: '100%', height: '400px' }}
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
            layout={{ title: 'Scatter Plot (X vs Y)', autosize: true } as Partial<Layout>}
            config={{ responsive: true } as Partial<Config>}
            useResizeHandler
            style={{ width: '100%', height: '400px' }}
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
            layout={
              {
                title: 'Scatter with Range Slider',
                xaxis: { rangeslider: { visible: true }, title: 'X' },
                yaxis: { title: 'Y' },
                autosize: true,
              } as Partial<Layout>
            }
            config={{ responsive: true } as Partial<Config>}
            useResizeHandler
            style={{ width: '100%', height: '400px' }}
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
            layout={
              {
                title: '3D Scatter Plot',
                scene: {
                  xaxis: { title: 'X' },
                  yaxis: { title: 'Y' },
                  zaxis: { title: 'Z' },
                },
                autosize: true,
              } as Partial<Layout>
            }
            config={{ responsive: true } as Partial<Config>}
            useResizeHandler
            style={{ width: '100%', height: '500px' }}
          />
        </div>

        <Divider />

        <div>
          <Title level={4}>5. 3D Surface Plot</Title>
          <Plot
            data={
              [
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
              ] as unknown as Data[]
            }
            layout={{ title: '3D Surface Plot', autosize: true } as Partial<Layout>}
            config={{ responsive: true } as Partial<Config>}
            useResizeHandler
            style={{ width: '100%', height: '500px' }}
          />
        </div>
      </Space>
    </div>
  );
}
