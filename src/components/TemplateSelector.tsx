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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Workflow Templates</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            aria-label="Close"
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
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-gray-700 rounded-lg p-4 hover:bg-gray-650 transition-colors cursor-pointer border-2 border-transparent hover:border-blue-500"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">
                  {template.name}
                </h3>
                <span className="text-xs px-2 py-1 bg-blue-600 text-white rounded">
                  {template.category}
                </span>
              </div>
              <p className="text-gray-300 text-sm">{template.description}</p>
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
