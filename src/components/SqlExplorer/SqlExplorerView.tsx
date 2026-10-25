import React, { useState } from 'react';
import {
  Database,
  GitBranch,
  Terminal,
  Layers,
  Repeat,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { SchemaExplorer } from './SchemaExplorer';
import { ErDiagram } from './ErDiagram';
import { SqlPlayground } from './SqlPlayground';
import { VisualLearningMode } from './VisualLearningMode';
import { CrudDemo } from './CrudDemo';
import { TransactionDemo } from './TransactionDemo';
import { QueryOptimization } from './QueryOptimization';

export const SqlExplorerView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<
    'schema' | 'er-diagram' | 'playground' | 'visual' | 'crud' | 'transaction' | 'optimization'
  >('schema');

  const subTabs = [
    { id: 'schema', label: '1. Schema Catalog', icon: Database },
    { id: 'er-diagram', label: '2. ER Diagram', icon: GitBranch },
    { id: 'playground', label: '3. Query Playground', icon: Terminal },
    { id: 'visual', label: '4. Visual Learning Pipeline', icon: Layers },
    { id: 'crud', label: '5. CRUD Demos', icon: Repeat },
    { id: 'transaction', label: '6. ACID Transactions', icon: ShieldCheck },
    { id: 'optimization', label: '7. MySQL EXPLAIN', icon: Cpu },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Explorer Sub Navigation */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 overflow-x-auto select-none">
        {subTabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic Tab Body */}
      {activeSubTab === 'schema' && <SchemaExplorer />}
      {activeSubTab === 'er-diagram' && <ErDiagram />}
      {activeSubTab === 'playground' && <SqlPlayground />}
      {activeSubTab === 'visual' && <VisualLearningMode />}
      {activeSubTab === 'crud' && <CrudDemo />}
      {activeSubTab === 'transaction' && <TransactionDemo />}
      {activeSubTab === 'optimization' && <QueryOptimization />}
    </div>
  );
};
