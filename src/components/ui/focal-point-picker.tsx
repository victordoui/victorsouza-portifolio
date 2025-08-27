import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface FocalPointPickerProps {
  imageUrl: string;
  focalX: number;
  focalY: number;
  onFocalPointChange: (x: number, y: number) => void;
  className?: string;
}

export const FocalPointPicker = ({
  imageUrl,
  focalX,
  focalY,
  onFocalPointChange,
  className
}: FocalPointPickerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    onFocalPointChange(Math.round(Math.max(0, Math.min(100, x))), Math.round(Math.max(0, Math.min(100, y))));
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleClick(e);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    handleClick(e);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    document.addEventListener('mouseup', handleGlobalMouseUp);
    return () => document.removeEventListener('mouseup', handleGlobalMouseUp);
  }, []);

  if (!imageUrl) return null;

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-sm font-medium text-foreground">Ponto Focal da Imagem</p>
      <div
        ref={containerRef}
        className="relative w-full h-48 border border-border rounded-lg overflow-hidden cursor-crosshair select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-cover"
          draggable={false}
        />
        
        {/* Focal point indicator */}
        <div
          className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full shadow-lg transform -translate-x-2 -translate-y-2 pointer-events-none"
          style={{
            left: `${focalX}%`,
            top: `${focalY}%`,
          }}
        />
        
        {/* Crosshairs */}
        <div
          className="absolute w-full h-px bg-primary/50 pointer-events-none"
          style={{ top: `${focalY}%` }}
        />
        <div
          className="absolute h-full w-px bg-primary/50 pointer-events-none"
          style={{ left: `${focalX}%` }}
        />
      </div>
      
      <div className="text-xs text-muted-foreground">
        <p>Clique na imagem para definir o ponto focal</p>
        <p>Posição: X: {focalX}%, Y: {focalY}%</p>
      </div>
    </div>
  );
};