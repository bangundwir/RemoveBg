import React from 'react';
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ColorPickerProps {
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ onChange }) => {
  const colors = [
    '#111827', // Dark gray
    '#1F2937', // Slightly lighter gray
    '#374151', // Medium gray
    '#4B5563', // Light gray
    '#6B7280', // Very light gray
    '#000000', // Black
    '#18181B', // Dark slate
    '#3F3F46', // Medium slate
    '#52525B', // Light slate
    '#71717A', // Very light slate
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Change Background</Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid grid-cols-5 gap-2">
          {colors.map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500"
              style={{ backgroundColor: color }}
              onClick={() => onChange(color)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ColorPicker;