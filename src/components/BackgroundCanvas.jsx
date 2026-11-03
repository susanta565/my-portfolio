import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 333;
const LERP_FACTOR = 0.12;

// Shared cache across component remounts
const imageCache = new Array(TOTAL_FRAMES);
const loadedFlags = new Uint8Array(TOTAL_FRAMES);
let isPreloadStarted = false;

function getFramePath(index) {
  const frameNum = String(index + 1).padStart(5, '0');
  return `/frames/frame_${frameNum}.jpg`;
}

export default function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const [loadPercent, setLoadPercent] = useState(0);
  const [isFullyLoaded, setIsFullyLoaded] = useState(false);

  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const lastRenderedImgRef = useRef(null);
  const needsRedrawRef = useRef(true);
  const isLoopRunningRef = useRef(false);
  const rafIdRef = useRef(null);

  // Find nearest loaded frame to prevent any flicker during scroll
  const getNearestLoadedImage = useCallback((targetIndex) => {
    if (loadedFlags[targetIndex] && imageCache[targetIndex]) {
      return imageCache[targetIndex];
    }
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

  // Direct, low-latency canvas drawing with hardware acceleration
  const drawImageToCanvas = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Fill canvas background
    ctx.fillStyle = '#060302';
    ctx.fillRect(0, 0, width, height);

    // Fast image smoothing configuration
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = window.innerWidth < 768 ? 'low' : 'medium';

    // Cover scale calculation
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const scale = Math.max(width / imgWidth, height / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const offsetX = (width - drawWidth) * 0.5;
    const offsetY = (height - drawHeight) * 0.5;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Update canvas resolution with mobile-optimized DPR and address-bar stabilization
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const isMobile = window.innerWidth <= 768;
    const dpr = isMobile
      ? Math.min(window.devicePixelRatio || 1, 1.25)
      : Math.min(window.devicePixelRatio || 1, 1.75);

    const newWidth = Math.round(window.innerWidth * dpr);
    const newHeight = Math.round(window.innerHeight * dpr);

    const widthDiff = Math.abs((canvas.width || 0) - newWidth);
    const heightDiff = Math.abs((canvas.height || 0) - newHeight);

    // Prevent jittery canvas rebuilds when mobile browser address bar shows/hides
    if (widthDiff > 0 || heightDiff > 100 || !canvas.width) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      needsRedrawRef.current = true;
    }
  }, []);

  // Progressive background preloader
  useEffect(() => {
    let mounted = true;

    const onSingleImageLoaded = (index) => {
      loadedFlags[index] = 1;
      needsRedrawRef.current = true;

      let count = 0;
      for (let i = 0; i < TOTAL_FRAMES; i++) {
        if (loadedFlags[i]) count++;
      }

      if (mounted) {
        const pct = Math.round((count / TOTAL_FRAMES) * 100);
        setLoadPercent(pct);
        if (count === TOTAL_FRAMES) {
          setIsFullyLoaded(true);
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
          needsRedrawRef.current = true;
        };
      }
    };

    // Load initial frame instantly
    preloadImage(0);

    // Concurrently buffer remainder in small chunks to avoid network congestion
    if (!isPreloadStarted) {
      isPreloadStarted = true;
      let currentIndex = 1;
      const BATCH_SIZE = 8;

      const scheduleNext = () => {
        let loadedInBatch = 0;
        while (currentIndex < TOTAL_FRAMES && loadedInBatch < BATCH_SIZE) {
          preloadImage(currentIndex++);
          loadedInBatch++;
        }
        if (currentIndex < TOTAL_FRAMES) {
          setTimeout(scheduleNext, 35);
        }
      };

      scheduleNext();
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Performance-optimized LERP loop that sleeps when idle
  useEffect(() => {
    const wakeUpRenderLoop = () => {
      if (isLoopRunningRef.current) return;
      isLoopRunningRef.current = true;

      const renderStep = () => {
        const diff = targetFrameRef.current - currentFrameRef.current;

        // Smooth convergence
        if (Math.abs(diff) > 0.005) {
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

        // Keep loop alive while moving or needing redraw; stop when settled
        if (Math.abs(diff) > 0.005 || needsRedrawRef.current) {
          rafIdRef.current = requestAnimationFrame(renderStep);
        } else {
          isLoopRunningRef.current = false;
        }
      };

      rafIdRef.current = requestAnimationFrame(renderStep);
    };

    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const totalScrollable = Math.max(
        1,
        (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight
      );

      const progress = Math.min(1, Math.max(0, scrollY / totalScrollable));
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);

      wakeUpRenderLoop();
    };

    const handleResize = () => {
      updateCanvasDimensions();
      handleScroll();
      wakeUpRenderLoop();
    };

    // Passive listeners for native 60fps/120fps touch & mouse wheel scrolling
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    updateCanvasDimensions();
    handleScroll();
    wakeUpRenderLoop();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      isLoopRunningRef.current = false;
    };
  }, [updateCanvasDimensions, getNearestLoadedImage, drawImageToCanvas]);

  return (
    <>
      {/* 3D Hardware-Accelerated Background Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          minHeight: '100vh',
          display: 'block',
          pointerEvents: 'none',
          zIndex: 0,
          transform: 'translate3d(0, 0, 0)',
          willChange: 'contents',
        }}
      />

      {/* Cinematic Vignette Overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          minHeight: '100vh',
          pointerEvents: 'none',
          zIndex: 1,
          transform: 'translate3d(0, 0, 0)',
          background:
            'radial-gradient(circle at 50% 50%, rgba(6,3,2,0.15) 0%, rgba(6,3,2,0.7) 80%, rgba(6,3,2,0.95) 100%)',
        }}
      />

      {/* Subtle buffer indicator */}
      {!isFullyLoaded && (
        <div
          style={{
            position: 'fixed',
            top: '12px',
            right: '16px',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.45)',
            zIndex: 99,
            pointerEvents: 'none',
            fontVariantNumeric: 'tabular-nums',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#e51c23',
              boxShadow: '0 0 6px #e51c23',
            }}
          />
          Syncing {loadPercent}%
        </div>
      )}
    </>
  );
}
