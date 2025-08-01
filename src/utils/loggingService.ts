/**
 * Centralized logging service for error tracking and debugging
 */

export interface LogContext {
  userId?: string;
  sessionId?: string;
  component?: string;
  action?: string;
  templateId?: string;
  submissionId?: string;
  errorCode?: string;
  success?: boolean;
  duration?: number;
  error?: boolean;
  retryCount?: number;
  schemaType?: string;
  metadata?: Record<string, any>;
  [key: string]: any; // Allow additional properties
}

export interface LogEntry {
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  message: string;
  context: LogContext;
  timestamp: Date;
  stack?: string;
  userAgent?: string;
  url?: string;
}

class LoggingService {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  log(level: LogEntry['level'], message: string, context: LogContext = {}, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      context,
      timestamp: new Date(),
      stack: error?.stack,
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.logs.push(entry);
    
    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output for development
    if (process.env.NODE_ENV === 'development') {
      const logMethod = level === 'error' || level === 'fatal' ? 'error' : 
                       level === 'warn' ? 'warn' : 'log';
      console[logMethod](`[${level.toUpperCase()}] ${message}`, {
        context,
        error,
        timestamp: entry.timestamp
      });
    }

    // In production, send to monitoring service
    if (process.env.NODE_ENV === 'production' && (level === 'error' || level === 'fatal')) {
      this.sendToMonitoring(entry);
    }
  }

  debug(message: string, context?: LogContext) {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext) {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext, error?: Error) {
    this.log('warn', message, context, error);
  }

  error(message: string, context?: LogContext, error?: Error) {
    this.log('error', message, context, error);
  }

  fatal(message: string, context?: LogContext, error?: Error) {
    this.log('fatal', message, context, error);
  }

  getLogs(level?: LogEntry['level']): LogEntry[] {
    if (!level) return [...this.logs];
    return this.logs.filter(log => log.level === level);
  }

  getRecentErrors(count = 10): LogEntry[] {
    return this.logs
      .filter(log => log.level === 'error' || log.level === 'fatal')
      .slice(-count);
  }

  private sendToMonitoring(entry: LogEntry) {
    // Integration with monitoring services like Sentry, DataDog, etc.
    // For now, just store in localStorage for debugging
    try {
      const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
      existingErrors.push(entry);
      localStorage.setItem('app_errors', JSON.stringify(existingErrors.slice(-50)));
    } catch (err) {
      console.error('Failed to store error in localStorage:', err);
    }
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = new LoggingService();

// Performance monitoring helpers
export const performanceLogger = {
  startTimer: (label: string) => {
    const start = performance.now();
    return {
      end: (context?: LogContext) => {
        const duration = performance.now() - start;
        logger.info(`Performance: ${label} completed in ${duration.toFixed(2)}ms`, {
          ...context,
          duration,
          action: 'performance_measure'
        });
        return duration;
      }
    };
  },

  measureAsync: async <T>(label: string, fn: () => Promise<T>, context?: LogContext): Promise<T> => {
    const timer = performanceLogger.startTimer(label);
    try {
      const result = await fn();
      timer.end(context);
      return result;
    } catch (error) {
      timer.end({ ...context, error: true });
      throw error;
    }
  }
};
