'use client';
// import Plot from 'react-plotly.js';
// import { useTodoStore } from '../store/todo';

export default function ChartsPage() {
  // const { todos } = useTodoStore();
  // const wordCounts = todos.map((todo) => todo.title.split(' ').length);

  return (
    <div>
      <h2>Todo Word Count Histogram</h2>
      {/* <Plot
        data={[{ type: 'histogram', x: wordCounts }]}
        layout={{ width: 600, height: 400, title: 'Word Count Distribution' }}
      />

      <h2>Word Count vs Todo Index (Scatter)</h2>
      <Plot
        data={[{
          x: todos.map((_, idx) => idx),
          y: wordCounts,
          mode: 'markers',
          type: 'scatter',
        }]}
        layout={{ width: 600, height: 400, title: 'Scatter Plot' }}
      /> */}
    </div>
  );
}