import { useState } from "react";
import { WORKFLOW_TEMPLATES } from "../templates/templateTypes";
import type { WorkflowTemplate } from "../templates/templateTypes";

interface TemplateSelectorProps {
  onSelectTemplate: (template: WorkflowTemplate) => void;
  onClose: () => void;
}

export function TemplateSelector({
  onSelectTemplate,
  onClose,
}: TemplateSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    ...Array.from(new Set(WORKFLOW_TEMPLATES.map((t) => t.category))),
  ];

  const filteredTemplates =
    selectedCategory === "All"
      ? WORKFLOW_TEMPLATES
      : WORKFLOW_TEMPLATES.filter((t) => t.category === selectedCategory);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-2xl p-6 max-w-4xl w-full max-h-[80vh] overflow-auto border border-gray-700 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h2 className="text-2xl font-bold text-white">
                Workflow Templates
              </h2>
              <p className="text-sm text-gray-400">
                Start with a pre-built workflow
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-3xl font-light transition-colors hover:rotate-90 duration-300"
            aria-label="Close"
            title="Close (Esc)"
          >
            ×
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTemplates.map((template, idx) => (
            <div
              key={template.id}
              className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg p-5 hover:from-gray-650 hover:to-gray-750 transition-all duration-200 cursor-pointer border-2 border-gray-600 hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${idx * 50}ms` }}
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {template.name}
                </h3>
                <span className="text-xs px-2.5 py-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-medium shadow-sm">
                  {template.category}
                </span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {template.description}
              </p>
              <div className="mt-3 pt-3 border-t border-gray-600 flex items-center justify-between">
                <span className="text-xs text-gray-400">Click to load</span>
                <span className="text-blue-400 text-sm">→</span>
              </div>
            </div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            No templates found in this category
          </div>
        )}
      </div>
    </div>
  );
}
