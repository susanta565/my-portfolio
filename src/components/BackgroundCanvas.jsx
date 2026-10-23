import React, { useEffect, useRef, useState, useCallback } from 'react';

const TOTAL_FRAMES = 333;
const LERP_FACTOR = 0.12;

// Shared cache across remounts
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
  const rafIdRef = useRef(null);

  // Find nearest loaded frame to prevent any flicker
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

  // Direct canvas drawing
  const drawImageToCanvas = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Fill canvas with deep black/amber background
    ctx.fillStyle = '#060302';
    ctx.fillRect(0, 0, width, height);

    // Cover scale calculation
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const scale = Math.max(width / imgWidth, height / imgHeight);
    const drawWidth = imgWidth * scale;
    const drawHeight = imgHeight * scale;
    const offsetX = (width - drawWidth) / 2;
    const offsetY = (height - drawHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  // Update canvas resolution on resize with mobile address-bar stabilization
  const updateCanvasDimensions = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const newWidth = Math.round(window.innerWidth * dpr);
    const newHeight = Math.round(window.innerHeight * dpr);

    const widthDiff = Math.abs((canvas.width || 0) - newWidth);
    const heightDiff = Math.abs((canvas.height || 0) - newHeight);

    // Prevent jittery canvas rebuilds when mobile browser hides/shows address bar
    if (widthDiff > 0 || heightDiff > 120 || !canvas.width) {
      canvas.width = newWidth;
      canvas.height = newHeight;
      needsRedrawRef.current = true;
    }
  }, []);

  // Progressive preloader
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

    // Preload remaining frames in background
    if (!isPreloadStarted) {
      isPreloadStarted = true;
      let currentIndex = 1;
      const CONCURRENCY = 12;

      const scheduleNext = () => {
        while (currentIndex < TOTAL_FRAMES) {
          const idx = currentIndex++;
          preloadImage(idx);
          if (idx % CONCURRENCY === 0) {
            setTimeout(scheduleNext, 25);
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

  // Scroll tracking and LERP loop across whole page
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
      const totalScrollable = Math.max(
        1,
        (document.documentElement.scrollHeight || document.body.scrollHeight) - window.innerHeight
      );

      const progress = Math.min(1, Math.max(0, scrollY / totalScrollable));
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    };

    const handleResize = () => {
      updateCanvasDimensions();
      handleScroll();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    updateCanvasDimensions();
    handleScroll();

    // 60fps/120fps LERP loop
    const renderLoop = () => {
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
      window.removeEventListener('touchmove', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [updateCanvasDimensions, getNearestLoadedImage, drawImageToCanvas]);

  return (
    <>
      {/* Background Canvas Layer */}
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
          background: 'radial-gradient(circle at 50% 50%, rgba(6,3,2,0.15) 0%, rgba(6,3,2,0.7) 80%, rgba(6,3,2,0.95) 100%)',
        }}
      />

      {/* Minimal subtle buffer indicator */}
      {!isFullyLoaded && (
        <div
          style={{
            position: 'fixed',
            top: '12px',
            right: '16px',
            fontSize: '10px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.4)',
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
