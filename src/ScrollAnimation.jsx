import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 333;
const LERP_FACTOR = 0.12; // Smooth damping speed (Apple-style inertia)

// Global image cache outside component to survive React StrictMode remounts
const imageCache = new Array(TOTAL_FRAMES);
const loadedFlags = new Uint8Array(TOTAL_FRAMES);
let isPreloadStarted = false;

function getFramePath(index) {
  const frameNum = String(index + 1).padStart(5, '0');
  return `/frames/frame_${frameNum}.jpg`;
}

export default function ScrollAnimation() {
  const canvasRef = useRef(null);
  const [loadPercent, setLoadPercent] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const lastRenderedImgRef = useRef(null);
  const needsRedrawRef = useRef(true);
  const rafIdRef = useRef(null);

  // Helper to find the closest loaded frame to avoid any blank flicker
  const getNearestLoadedImage = useCallback((targetIndex) => {
    if (loadedFlags[targetIndex] && imageCache[targetIndex]) {
      return imageCache[targetIndex];
    }
    // Search outward
    for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
      const prev = targetIndex - offset;
      if (prev >= 0 && loadedFlags[prev] && imageCache[prev]) {
        return imageCache[prev];
      }
      const next = targetIndex + offset;
      if (next < TOTAL_FRAMES && loadedFlags[next] && imageCache[next]) {
        return imageCache[next];
      }
    }
    return null;
  }, []);

  // Direct canvas drawing with object-fit cover & high DPI
  const drawImageToCanvas = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Fill canvas with deep background color
    ctx.fillStyle = '#060302';
    ctx.fillRect(0, 0, width, height);

    // Cover fit
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const scale = Math.max(width / imgWidth, height / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Handle high-DPI canvas resizing
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const newWidth = Math.round(window.innerWidth * dpr);
    const newHeight = Math.round(window.innerHeight * dpr);

    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      needsRedrawRef.current = true;
    }
  }, []);

  // Preloading system
  useEffect(() => {
    let mounted = true;

    const onSingleImageLoaded = (index) => {
      loadedFlags[index] = 1;
      needsRedrawRef.current = true;

      // Calculate total loaded count
      let count = 0;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (loadedFlags[i]) count++;
      }

      if (mounted) {
        const pct = Math.round((count / TOTAL_FRAMES) * 100);
        setLoadPercent(pct);
        if (count === TOTAL_FRAMES) {
          setIsLoaded(true);
        }
      }
    };

    const preloadImage = (index) => {
      if (imageCache[index]) {
        if (imageCache[index].complete && imageCache[index].naturalWidth > 0) {
          onSingleImageLoaded(index);
        }
        return;
      }

      const img = new Image();
      img.src = getFramePath(index);
      imageCache[index] = img;

      if (img.complete && img.naturalWidth > 0) {
        onSingleImageLoaded(index);
      } else {
        img.onload = () => onSingleImageLoaded(index);
        img.onerror = () => {
          // If error occurs, still continue
          needsRedrawRef.current = true;
        };
      }
    };

    // 1. Immediately load frame 0 for instant visual
    preloadImage(0);

    // 2. Incrementally preload all remaining frames
    if (!isPreloadStarted) {
      isPreloadStarted = true;
      let currentIndex = 1;
      const CONCURRENCY = 10;

      const scheduleNext = () => {
        while (currentIndex < TOTAL_FRAMES) {
          const idx = currentIndex++;
          preloadImage(idx);
          if (idx % CONCURRENCY === 0) {
            setTimeout(scheduleNext, 20);
            return;
          }
        }
      };

      scheduleNext();
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Scroll listener & animation loop
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const maxScroll = (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight;

      if (maxScroll > 0) {
        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
      }

      if (scrollY > 30) {
        setHasScrolled(true);
      }
    };

    const handleResize = () => {
      updateCanvasDimensions();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    
    // Initial size setup
    updateCanvasDimensions();
    handleScroll();

    // High performance render loop
    const renderLoop = () => {
      // Lerp smoothing towards target scroll position
      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.001) {
        currentFrameRef.current += diff * LERP_FACTOR;
      } else {
        currentFrameRef.current = targetFrameRef.current;
      }

      const targetIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrameRef.current))
      );

      const bestImg = getNearestLoadedImage(targetIdx);

      if (bestImg && (bestImg !== lastRenderedImgRef.current || needsRedrawRef.current)) {
        drawImageToCanvas(bestImg);
        lastRenderedImgRef.current = bestImg;
        needsRedrawRef.current = false;
      }

      rafIdRef.current = requestAnimationFrame(renderLoop);
    };

    rafIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateCanvasDimensions, getNearestLoadedImage, drawImageToCanvas]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '500vh', // Gives a comfortable 5x viewport scroll distance
        backgroundColor: '#060302',
      }}
    >
      {/* Fullscreen Sticky Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          display: 'block',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Loading Progress Indicator */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: isLoaded ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      >
        <div
          style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.65)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          Loading sequence {loadPercent}%
        </div>
        <div
          style={{
            width: '160px',
            height: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '2px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${loadPercent}%`,
              backgroundColor: '#ff6622',
              boxShadow: '0 0 8px #ff6622',
              transition: 'width 0.15s ease-out',
            }}
          />
        </div>
      </div>

      {/* Subtle Scroll Hint */}
      <div
        style={{
          position: 'fixed',
          bottom: '36px',
          right: '36px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          zIndex: 10,
          pointerEvents: 'none',
          opacity: hasScrolled ? 0 : 0.85,
          transition: 'opacity 0.5s ease',
        }}
      >
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.7)',
            fontWeight: 500,
          }}
        >
          Scroll to explore
        </span>
        <div
          style={{
            width: '22px',
            height: '36px',
            border: '2px solid rgba(255, 255, 255, 0.35)',
            borderRadius: '11px',
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '6px',
          }}
        >
          <div
            style={{
              width: '4px',
              height: '7px',
              backgroundColor: '#ff6622',
              borderRadius: '2px',
              animation: 'scrollBob 1.6s ease-in-out infinite',
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes scrollBob {
          0% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.2; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
