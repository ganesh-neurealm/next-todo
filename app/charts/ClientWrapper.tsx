'use client';

import dynamic from 'next/dynamic';

const FullChartDashboard = dynamic(() => import('./AdvancePlotlyChart'), {
  ssr: false,
});

export default function ClientWrapper() {
  return <FullChartDashboard />;
}
