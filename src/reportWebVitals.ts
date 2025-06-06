// reportWebVitals.ts
interface Metric {
  name: string;
  value: number;
  delta: number;
  entries: PerformanceEntry[];
  id: string;
  navigationType: string;
}

type ReportHandler = (metric: Metric) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    import('web-vitals')
      .then((webVitals) => {
        // Type the webVitals as any to avoid TypeScript issues with dynamic imports
        const vitals = webVitals as Record<string, unknown>;

        // Try different possible function names based on web-vitals version
        const clsFunc = vitals.getCLS || vitals.onCLS;
        const fidFunc = vitals.getFID || vitals.onFID;
        const fcpFunc = vitals.getFCP || vitals.onFCP;
        const lcpFunc = vitals.getLCP || vitals.onLCP;
        const ttfbFunc = vitals.getTTFB || vitals.onTTFB;

        if (typeof clsFunc === 'function')
          (clsFunc as (cb: ReportHandler) => void)(onPerfEntry);
        if (typeof fidFunc === 'function')
          (fidFunc as (cb: ReportHandler) => void)(onPerfEntry);
        if (typeof fcpFunc === 'function')
          (fcpFunc as (cb: ReportHandler) => void)(onPerfEntry);
        if (typeof lcpFunc === 'function')
          (lcpFunc as (cb: ReportHandler) => void)(onPerfEntry);
        if (typeof ttfbFunc === 'function')
          (ttfbFunc as (cb: ReportHandler) => void)(onPerfEntry);
      })
      .catch(() => {
        // Fallback if web-vitals is not available
        console.warn(
          'web-vitals library not found. Install it with: npm install web-vitals'
        );
        console.log('Using native implementation instead...');
        reportWebVitalsNative(onPerfEntry);
      });
  }
};

export default reportWebVitals;

// Alternative implementation without web-vitals library (using native Performance API)
export const reportWebVitalsNative = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && typeof onPerfEntry === 'function') {
    // Performance Observer for measuring various metrics
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          onPerfEntry({
            name: 'LCP',
            value: lastEntry.startTime,
            delta: lastEntry.startTime,
            entries: [lastEntry],
            id: 'lcp-' + Date.now(),
            navigationType: 'navigate',
          });
        }
      });

      try {
        lcpObserver.observe({
          type: 'largest-contentful-paint',
          buffered: true,
        });
      } catch {
        // Browser doesn't support this metric
      }

      // First Input Delay (FID)
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const fidEntry = entry as PerformanceEventTiming;
          if (fidEntry.processingStart) {
            onPerfEntry({
              name: 'FID',
              value: fidEntry.processingStart - fidEntry.startTime,
              delta: fidEntry.processingStart - fidEntry.startTime,
              entries: [entry],
              id: 'fid-' + Date.now(),
              navigationType: 'navigate',
            });
          }
        });
      });

      try {
        fidObserver.observe({ type: 'first-input', buffered: true });
      } catch {
        // Browser doesn't support this metric
      }

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          const layoutShiftEntry = entry as LayoutShift;
          if (!layoutShiftEntry.hadRecentInput) {
            clsValue += layoutShiftEntry.value;
          }
        });
        onPerfEntry({
          name: 'CLS',
          value: clsValue,
          delta: clsValue,
          entries: entries,
          id: 'cls-' + Date.now(),
          navigationType: 'navigate',
        });
      });

      try {
        clsObserver.observe({ type: 'layout-shift', buffered: true });
      } catch {
        // Browser doesn't support this metric
      }

      // First Contentful Paint (FCP)
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            onPerfEntry({
              name: 'FCP',
              value: entry.startTime,
              delta: entry.startTime,
              entries: [entry],
              id: 'fcp-' + Date.now(),
              navigationType: 'navigate',
            });
          }
        });
      });

      try {
        fcpObserver.observe({ type: 'paint', buffered: true });
      } catch {
        // Browser doesn't support this metric
      }

      // Time to First Byte (TTFB)
      if (performance.timing) {
        const ttfb =
          performance.timing.responseStart - performance.timing.requestStart;
        onPerfEntry({
          name: 'TTFB',
          value: ttfb,
          delta: ttfb,
          entries: [],
          id: 'ttfb-' + Date.now(),
          navigationType: 'navigate',
        });
      }
    }
  }
};

// Type definitions for Performance API
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

// Enhanced console logger with better formatting
export const consoleReporter = (metric: Metric): void => {
  const getRating = (name: string, value: number): string => {
    switch (name) {
      case 'LCP':
        return value <= 2500
          ? '🟢 Good'
          : value <= 4000
          ? '🟡 Needs Improvement'
          : '🔴 Poor';
      case 'FID':
        return value <= 100
          ? '🟢 Good'
          : value <= 300
          ? '🟡 Needs Improvement'
          : '🔴 Poor';
      case 'CLS':
        return value <= 0.1
          ? '🟢 Good'
          : value <= 0.25
          ? '🟡 Needs Improvement'
          : '🔴 Poor';
      case 'FCP':
        return value <= 1800
          ? '🟢 Good'
          : value <= 3000
          ? '🟡 Needs Improvement'
          : '🔴 Poor';
      case 'TTFB':
        return value <= 800
          ? '🟢 Good'
          : value <= 1800
          ? '🟡 Needs Improvement'
          : '🔴 Poor';
      default:
        return '⚪ Unknown';
    }
  };

  const formatValue = (name: string, value: number): string => {
    if (name === 'CLS') {
      return value.toFixed(4);
    }
    return `${Math.round(value)}ms`;
  };

  console.group(`📊 Web Vital: ${metric.name}`);
  console.log(`Value: ${formatValue(metric.name, metric.value)}`);
  console.log(`Rating: ${getRating(metric.name, metric.value)}`);
  console.log(`ID: ${metric.id}`);
  console.log(`Navigation Type: ${metric.navigationType}`);
  if (metric.entries.length > 0) {
    console.log('Entries:', metric.entries);
  }
  console.groupEnd();
};

// Simple logger function
export const simpleLogger = (metric: Metric): void => {
  const value =
    metric.name === 'CLS'
      ? metric.value.toFixed(4)
      : `${Math.round(metric.value)}ms`;
  console.log(`${metric.name}: ${value}`);
};

// Usage examples:

// Option 1: Universal approach (works with any web-vitals version)
// reportWebVitalsUniversal(consoleReporter);

// Option 2: Standard approach with fallback
// reportWebVitals(consoleReporter);

// Option 3: Native implementation only (no dependencies)
// reportWebVitalsNative(consoleReporter);

// Option 4: Simple logging
// reportWebVitals(simpleLogger);

// Example usage in index.tsx or App.tsx:
/*
  import { reportWebVitalsUniversal, consoleReporter, simpleLogger } from './reportWebVitals';
  
  // Recommended: Universal approach
  reportWebVitalsUniversal(consoleReporter);
  
  // Or simple logging:
  reportWebVitalsUniversal(simpleLogger);
  
  // Or basic console.log:
  reportWebVitalsUniversal(console.log);
  
  // Or if you prefer the native-only approach:
  import { reportWebVitalsNative } from './reportWebVitals';
  reportWebVitalsNative(consoleReporter);
  */
