/**
 * Template system debugging utilities
 */

import { logger, performanceLogger } from './loggingService';
import { supabase } from '@/integrations/supabase/client';

export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  fieldCount: number;
  rowCount: number;
  schemaType: 'surveyjs' | 'custom' | 'unknown';
}

export interface TemplateDebugInfo {
  templateId: string;
  templateName: string;
  validation: TemplateValidationResult;
  loadTime: number;
  schemaSize: number;
  lastAccessed: Date;
}

class TemplateDebugger {
  private templateCache = new Map<string, TemplateDebugInfo>();

  async validateTemplate(templateId: string): Promise<TemplateValidationResult> {
    const timer = performanceLogger.startTimer(`Template validation: ${templateId}`);
    
    try {
      logger.debug('Starting template validation', { 
        component: 'TemplateDebugger', 
        action: 'validate',
        templateId 
      });

      const { data: template, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) {
        logger.error('Failed to fetch template for validation', { templateId }, error);
        return {
          isValid: false,
          errors: [`Failed to fetch template: ${error.message}`],
          warnings: [],
          fieldCount: 0,
          rowCount: 0,
          schemaType: 'unknown'
        };
      }

      const result = this.validateTemplateSchema(template.schema_json);
      timer.end({ templateId, isValid: result.isValid });

      logger.info('Template validation completed', {
        component: 'TemplateDebugger',
        action: 'validate',
        templateId,
        isValid: result.isValid,
        errorCount: result.errors.length,
        warningCount: result.warnings.length
      });

      return result;
    } catch (error) {
      timer.end({ templateId, error: true });
      logger.error('Template validation failed with exception', { templateId }, error as Error);
      throw error;
    }
  }

  private validateTemplateSchema(schema: any): TemplateValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];
    let fieldCount = 0;
    let rowCount = 0;
    let schemaType: 'surveyjs' | 'custom' | 'unknown' = 'unknown';

    try {
      if (!schema) {
        errors.push('Schema is null or undefined');
        return { isValid: false, errors, warnings, fieldCount, rowCount, schemaType };
      }

      // Detect schema type
      if (schema.pages || schema.elements) {
        schemaType = 'surveyjs';
        logger.debug('Detected SurveyJS schema format');
        
        // Validate SurveyJS schema
        if (schema.pages) {
          schema.pages.forEach((page: any, pageIndex: number) => {
            if (!page.elements) {
              warnings.push(`Page ${pageIndex} has no elements`);
              return;
            }
            page.elements.forEach((element: any) => {
              fieldCount++;
              this.validateSurveyJSElement(element, errors, warnings);
            });
          });
        } else if (schema.elements) {
          schema.elements.forEach((element: any) => {
            fieldCount++;
            this.validateSurveyJSElement(element, errors, warnings);
          });
        }
      } else if (schema.rows) {
        schemaType = 'custom';
        logger.debug('Detected custom schema format');
        
        // Validate custom row-based schema
        rowCount = schema.rows.length;
        schema.rows.forEach((row: any, rowIndex: number) => {
          if (!row.columns || !Array.isArray(row.columns)) {
            errors.push(`Row ${rowIndex} has invalid columns`);
            return;
          }
          
          row.columns.forEach((column: any, colIndex: number) => {
            if (!column.fields || !Array.isArray(column.fields)) {
              errors.push(`Row ${rowIndex}, Column ${colIndex} has invalid fields`);
              return;
            }
            
            column.fields.forEach((field: any) => {
              fieldCount++;
              this.validateCustomField(field, errors, warnings);
            });
          });
        });
      } else {
        errors.push('Unknown schema format - missing pages, elements, or rows');
      }

      // General validations
      if (fieldCount === 0) {
        warnings.push('Template has no fields');
      }

      const isValid = errors.length === 0;
      
      logger.debug('Schema validation results', {
        schemaType,
        fieldCount,
        rowCount,
        errorCount: errors.length,
        warningCount: warnings.length,
        isValid
      });

      return { isValid, errors, warnings, fieldCount, rowCount, schemaType };
    } catch (error) {
      logger.error('Schema validation threw exception', {}, error as Error);
      errors.push(`Validation exception: ${(error as Error).message}`);
      return { isValid: false, errors, warnings, fieldCount, rowCount, schemaType };
    }
  }

  private validateSurveyJSElement(element: any, errors: string[], warnings: string[]) {
    if (!element.name) {
      errors.push(`Element missing name: ${JSON.stringify(element)}`);
    }
    if (!element.type) {
      errors.push(`Element missing type: ${element.name || 'unnamed'}`);
    }
    if (element.type === 'text' && !element.title) {
      warnings.push(`Text element "${element.name}" has no title`);
    }
  }

  private validateCustomField(field: any, errors: string[], warnings: string[]) {
    if (!field.name) {
      errors.push(`Field missing name: ${JSON.stringify(field)}`);
    }
    if (!field.type) {
      errors.push(`Field missing type: ${field.name || 'unnamed'}`);
    }
    if (!field.label) {
      warnings.push(`Field "${field.name}" has no label`);
    }
  }

  async debugTemplateLoad(templateId: string): Promise<TemplateDebugInfo> {
    const startTime = performance.now();
    
    try {
      logger.info('Starting template debug load', { 
        component: 'TemplateDebugger',
        action: 'debug_load',
        templateId 
      });

      // Check cache first
      const cached = this.templateCache.get(templateId);
      if (cached && (Date.now() - cached.lastAccessed.getTime()) < 60000) { // 1 minute cache
        logger.debug('Returning cached template debug info', { templateId });
        return cached;
      }

      const { data: template, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', templateId)
        .single();

      if (error) {
        logger.error('Failed to load template for debugging', { templateId }, error);
        throw error;
      }

      const validation = this.validateTemplateSchema(template.schema_json);
      const loadTime = performance.now() - startTime;
      const schemaSize = JSON.stringify(template.schema_json).length;

      const debugInfo: TemplateDebugInfo = {
        templateId,
        templateName: template.name,
        validation,
        loadTime,
        schemaSize,
        lastAccessed: new Date()
      };

      this.templateCache.set(templateId, debugInfo);

      logger.info('Template debug load completed', {
        component: 'TemplateDebugger',
        action: 'debug_load',
        templateId,
        loadTime,
        schemaSize,
        isValid: validation.isValid
      });

      return debugInfo;
    } catch (error) {
      logger.error('Template debug load failed', { templateId }, error as Error);
      throw error;
    }
  }

  getTemplateCache(): Map<string, TemplateDebugInfo> {
    return new Map(this.templateCache);
  }

  clearCache() {
    this.templateCache.clear();
    logger.info('Template cache cleared', { component: 'TemplateDebugger' });
  }

  async testTemplateFunction(templateId: string): Promise<any> {
    logger.info('Testing get_template_structure function', { templateId });
    
    try {
      const { data, error } = await supabase.rpc('get_template_structure', {
        p_template_id: templateId
      });

      if (error) {
        logger.error('get_template_structure function failed', { templateId }, error);
        throw error;
      }

      logger.info('get_template_structure function succeeded', { 
        templateId,
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : []
      });

      return data;
    } catch (error) {
      logger.error('get_template_structure function threw exception', { templateId }, error as Error);
      throw error;
    }
  }
}

export const templateDebugger = new TemplateDebugger();