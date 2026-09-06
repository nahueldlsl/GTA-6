import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  BackgroundVariant,
  Panel
} from '@xyflow/react';
import type { Node, Edge, NodeChange } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useEditorStore } from '../../store/editorStore';
import { STORY_NODES } from '../../data/storyGraph';
import { PropertiesPanel } from './PropertiesPanel';
import { X, Download, Save, Plus } from 'lucide-react';
import type { StoryNode } from '../../types/game';

// Custom node type to show more info if needed, but default is fine for now

export const StoryEditor: React.FC = () => {
  const toggleEditor = useEditorStore((s) => s.toggleEditor);
  const customNodesData = useEditorStore((s) => s.customNodes);
  const mergedNodes = useMemo(() => ({ ...STORY_NODES, ...customNodesData }), [customNodesData]);
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Convert our story nodes to React Flow format
  const generateGraph = useCallback(() => {
    const rNodes: Node[] = [];
    const rEdges: Edge[] = [];
    const actXCounters: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };

    Object.values(mergedNodes).forEach((node) => {
      const act = node.act || 1;
      const xPos = (actXCounters[act] || 0) * 250;
      actXCounters[act] = (actXCounters[act] || 0) + 1;
      const yPos = act * 200;

      rNodes.push({
        id: node.id,
        position: { x: xPos, y: yPos },
        data: { label: `${node.id}\n(${node.chapterTitle})`, node },
        type: 'default',
        style: { 
          background: customNodesData[node.id] ? '#3b82f6' : '#1f2937', 
          color: 'white',
          border: '1px solid #4b5563',
          borderRadius: '8px'
        }
      });

      node.choices?.forEach((choice, index) => {
        if (mergedNodes[choice.targetNodeId]) {
          rEdges.push({
            id: `e-${node.id}-${choice.targetNodeId}-${choice.id || index}`,
            source: node.id,
            target: choice.targetNodeId,
            label: choice.label,
            animated: choice.dangerLevel === 'FATAL' || choice.dangerLevel === 'EXTREME',
            style: { stroke: '#9ca3af' }
          });
        }
      });
      
      if (node.autoTransitionNodeId && mergedNodes[node.autoTransitionNodeId]) {
        rEdges.push({
          id: `e-${node.id}-auto-${node.autoTransitionNodeId}`,
          source: node.id,
          target: node.autoTransitionNodeId,
          label: 'AUTO',
          animated: true,
          style: { stroke: '#fbbf24' }
        });
      }
    });

    return { rNodes, rEdges };
  }, [mergedNodes, customNodesData]);

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Sync state when data changes
  React.useEffect(() => {
    const { rNodes, rEdges } = generateGraph();
    setNodes(rNodes);
    setEdges(rEdges);
  }, [generateGraph]);

  const onNodesChange = useCallback(
    (changes: NodeChange<Node>[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  };

  const handleCreateNode = () => {
    const newId = `node_custom_${Date.now()}`;
    const newNode: StoryNode = {
      id: newId,
      act: 1,
      actTitle: 'Acto Custom',
      chapterTitle: 'Nuevo Nodo',
      location: 'Vice City',
      video: {
        id: `vid_${Date.now()}`,
        title: 'Video',
        url: 'theme_placeholder',
        durationSec: 5,
        themeStyle: 'sunset_drive'
      },
      choices: []
    };
    useEditorStore.getState().saveNode(newNode);
    setSelectedNodeId(newId);
  };

  const onConnect = useCallback((connection: any) => {
    const sourceNode = mergedNodes[connection.source];
    if (sourceNode) {
      const newChoice = {
        id: `choice_${Date.now()}`,
        label: `Ir a ${connection.target}`,
        targetNodeId: connection.target,
        dangerLevel: 'LOW' as const
      };
      const updatedNode = {
        ...sourceNode,
        choices: [...(sourceNode.choices || []), newChoice]
      };
      useEditorStore.getState().saveNode(updatedNode);
    }
  }, [mergedNodes]);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customNodesData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "story_custom_nodes.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const selectedNode = selectedNodeId ? mergedNodes[selectedNodeId] : null;

  return (
    <div className="absolute inset-0 z-[9999] bg-black text-white flex">
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onNodeClick={onNodeClick}
          onConnect={onConnect}
          fitView
          theme="dark"
        >
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Controls />
          <Panel position="top-right" className="flex gap-2">
            <button onClick={handleCreateNode} className="bg-green-600 px-3 py-1 rounded flex items-center gap-1 hover:bg-green-500">
              <Plus size={16} /> New Node
            </button>
            <button onClick={handleExport} className="bg-blue-600 px-3 py-1 rounded flex items-center gap-1 hover:bg-blue-500">
              <Download size={16} /> Export Custom
            </button>
            <button onClick={toggleEditor} className="bg-red-600 px-3 py-1 rounded flex items-center gap-1 hover:bg-red-500">
              <X size={16} /> Close
            </button>
          </Panel>
        </ReactFlow>
      </div>

      <div className="w-[400px] border-l border-gray-700 bg-gray-900 overflow-y-auto">
        {selectedNode ? (
          <PropertiesPanel node={selectedNode} />
        ) : (
          <div className="p-8 text-gray-400 text-center">
            Select a node to edit its properties.
          </div>
        )}
      </div>
    </div>
  );
};
