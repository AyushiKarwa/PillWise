import React from 'react';
import { useCabinet } from '../context/CabinetContext';
import { BackButtonHeader } from '../components/BackButtonHeader';
import { History, Pill, TrendingUp, Calendar, Bot } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export const HistoryPage: React.FC = () => {
  const { consumptionHistory, aiHistory } = useCabinet();

  // Aggregate logs by date for Recharts
  const chartMap: Record<string, number> = {};
  consumptionHistory.forEach((log) => {
    const d = log.date;
    chartMap[d] = (chartMap[d] || 0) + (log.quantityTaken || 1);
  });

  const chartData = Object.keys(chartMap).map((date) => ({
    date,
    count: chartMap[date]
  })).slice(-7);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in pb-12">
      <BackButtonHeader title="Intake History" subtitle="Audit Logs & Activity" />
      <div>
        <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-teal-600" />
          Consumption & Activity History
        </h1>
        <p className="text-xs text-slate-500">
          Comprehensive audit trail of medicine intakes, dosage events, and past AI symptom evaluations.
        </p>
      </div>

      {/* Recharts Consumption Chart */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            Intake Frequency Chart
          </h3>
          <span className="text-[11px] font-semibold text-slate-400">Past 7 Activity Days</span>
        </div>

        {chartData.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-6 text-center">No consumption logs available to chart.</p>
        ) : (
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Consumption Logs Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Pill className="w-4 h-4 text-emerald-600" />
          Medicine Intake Audit Logs
        </h3>

        {consumptionHistory.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">No intake history logged yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Medicine Name</th>
                  <th className="pb-3">Quantity</th>
                  <th className="pb-3">Notes / Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {consumptionHistory.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/80">
                    <td className="py-3 text-slate-500">
                      {log.date} {log.time}
                    </td>
                    <td className="py-3 font-bold text-slate-900">{log.medicineName}</td>
                    <td className="py-3 font-bold text-emerald-700">-{log.quantityTaken} dose</td>
                    <td className="py-3 text-slate-500">{log.notes || 'Confirmed intake'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Search Logs */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          <Bot className="w-4 h-4 text-teal-600" />
          Past AI Symptom Evaluations
        </h3>

        {aiHistory.length === 0 ? (
          <p className="text-xs text-slate-400 italic py-4">No AI evaluations recorded.</p>
        ) : (
          <div className="space-y-3">
            {aiHistory.map((ai) => (
              <div key={ai._id} className="p-4 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-slate-900">Symptom Query: "{ai.symptoms}"</p>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {new Date(ai.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600">
                  <span className="font-semibold text-slate-800">Matched Cabinet Item:</span>{' '}
                  {ai.aiResponse?.availableMedicine?.name || 'None'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
