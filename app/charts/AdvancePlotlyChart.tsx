'use client';

import { useState, useCallback } from 'react';
import Plot from 'react-plotly.js';
import { Modal, Typography, Space, Button } from 'antd';

const { Title } = Typography;

type DataPoint = {
  id: number;
  x: number;
  y: number;
  name: string;
  dosage: number;
  frequency: string;
  isSquare: boolean;
  valueCheck: number;
};

function generateRandomData(): DataPoint[] {
  const data: DataPoint[] = [];
  for (let i = 0; i < 1000; i++) {
    const x = Math.random() * 1000;
    const y = (Math.random() - 0.5) * 100;
    const valueCheck = Math.floor(Math.random() * 100);
    const isSquare = Math.random() < 0.1;
    const dosage = 5 + Math.floor(Math.random() * 495);
    const frequencies = ['Once a day', 'Twice a day', 'Three times a day', 'As needed'];
    const frequency = frequencies[Math.floor(Math.random() * frequencies.length)];
    
    data.push({
      id: i,
      x,
      y,
      name: `Patient ${i}`,
      dosage,
      frequency,
      isSquare,
      valueCheck,
    });
  }
  return data;
}

export default function ScatterSelectZoom() {
  const [data] = useState<DataPoint[]>(generateRandomData());
  const [zoomHistory, setZoomHistory] = useState<Array<{x: number[], y: number[]}>>([]);
  const [interactionMode, setInteractionMode] = useState<'select' | 'zoom'>('select');

  const [layout, setLayout] = useState({
    dragmode: 'select',
    hovermode: 'closest',
    xaxis: { title: 'Patient Index', fixedrange: false, range: [0, 1000] },
    yaxis: { title: 'Measurement Value', fixedrange: false, zeroline: true, range: [-50, 50] },
    margin: { t: 30, b: 40, l: 60, r: 30 },
    showlegend: false,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<DataPoint | null>(null);

  const markerColors = data.map((d) => (d.valueCheck > 70 ? 'red' : 'black'));
  const markerSymbols = data.map((d) => (d.isSquare ? 'square' : 'circle'));

  const scatterTrace = {
    type: 'scatter',
    mode: 'markers',
    x: data.map((d) => d.x),
    y: data.map((d) => d.y),
    marker: {
      color: markerColors,
      symbol: markerSymbols,
      size: 8,
      opacity: 0.7,
      line: { color: 'gray', width: 1 },
    },
    text: data.map(
      (d) =>
        `<b>${d.name}</b><br>Dosage: ${d.dosage} mg<br>Frequency: ${d.frequency}<br>ValueCheck: ${d.valueCheck}`
    ),
    hoverinfo: 'text',
    selected: {
      marker: {
        opacity: 1
      }
    },
    unselected: {
      marker: {
        opacity: 0.7
      }
    }
  };

  const handleSelected = useCallback((event: any) => {
    if (!event || !event.range) {
      return;
    }

    const { x: xRange, y: yRange } = event.range;

    if (xRange && yRange) {
      setZoomHistory(prev => [...prev, {
        x: [layout.xaxis.range?.[0] || 0, layout.xaxis.range?.[1] || 1000],
        y: [layout.yaxis.range?.[0] || -50, layout.yaxis.range?.[1] || 50]
      }]);

      const xPadding = (xRange[1] - xRange[0]) * 0.1;
      const yPadding = (xRange[1] - xRange[0]) * 0.1;

      setLayout(prev => ({
        ...prev,
        xaxis: { ...prev.xaxis, range: [xRange[0] - xPadding, xRange[1] + xPadding] },
        yaxis: { ...prev.yaxis, range: [yRange[0] - yPadding, yRange[1] + yPadding] },
      }));

      setInteractionMode('zoom');
    }
  }, [layout]);

  const resetZoom = useCallback(() => {
    if (zoomHistory.length > 0) {
      const prevZoom = zoomHistory[zoomHistory.length - 1];
      setZoomHistory(prev => prev.slice(0, -1));
      setLayout(prev => ({
        ...prev,
        xaxis: { ...prev.xaxis, range: prevZoom.x },
        yaxis: { ...prev.yaxis, range: prevZoom.y },
      }));
    } else {
      setLayout(prev => ({
        ...prev,
        xaxis: { ...prev.xaxis, range: [0, 1000] },
        yaxis: { ...prev.yaxis, range: [-50, 50] },
      }));
    }
    setInteractionMode('select');
  }, [zoomHistory]);

  const handleRightClick = useCallback((event: any) => {
    event.preventDefault();
    const points = event.points;
    if (points && points.length > 0) {
      const idx = points[0].pointIndex;
      setModalData(data[idx]);
      setModalOpen(true);
    }
  }, [data]);

  const updatedLayout = {
    ...layout,
    dragmode: interactionMode,
    hovermode: 'closest'
  };

  return (
    <>
      <Title level={3} style={{ textAlign: 'center' }}>
        Interactive Scatter Plot
      </Title>
      <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
        <Button onClick={resetZoom}>
          {zoomHistory.length > 0 ? 'Back' : 'Reset Zoom'}
        </Button>
        <Button onClick={() => setInteractionMode(mode => mode === 'select' ? 'zoom' : 'select')}>
          {interactionMode === 'select' ? 'Switch to Zoom' : 'Switch to Select'}
        </Button>
      </div>
      <div style={{ width: '100%', height: 600 }}>
        <Plot
          data={[scatterTrace]}
          layout={updatedLayout}
          config={{ 
            scrollZoom: true,
            responsive: true,
            displayModeBar: true,
            modeBarButtonsToRemove: ['lasso2d'],
            displaylogo: false
          }}
          style={{ width: '100%', height: '100%' }}
          useResizeHandler
          onSelected={interactionMode === 'select' ? handleSelected : undefined}
          onContextMenu={handleRightClick}
        />
      </div>
      {modalData && (
        <Modal
          open={modalOpen}
          title={`Details for ${modalData.name}`}
          onCancel={() => setModalOpen(false)}
          footer={null}
          width={400}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <div><b>Name:</b> {modalData.name}</div>
            <div><b>Dosage:</b> {modalData.dosage} mg</div>
            <div><b>Frequency:</b> {modalData.frequency}</div>
            <div><b>X:</b> {modalData.x.toFixed(2)}</div>
            <div><b>Y:</b> {modalData.y.toFixed(2)}</div>
            <div><b>ValueCheck:</b> {modalData.valueCheck}</div>
            <div><b>Shape:</b> {modalData.isSquare ? 'Square' : 'Circle'}</div>
            <div>
              <b>Color:</b> {modalData.valueCheck > 70 ? 'Red (ValueCheck > 70)' : 'Black'}
            </div>
          </Space>
        </Modal>
      )}
    </>
  );
}