interface PerformanceMetrics {
  fps: number;
  memory?: number;
  gestureLatency: number;
  cameraInitTime: number;
}

class PerformanceMonitor {
  private frameCount = 0;
  private lastTime = performance.now();
  private fps = 0;
  private gestureStartTime = 0;
  private cameraStartTime = 0;
  private isMonitoring = false;

  startMonitoring() {
    this.isMonitoring = true;
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.measureFPS();
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }

  markCameraStart() {
    this.cameraStartTime = performance.now();
  }

  markCameraReady(): number {
    return performance.now() - this.cameraStartTime;
  }

  markGestureStart() {
    this.gestureStartTime = performance.now();
  }

  markGestureDetected(): number {
    return performance.now() - this.gestureStartTime;
  }

  private measureFPS() {
    if (!this.isMonitoring) return;

    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }

    requestAnimationFrame(() => this.measureFPS());
  }

  getMetrics(): PerformanceMetrics {
    const memory = (performance as any).memory?.usedJSHeapSize 
      ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024)
      : undefined;

    return {
      fps: this.fps,
      memory,
      gestureLatency: 0, // This would be updated during gesture detection
      cameraInitTime: 0  // This would be updated during camera initialization
    };
  }

  logPerformance(context: string) {
    const metrics = this.getMetrics();
    console.log(`📊 Performance [${context}]:`, {
      FPS: metrics.fps,
      Memory: metrics.memory ? `${metrics.memory}MB` : 'N/A',
      'Gesture Latency': `${metrics.gestureLatency}ms`,
      'Camera Init': `${metrics.cameraInitTime}ms`
    });
  }

  // Get performance recommendations based on current metrics
  getOptimizationRecommendations(): string[] {
    const metrics = this.getMetrics();
    const recommendations: string[] = [];

    if (metrics.fps < 15) {
      recommendations.push('خفض جودة الكاميرا لتحسين الأداء');
      recommendations.push('تقليل معدل الإطارات');
    }

    if (metrics.memory && metrics.memory > 100) {
      recommendations.push('تحسين استخدام الذاكرة');
      recommendations.push('إعادة تشغيل التطبيق');
    }

    if (metrics.gestureLatency > 500) {
      recommendations.push('تحسين حساسية الإيماءات');
      recommendations.push('استخدام الوضع المبسط');
    }

    return recommendations;
  }
}

export const performanceMonitor = new PerformanceMonitor();

export const usePerformanceOptimization = () => {
  const getOptimalSettings = () => {
    const metrics = performanceMonitor.getMetrics();
    
    // تحديد الإعدادات المثلى بناءً على الأداء
    let complexity = 1;
    let frameRate = 30;
    let detection_confidence = 0.7;
    
    if (metrics.fps < 20) {
      complexity = 0;
      frameRate = 15;
      detection_confidence = 0.5;
    } else if (metrics.fps < 25) {
      complexity = 0;
      frameRate = 20;
      detection_confidence = 0.6;
    }

    return {
      complexity,
      frameRate,
      detection_confidence,
      processEveryNFrames: metrics.fps < 15 ? 3 : metrics.fps < 25 ? 2 : 1
    };
  };

  return { getOptimalSettings };
};