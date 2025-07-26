import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTemplates, useUpdateTemplate } from '../hooks/useTemplates';
import { useToast } from '@/hooks/use-toast';
import { JsonEditor } from '../components/JsonEditor';
import { FormPreview } from '../components/FormPreview';
import { FormBuilder, createFormBuilderSchema, getFormBuilderOutput } from '../components/builder/FormBuilder';
import { FormSchema, convertToSurveyJS } from '../components/builder/utils/schemaConverter';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export const EditTemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: templates, isLoading } = useTemplates();
  const updateTemplate = useUpdateTemplate();
  
  // PHASE 1: Single Source of Truth - Only builderSchema
  const [builderSchema, setBuilderSchema] = useState<FormSchema>(createFormBuilderSchema());
  const [activeTab, setActiveTab] = useState('builder');
  const [isDirty, setIsDirty] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();

  // PHASE 4: Debounced save logic
  const debouncedSave = useCallback((schemaToSave: FormSchema) => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        setIsAutoSaving(true);
        const surveySchema = convertToSurveyJS(schemaToSave);
        
        console.log('💾 [AUTO_SAVE] Saving schema:', {
          rowsCount: schemaToSave.rows?.length || 0,
          elementsCount: surveySchema?.elements?.length || 0
        });
        
        // Auto-save implementation could go here if needed
      } catch (error) {
        console.error('❌ [AUTO_SAVE] Failed:', error);
      } finally {
        setIsAutoSaving(false);
      }
    }, 1000);
  }, []);

  // Track schema changes for dirty state
  const handleBuilderSchemaChange = useCallback((newSchema: FormSchema) => {
    console.log('🔄 [SCHEMA_CHANGE] Builder schema updated:', {
      rowsCount: newSchema.rows?.length || 0,
      title: newSchema.title,
      totalFields: newSchema.rows?.reduce((sum, row) => 
        sum + row.columns.reduce((colSum, col) => colSum + col.fields.length, 0), 0) || 0
    });
    
    setBuilderSchema(newSchema);
    setIsDirty(true);
    debouncedSave(newSchema);
  }, [debouncedSave]);

  const template = templates?.find(t => t.id === id);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Load template data  
  useEffect(() => {
    console.log('🔄 [EDIT_TEMPLATE] Loading template data:', {
      templateExists: !!template,
      templateId: template?.id,
      templateName: template?.name,
      schemaType: typeof template?.schema_json,
      schemaKeys: template?.schema_json ? Object.keys(template.schema_json) : [],
    });
    
    if (template) {
      console.log('📝 [EDIT_TEMPLATE] Setting form data and schema');
      form.reset({
        name: template.name,
        description: template.description || '',
      });
      
      const newBuilderSchema = createFormBuilderSchema(template.schema_json);
      console.log('🏗️ [EDIT_TEMPLATE] Created builder schema:', {
        builderRowsCount: newBuilderSchema.rows?.length || 0,
        builderTitle: newBuilderSchema.title,
        builderRows: newBuilderSchema.rows?.map(r => ({
          id: r.id,
          columnsCount: r.columns?.length || 0,
          totalFields: r.columns?.reduce((sum, col) => sum + (col.fields?.length || 0), 0) || 0
        })) || []
      });
      
      setBuilderSchema(newBuilderSchema);
      setIsDirty(false); // Reset dirty state when loading template
    }
  }, [template, form]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // PHASE 4: Always save from builderSchema
  const onSubmit = async (data: TemplateFormData) => {
    console.log('💾 [EDIT_TEMPLATE] Submit triggered:', {
      templateId: id,
      activeTab,
      formData: data,
      builderSchemaRows: builderSchema.rows?.length || 0,
      isDirty
    });
    
    if (!id || !template) return;

    try {
      // PHASE 4: Always convert from builderSchema, regardless of active tab
      const currentSchema = getFormBuilderOutput(builderSchema);
      
      console.log('🏗️ [EDIT_TEMPLATE] Converting from builderSchema:', {
        builderRowsCount: builderSchema.rows?.length || 0,
        builderTitle: builderSchema.title,
        outputElementsCount: currentSchema?.elements?.length || 0,
        outputKeys: currentSchema ? Object.keys(currentSchema) : []
      });

      if (!currentSchema || !currentSchema.elements || currentSchema.elements.length === 0) {
        console.log('❌ [EDIT_TEMPLATE] No valid schema to save');
        toast({
          title: 'Error',
          description: 'Please add some form fields before saving.',
          variant: 'destructive',
        });
        return;
      }

      console.log('📤 [EDIT_TEMPLATE] Sending update request:', {
        templateId: id,
        schemaElementsCount: currentSchema.elements.length,
        schemaTitle: currentSchema.title
      });

      // Clear any pending auto-save
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      await updateTemplate.mutateAsync({
        id,
        updates: {
          name: data.name,
          description: data.description,
          schema_json: currentSchema,
        },
      });

      console.log('✅ [EDIT_TEMPLATE] Update successful');
      setIsDirty(false);
      
      toast({
        title: 'Template updated',
        description: `"${data.name}" has been updated successfully.`,
      });

      navigate('/templates');
    } catch (error) {
      console.error('❌ [EDIT_TEMPLATE] Update failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to update template. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // PHASE 5: Navigation guard for dirty state
  const handleNavigateBack = useCallback(() => {
    if (isDirty) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to leave?');
      if (!confirmed) return;
    }
    navigate('/templates');
  }, [isDirty, navigate]);

  // Convert builderSchema to JSON for editor/preview on-demand
  const getCurrentJsonSchema = useCallback(() => {
    return getFormBuilderOutput(builderSchema);
  }, [builderSchema]);

  // Handle JSON editor changes and sync back to builderSchema  
  const handleJsonChange = useCallback((newJsonSchema: any) => {
    try {
      const newBuilderSchema = createFormBuilderSchema(newJsonSchema);
      setBuilderSchema(newBuilderSchema);
      setIsDirty(true);
      
      console.log('📝 [JSON_CHANGE] Updated from JSON editor:', {
        newRowsCount: newBuilderSchema.rows?.length || 0,
        elementsCount: newJsonSchema?.elements?.length || 0
      });
    } catch (error) {
      console.error('❌ [JSON_CHANGE] Failed to parse JSON schema:', error);
      toast({
        title: 'Invalid JSON',
        description: 'Failed to parse the JSON schema. Please check your syntax.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={handleNavigateBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Template</h1>
          <p className="text-muted-foreground">
            Modify your form template
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Template Details</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Template Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter template name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter template description (optional)"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Form Builder</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Edit your form using the JSON editor below.
                  </p>
                </div>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    <TabsTrigger value="builder">Form Builder</TabsTrigger>
                    <TabsTrigger value="editor">JSON Editor</TabsTrigger>
                    <TabsTrigger value="preview">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </TabsTrigger>
                  </TabsList>
                  
                   <TabsContent value="builder" className="space-y-4">
                     <div className="border rounded-lg overflow-hidden">
                       <FormBuilder
                         schema={builderSchema}
                         onChange={handleBuilderSchemaChange}
                       />
                     </div>
                   </TabsContent>
                   
                   <TabsContent value="editor" className="space-y-4">
                     <JsonEditor
                       value={getCurrentJsonSchema()}
                       onChange={handleJsonChange}
                       height="500px"
                     />
                   </TabsContent>
                   
                   <TabsContent value="preview" className="space-y-4">
                     {getCurrentJsonSchema() ? (
                       <FormPreview schema={getCurrentJsonSchema()} />
                     ) : (
                       <div className="p-8 text-center text-muted-foreground">
                         <p>No form schema to preview. Add some fields to get started.</p>
                       </div>
                     )}
                   </TabsContent>
                </Tabs>
              </div>

               <div className="flex gap-3">
                 <Button 
                   type="submit" 
                   disabled={updateTemplate.isPending || !isDirty}
                   className="relative"
                 >
                   {updateTemplate.isPending ? 'Updating...' : 
                    isDirty ? 'Update Template' : 'Template Saved'}
                   {isAutoSaving && (
                     <span className="ml-2 text-xs opacity-70">(Auto-saving...)</span>
                   )}
                 </Button>
                 <Button
                   type="button"
                   variant="outline"
                   onClick={handleNavigateBack}
                 >
                   Cancel
                 </Button>
               </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};