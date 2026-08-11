import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

interface SortableItemProps {
  id: string;
  file: File;
  onRemove: (id: string) => void;
}

export function SortableItem({ id, file, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-4 mb-2 bg-white border rounded shadow-sm ${
        isDragging ? 'opacity-50 border-blue-500' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="w-5 h-5" />
        </button>
        <span className="truncate max-w-[200px] sm:max-w-[300px] font-medium text-gray-700">
          {file.name}
        </span>
        <span className="text-xs text-gray-500 shrink-0">
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </span>
      </div>
      <button
        onClick={() => onRemove(id)}
        className="text-gray-400 hover:text-red-500 p-1"
        aria-label="Remove file"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
