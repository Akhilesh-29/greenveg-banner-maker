import React, { useRef, useState, useEffect } from 'react';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { SingleProductLayout } from './SingleProductLayout';
import { MultiProductLayout } from './MultiProductLayout';

export const BannerCanvas = ({
  mode = 'single',
  singleProduct,
  multiItems,
  template,
  size,
  shopProfile,
  language = 'en',
  currency = '₹',
  fontClass = 'font-outfit',
  showDateStamp = true,
  dateStampText = '',
  boardTitle = '',
  exportRef
}) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.4);
  const [zoomLevel, setZoomLevel] = useState(1); // multiplier on top of auto-fit

  // ResizeObserver for reliable fit-to-screen scale
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const padding = 32;
      const availableW = Math.max(200, rect.width - padding);
      const availableH = Math.max(200, rect.height - padding);

      const scaleW = availableW / size.width;
      const scaleH = availableH / size.height;
      
      const baseFit = Math.min(scaleW, scaleH);
      setScale(baseFit > 0 ? baseFit : 0.4);
    };

    updateScale();

    let resizeObserver = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateScale();
      });
      resizeObserver.observe(containerRef.current);
    }

    window.addEventListener('resize', updateScale);
    return () => {
      window.removeEventListener('resize', updateScale);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [size.width, size.height]);

  const effectiveScale = scale * zoomLevel;

  return (
    <div className="flex flex-col h-full w-full select-none">
      {/* Top Bar for Canvas Info & Zoom */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-xs font-semibold text-slate-600 dark:text-slate-300 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold">
            {size.name}
          </span>
          <span className="text-slate-400 hidden sm:inline">
            {size.width} × {size.height} px ({size.aspect})
          </span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.max(0.4, Number((prev - 0.1).toFixed(2))))}
            className="p-1 hover:text-emerald-600 transition cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-10 text-center font-mono text-[11px]">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            type="button"
            onClick={() => setZoomLevel((prev) => Math.min(2.5, Number((prev + 0.1).toFixed(2))))}
            className="p-1 hover:text-emerald-600 transition cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel(1)}
            className="p-1 hover:text-emerald-600 transition border-l border-slate-200 dark:border-slate-700 ml-1 pl-1.5 cursor-pointer"
            title="Reset to Fit Screen"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Canvas Scroll Area */}
      <div
        ref={containerRef}
        className="flex-1 w-full relative overflow-auto p-4 flex items-center justify-center bg-slate-100/90 dark:bg-slate-950/90"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(148, 163, 184, 0.25) 1.5px, transparent 1.5px)',
          backgroundSize: '18px 18px'
        }}
      >
        {/* Sized wrapper to reserve space for scaled element */}
        <div
          style={{
            width: `${size.width * effectiveScale}px`,
            height: `${size.height * effectiveScale}px`,
            position: 'relative',
            margin: 'auto'
          }}
          className="transition-[width,height] duration-150 shrink-0"
        >
          {/* THE ACTUAL RENDER ELEMENT EXPORTED TO IMAGE */}
          <div
            ref={exportRef}
            id="banner-capture-node"
            style={{
              width: `${size.width}px`,
              height: `${size.height}px`,
              transform: `scale(${effectiveScale})`,
              transformOrigin: 'top left',
              position: 'absolute',
              top: 0,
              left: 0
            }}
            className="shadow-2xl rounded-3xl overflow-hidden ring-1 ring-black/10"
          >
            {mode === 'single' ? (
              <SingleProductLayout
                product={singleProduct}
                template={template}
                shopProfile={shopProfile}
                language={language}
                currency={currency}
                aspectRatio={size.aspect}
                fontClass={fontClass}
                showDateStamp={showDateStamp}
                dateStampText={dateStampText}
              />
            ) : (
              <MultiProductLayout
                items={multiItems}
                template={template}
                shopProfile={shopProfile}
                language={language}
                currency={currency}
                aspectRatio={size.aspect}
                fontClass={fontClass}
                showDateStamp={showDateStamp}
                dateStampText={dateStampText}
                boardTitle={boardTitle}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
