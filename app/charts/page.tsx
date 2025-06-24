'use client';
import Plot from 'react-plotly.js';
import { useTodoStore } from '../store/todo';
import AdvancedPlot from './AdvancePlotlyChart';

export default function ChartsPage() {
  const { todos } = useTodoStore();

  const wordCounts = todos.map((todo) => todo.title.split(' ').length);

  const sortedTodos = [...todos]
    .map((todo) => ({
      ...todo,
      createdDate: new Date(todo?.createdDate),
      wordCount: todo.title.split(' ').length,
    }))
    .sort((a, b) => a.createdDate.getTime() - b.createdDate.getTime());

  const scatterX = sortedTodos.map((todo) => todo?.createdDate?.toISOString());
  const scatterY = sortedTodos.map((todo) => todo?.wordCount);

  return (
    <div style={{ maxWidth: 700, margin: 'auto', padding: 20 }}>
      <h2>Todo Word Count Histogram</h2>
      {/* <Plot
        data={[
          {
            type: 'histogram',
            x: wordCounts,
            marker: { color: '#1890ff' },
          },
        ]}
        layout={{
          title: 'Word Count Distribution',
          autosize: true,
          height: 400,
          margin: { t: 50, b: 50, l: 50, r: 50 },
          xaxis: { title: 'Word Count' },
          yaxis: { title: 'Frequency' },
          dragmode: 'zoom',
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '400px' }}
        config={{ responsive: true }}
      />

      <h2>Overlay Scatter Chart (Word Count over Time)</h2>
      <Plot
        data={[
          {
            x: scatterX,
            y: scatterY,
            mode: 'markers+lines',
            type: 'scatter',
            name: 'Word Count',
            marker: { color: '#1890ff' },
            line: { shape: 'linear' },
          },
        ]}
        layout={{
          title: 'Word Count Over Created Date',
          autosize: true,
          height: 400,
          margin: { t: 50, b: 80, l: 50, r: 50 },
          xaxis: {
            title: 'Created Date',
            type: 'date',
            tickformat: '%b %d, %Y',
            tickangle: -45,
            automargin: true,
          },
          yaxis: { title: 'Word Count' },
          dragmode: 'zoom',
          legend: { orientation: 'h', y: -0.2 },
        }}
        useResizeHandler={true}
        style={{ width: '100%', height: '400px' }}
        config={{ responsive: true }}
      /> */}
      <AdvancedPlot/>
    </div>
  );
}
