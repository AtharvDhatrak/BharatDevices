import React, { useState } from 'react';

export default function StackedGlass() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  // Stack definition following the turquoise-to-periwinkle color flow in your uploaded images
  const layers = [
    {
      id: 1,
      spinMultiplierZ: -180,
      spinMultiplierX: 90,
      zOffset: -24,
      xOffset: -22,
      yOffset: 22,
      bg: 'linear-gradient(180deg, #00d2ff 0%, #005bea 100%)',
      opacity: 1
    },
    {
      id: 2,
      spinMultiplierZ: -120,
      spinMultiplierX: 60,
      zOffset: -12,
      xOffset: -11,
      yOffset: 11,
      bg: 'linear-gradient(180deg, rgba(0, 198, 255, 0.85) 0%, rgba(0, 114, 255, 0.85) 100%)',
      opacity: 0.9
    },
    {
      id: 3,
      spinMultiplierZ: 120,
      spinMultiplierX: -60,
      zOffset: 0,
      xOffset: 0,
      yOffset: 0,
      bg: 'linear-gradient(180deg, rgba(161, 196, 253, 0.7) 0%, rgba(194, 233, 251, 0.7) 100%)',
      opacity: 0.85
    },
    {
      id: 4,
      spinMultiplierZ: 180,
      spinMultiplierX: -90,
      zOffset: 12,
      xOffset: 11,
      yOffset: -11,
      bg: 'linear-gradient(180deg, rgba(224, 231, 255, 0.75) 0%, rgba(203, 213, 225, 0.5) 100%)',
      opacity: 0.95
    }
  ];

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: '110px',
        height: '130px',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '500px',
        cursor: 'pointer'
      }}
    >
      {/* SVG Liquid Refraction Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
        <defs>
          <filter id="water-refraction">
            <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      <div
        style={{
          position: 'relative',
          width: '62px',
          height: '100px',
          transformStyle: 'preserve-3d'
        }}
      >
        {layers.map((layer) => {
          const currentRotateZ = mousePos.x * layer.spinMultiplierZ;
          const currentRotateX = -mousePos.y * layer.spinMultiplierX;

          return (
            <div
              key={layer.id}
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '26px',
                background: layer.bg,
                opacity: layer.opacity,
                filter: 'url(#water-refraction)',
                backdropFilter: 'blur(8px) contrast(110%)',
                WebkitBackdropFilter: 'blur(8px) contrast(110%)',
                border: '1px solid rgba(255, 255, 255, 0.65)',
                boxShadow: `
                  inset 0 2px 4px rgba(255, 255, 255, 0.8),
                  inset 0 -2px 4px rgba(0, 0, 0, 0.15),
                  0 8px 16px rgba(0, 0, 0, 0.1)
                `,
                transformOrigin: 'center center',
                transform: `
                  translateX(${layer.xOffset}px)
                  translateY(${layer.yOffset}px) 
                  translateZ(${layer.zOffset}px) 
                  rotateX(${currentRotateX}deg) 
                  rotateZ(${currentRotateZ}deg)
                `,
                transition: 'transform 0.15s ease-out',
                backfaceVisibility: 'visible'
              }}
            >
              {/* Highlight Bevel Edge for Liquid Thickness */}
              <div
                style={{
                  position: 'absolute',
                  inset: '2px',
                  borderRadius: '24px',
                  borderTop: '2px solid rgba(255, 255, 255, 0.9)',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.5)',
                  borderRight: '1px solid transparent',
                  borderBottom: '1px solid transparent',
                  pointerEvents: 'none'
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}