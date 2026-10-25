import React, { useState } from 'react';
import { ARENA_X_SCHEMA } from '../../utils/sqlEngine';
import { Key, Link2, Info } from 'lucide-react';

interface EntityNode {
  name: string;
  category: string;
  x: number;
  y: number;
  width: number;
  height: number;
  pk: string;
  fks: { col: string; refTable: string; refCol: string }[];
}

export const ErDiagram: React.FC = () => {
  const [hoveredTable, setHoveredTable] = useState<string | null>(null);

  // Position 11 tables logically across 4 rows
  const nodeLayouts: Record<string, { x: number; y: number }> = {
    users: { x: 50, y: 50 },
    players: { x: 380, y: 50 },
    teams: { x: 720, y: 50 },
    team_members: { x: 550, y: 240 },
    venues: { x: 1040, y: 50 },
    tournaments: { x: 380, y: 380 },
    registrations: { x: 720, y: 380 },
    matches: { x: 550, y: 560 },
    match_scores: { x: 920, y: 560 },
    player_statistics: { x: 180, y: 560 },
    audit_logs: { x: 50, y: 240 }
  };

  const nodes: EntityNode[] = ARENA_X_SCHEMA.map(t => {
    const layout = nodeLayouts[t.tableName] || { x: 100, y: 100 };
    const fks: { col: string; refTable: string; refCol: string }[] = [];

    t.columns.forEach(c => {
      if (c.isForeign && c.references) {
        const parts = c.references.split('(');
        const refTable = parts[0];
        const refCol = parts[1]?.replace(')', '') || 'id';
        fks.push({ col: c.name, refTable, refCol });
      }
    });

    return {
      name: t.tableName,
      category: t.category,
      x: layout.x,
      y: layout.y,
      width: 220,
      height: 130,
      pk: t.primaryKey,
      fks
    };
  });

  return (
    <div className="space-y-4">
      {/* Legend & Info Banner */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Info className="w-4 h-4 text-emerald-400" />
          <span>Interactive ER Diagram: Generated directly from MySQL Schema constraints and foreign keys.</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-medium text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Primary Key (1)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Foreign Key (N)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 bg-emerald-400" /> Active Relationship
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="p-4 rounded-2xl bg-[#070B14] border border-slate-800/80 overflow-x-auto">
        <svg
          viewBox="0 0 1320 740"
          className="w-full min-w-[1000px] h-auto select-none font-sans"
        >
          <defs>
            <marker
              id="arrow-emerald"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#10B981" />
            </marker>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="6"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#334155" />
            </marker>
          </defs>

          {/* Connectors / Edges */}
          {nodes.map(sourceNode => {
            return sourceNode.fks.map(fk => {
              const targetNode = nodes.find(n => n.name === fk.refTable);
              if (!targetNode) return null;

              const isHighlighted =
                hoveredTable === sourceNode.name || hoveredTable === targetNode.name;

              const startX = sourceNode.x + sourceNode.width / 2;
              const startY = sourceNode.y + sourceNode.height / 2;
              const endX = targetNode.x + targetNode.width / 2;
              const endY = targetNode.y + targetNode.height / 2;

              // Cubic Bezier curve
              const dx = (endX - startX) * 0.4;
              const dy = (endY - startY) * 0.4;
              const pathData = `M ${startX} ${startY} C ${startX + dx} ${startY}, ${endX - dx} ${endY}, ${endX} ${endY}`;

              return (
                <g key={`${sourceNode.name}-${fk.col}-${targetNode.name}`}>
                  <path
                    d={pathData}
                    fill="none"
                    stroke={isHighlighted ? '#10B981' : '#1E293B'}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeDasharray={isHighlighted ? 'none' : '4 3'}
                    markerEnd={isHighlighted ? 'url(#arrow-emerald)' : 'url(#arrow-default)'}
                    className="transition-all duration-300"
                  />
                </g>
              );
            });
          })}

          {/* Entity Table Nodes */}
          {nodes.map(node => {
            const isHovered = hoveredTable === node.name;
            return (
              <g
                key={node.name}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredTable(node.name)}
                onMouseLeave={() => setHoveredTable(null)}
                className="cursor-pointer group"
              >
                {/* Background Box */}
                <rect
                  width={node.width}
                  height={node.height}
                  rx={10}
                  fill={isHovered ? '#0B132B' : '#0F172A'}
                  stroke={isHovered ? '#10B981' : '#1E293B'}
                  strokeWidth={isHovered ? 2 : 1}
                  className="transition-all duration-200"
                />

                {/* Table Header Bar */}
                <rect
                  width={node.width}
                  height={32}
                  rx={10}
                  fill={isHovered ? '#064E3B' : '#111827'}
                />
                <rect
                  y={22}
                  width={node.width}
                  height={10}
                  fill={isHovered ? '#064E3B' : '#111827'}
                />

                {/* Title */}
                <text
                  x={12}
                  y={21}
                  fill={isHovered ? '#A7F3D0' : '#F1F5F9'}
                  fontSize={12}
                  fontWeight="bold"
                  fontFamily="'JetBrains Mono', monospace"
                >
                  {node.name}
                </text>

                {/* Primary Key Line */}
                <g transform="translate(12, 54)">
                  <circle cx={4} cy={-4} r={3} fill="#F59E0B" />
                  <text
                    x={14}
                    y={0}
                    fill="#F59E0B"
                    fontSize={10}
                    fontWeight="bold"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    PK: {node.pk} (INT)
                  </text>
                </g>

                {/* Foreign Keys List */}
                {node.fks.slice(0, 3).map((fk, idx) => (
                  <g key={fk.col} transform={`translate(12, ${74 + idx * 18})`}>
                    <circle cx={4} cy={-4} r={3} fill="#C084FC" />
                    <text
                      x={14}
                      y={0}
                      fill="#94A3B8"
                      fontSize={10}
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      FK: {fk.col} → {fk.refTable}
                    </text>
                  </g>
                ))}

                {node.fks.length > 3 && (
                  <text
                    x={26}
                    y={120}
                    fill="#64748B"
                    fontSize={9}
                    fontStyle="italic"
                  >
                    +{node.fks.length - 3} more references...
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
