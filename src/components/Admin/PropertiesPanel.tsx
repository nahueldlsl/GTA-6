import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import type { StoryNode } from '../../types/game';
import { Save, Trash } from 'lucide-react';

export const PropertiesPanel: React.FC<{ node: StoryNode }> = ({ node }) => {
  const saveNode = useEditorStore((s) => s.saveNode);
  const deleteNode = useEditorStore((s) => s.deleteNode);
  const isCustom = !!useEditorStore((s) => s.customNodes[node.id]);

  const [formData, setFormData] = useState<StoryNode>(node);

  // Sync when selecting a different node
  useEffect(() => {
    setFormData(node);
  }, [node]);

  const handleChange = (field: keyof StoryNode, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleVideoChange = (field: keyof StoryNode['video'], value: any) => {
    setFormData((prev) => ({
      ...prev,
      video: { ...prev.video, [field]: value }
    }));
  };

  const handleSave = () => {
    saveNode(formData);
  };

  const handleDeleteCustom = () => {
    if (isCustom && window.confirm("Are you sure you want to revert this node to its original state?")) {
      deleteNode(node.id);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-4 text-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Edit Node</h2>
        {isCustom && <span className="bg-blue-600 px-2 py-0.5 rounded text-xs">Customized</span>}
      </div>

      <div>
        <label className="block text-gray-400 mb-1">Node ID</label>
        <input 
          type="text" 
          value={formData.id} 
          disabled
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 opacity-70"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-1">Chapter Title</label>
        <input 
          type="text" 
          value={formData.chapterTitle} 
          onChange={(e) => handleChange('chapterTitle', e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-1">Act Title</label>
        <input 
          type="text" 
          value={formData.actTitle} 
          onChange={(e) => handleChange('actTitle', e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1"
        />
      </div>

      <div>
        <label className="block text-gray-400 mb-1">Location</label>
        <input 
          type="text" 
          value={formData.location} 
          onChange={(e) => handleChange('location', e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1"
        />
      </div>

      <div className="border-t border-gray-700 pt-4 mt-2">
        <h3 className="font-semibold text-gray-300 mb-2">Video Asset</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-gray-400 mb-1">Theme / URL</label>
            <input 
              type="text" 
              value={formData.video.url} 
              onChange={(e) => handleVideoChange('url', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1"
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-1">Subtitle</label>
            <textarea 
              value={formData.video.dialogueSubtitle || ''} 
              onChange={(e) => handleVideoChange('dialogueSubtitle', e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded px-2 py-1 h-20"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 pt-4 mt-2">
        <h3 className="font-semibold text-gray-300 mb-2">Choices</h3>
        <div className="flex flex-col gap-3">
          {formData.choices?.map((choice, index) => (
            <div key={choice.id || index} className="p-2 bg-gray-800 border border-gray-700 rounded relative">
              <button 
                onClick={() => setFormData(prev => ({ ...prev, choices: prev.choices?.filter((_, i) => i !== index) }))}
                className="absolute top-2 right-2 text-red-500 hover:text-red-400"
                title="Remove choice"
              >
                <Trash size={14} />
              </button>
              <label className="block text-xs text-gray-400 mb-1">Label</label>
              <input 
                type="text" 
                value={choice.label}
                onChange={(e) => {
                  const newChoices = [...(formData.choices || [])];
                  newChoices[index] = { ...choice, label: e.target.value };
                  setFormData(prev => ({ ...prev, choices: newChoices }));
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 mb-2 text-xs"
              />
              <label className="block text-xs text-gray-400 mb-1">Target Node ID</label>
              <input 
                type="text" 
                value={choice.targetNodeId}
                onChange={(e) => {
                  const newChoices = [...(formData.choices || [])];
                  newChoices[index] = { ...choice, targetNodeId: e.target.value };
                  setFormData(prev => ({ ...prev, choices: newChoices }));
                }}
                className="w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs"
              />
            </div>
          ))}
          <button 
            onClick={() => setFormData(prev => ({
              ...prev,
              choices: [...(prev.choices || []), { id: `choice_${Date.now()}`, label: 'Nueva Opción', targetNodeId: '', dangerLevel: 'LOW' }]
            }))}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-1 rounded text-xs"
          >
            + Add Choice
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-4 border-t border-gray-700">
        <button 
          onClick={handleSave}
          className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded flex items-center justify-center gap-2"
        >
          <Save size={16} /> Save Node
        </button>
        {isCustom && (
          <button 
            onClick={handleDeleteCustom}
            title="Revert to original"
            className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded flex items-center justify-center"
          >
            <Trash size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
