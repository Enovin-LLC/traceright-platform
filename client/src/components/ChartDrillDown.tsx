import React, { useState } from 'react';
import { Dialog } from './ui/dialog';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { X, ArrowLeft, ExternalLink, Table as TableIcon, BarChart3 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * Chart Drill Down System
 * 
 * Provides drill-down (detailed table) and drill-across (related reports) functionality
 * for any chart in the dashboard
 */

export interface DrillDownData {
  title: string;
  category: string;
  value: number | string;
  context?: Record<string, any>;
}

export interface DrillAcrossReport {
  id: string;
  title: string;
  description: string;
  chartType: 'bar' | 'line' | 'table';
  data: any[];
}

interface ChartDrillDownProps {
  isOpen: boolean;
  onClose: () => void;
  drillDownData: DrillDownData | null;
  drillAcrossReports?: DrillAcrossReport[];
  detailTableData?: any[];
  detailTableColumns?: { key: string; label: string }[];
  isLoading?: boolean;
}

export function ChartDrillDown({
  isOpen,
  onClose,
  drillDownData,
  drillAcrossReports = [],
  detailTableData = [],
  detailTableColumns = [],
  isLoading = false
}: ChartDrillDownProps) {
  const { isDarkMode } = useTheme();
  const [view, setView] = useState<'table' | 'report'>('table');
  const [selectedReport, setSelectedReport] = useState<DrillAcrossReport | null>(null);

  if (!isOpen || !drillDownData) return null;

  const handleReportClick = (report: DrillAcrossReport) => {
    setSelectedReport(report);
    setView('report');
  };

  const handleBack = () => {
    if (selectedReport) {
      setSelectedReport(null);
      setView('table');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl max-h-[90vh] rounded-xl shadow-2xl border overflow-hidden bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-700">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {selectedReport && (
                <button
                  onClick={handleBack}
                  className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              )}
              <div>
                <h2 className="text-xl text-slate-900 dark:text-slate-100">
                  {selectedReport ? selectedReport.title : drillDownData.title}
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300">
                    {drillDownData.category}
                  </Badge>
                  {typeof drillDownData.value === 'number' && (
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      Value: {drillDownData.value}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800/50"
            >
              <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
          </div>
        </div>

        {/* View Toggle */}
        {!selectedReport && drillAcrossReports.length > 0 && (
          <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex gap-2 pb-3">
              <button
                onClick={() => setView('table')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  view === 'table'
                    ? isDarkMode 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'bg-purple-100 text-purple-700'
                    : isDarkMode
                      ? "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <TableIcon className="w-4 h-4" />
                Drill Down (Details)
              </button>
              <button
                onClick={() => setView('report')}
                className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-2 ${
                  view === 'report'
                    ? isDarkMode 
                      ? 'bg-purple-500/20 text-purple-300' 
                      : 'bg-purple-100 text-purple-700'
                    : isDarkMode
                      ? "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                Drill Across (Reports)
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className={`w-12 h-12 border-4 rounded-full animate-spin mx-auto mb-4 ${
                  isDarkMode ? 'border-purple-500/30 border-t-purple-500' : 'border-purple-200 border-t-purple-600'
                }`} />
                <p className="text-slate-500 dark:text-slate-400">Loading data...</p>
              </div>
            </div>
          ) : (
            <>
              {view === 'table' && !selectedReport && (
                <div className="space-y-4">
                  {/* Detail Table */}
                  {detailTableData.length > 0 && detailTableColumns.length > 0 ? (
                    <div className={`rounded-lg border overflow-hidden ${"border-slate-200 dark:border-slate-700"}`}>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className={"bg-slate-50 dark:bg-slate-800"}>
                            <tr>
                              {detailTableColumns.map((col) => (
                                <th
                                  key={col.key}
                                  className={`px-4 py-3 text-left text-xs ${
                                    "text-slate-600 dark:text-slate-400"
                                  }`}
                                >
                                  {col.label}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-[#333333]">
                            {detailTableData.map((row, idx) => (
                              <tr
                                key={idx}
                                className={"hover:bg-slate-50 dark:hover:bg-slate-800/50"}
                              >
                                {detailTableColumns.map((col) => (
                                  <td
                                    key={col.key}
                                    className={`px-4 py-3 text-sm ${
                                      "text-slate-900 dark:text-slate-100"
                                    }`}
                                  >
                                    {row[col.key]}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className={`p-8 text-center ${isDarkMode ? 'text-[#888888]' : 'text-slate-500'}`}>
                      <TableIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>No detail data available</p>
                    </div>
                  )}
                </div>
              )}

              {view === 'report' && !selectedReport && (
                <div className="grid md:grid-cols-2 gap-4">
                  {drillAcrossReports.map((report) => (
                    <Card
                      key={report.id}
                      className={`p-4 cursor-pointer transition-all hover:scale-105 border ${
                        isDarkMode 
                          ? 'bg-[#0a0a0a] border-[#333333] hover:border-purple-500/30' 
                          : 'bg-white border-slate-200 hover:border-purple-300'
                      }`}
                      onClick={() => handleReportClick(report)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className={`font-medium mb-1 ${"text-slate-900 dark:text-slate-100"}`}>
                            {report.title}
                          </h3>
                          <p className={`text-sm ${isDarkMode ? 'text-[#888888]' : 'text-slate-500'}`}>
                            {report.description}
                          </p>
                        </div>
                        <ExternalLink className={`w-4 h-4 ${isDarkMode ? 'text-purple-300' : 'text-purple-600'}`} />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {report.chartType}
                      </Badge>
                    </Card>
                  ))}
                </div>
              )}

              {selectedReport && (
                <div className="space-y-4">
                  <p className={`text-sm ${"text-slate-600 dark:text-slate-400"}`}>
                    {selectedReport.description}
                  </p>

                  {selectedReport.chartType === 'bar' && (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={selectedReport.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#333' : '#e5e7eb'} />
                          <XAxis 
                            dataKey="name" 
                            stroke={isDarkMode ? '#888' : '#64748b'}
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis 
                            stroke={isDarkMode ? '#888' : '#64748b'}
                            style={{ fontSize: '12px' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                              border: isDarkMode ? '1px solid #333' : '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Bar dataKey="value" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {selectedReport.chartType === 'line' && (
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={selectedReport.data}>
                          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? '#333' : '#e5e7eb'} />
                          <XAxis 
                            dataKey="name" 
                            stroke={isDarkMode ? '#888' : '#64748b'}
                            style={{ fontSize: '12px' }}
                          />
                          <YAxis 
                            stroke={isDarkMode ? '#888' : '#64748b'}
                            style={{ fontSize: '12px' }}
                          />
                          <Tooltip 
                            contentStyle={{
                              backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
                              border: isDarkMode ? '1px solid #333' : '1px solid #e5e7eb',
                              borderRadius: '8px'
                            }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                  {selectedReport.chartType === 'table' && (
                    <div className={`rounded-lg border overflow-hidden ${"border-slate-200 dark:border-slate-700"}`}>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className={"bg-slate-50 dark:bg-slate-800"}>
                            <tr>
                              {Object.keys(selectedReport.data[0] || {}).map((key) => (
                                <th
                                  key={key}
                                  className={`px-4 py-3 text-left text-xs ${
                                    "text-slate-600 dark:text-slate-400"
                                  }`}
                                >
                                  {key}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200 dark:divide-[#333333]">
                            {selectedReport.data.map((row, idx) => (
                              <tr
                                key={idx}
                                className={"hover:bg-slate-50 dark:hover:bg-slate-800/50"}
                              >
                                {Object.values(row).map((value: any, cellIdx) => (
                                  <td
                                    key={cellIdx}
                                    className={`px-4 py-3 text-sm ${
                                      "text-slate-900 dark:text-slate-100"
                                    }`}
                                  >
                                    {value}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${"border-slate-200 dark:border-slate-700"}`}>
          <div className="flex justify-end">
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}