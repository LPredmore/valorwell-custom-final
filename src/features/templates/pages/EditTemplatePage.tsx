import React, { useState, useCallback, useEffect } from 'react';
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
import { FormSchema } from '../components/builder/utils/schemaConverter';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export const EditTemplatePage: React.FC = () => {
  console.log('🚀 [EDIT_TEMPLATE_PAGE] Component mounted/re-rendered');
  
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { data: templates, isLoading } = useTemplates();
  const updateTemplate = useUpdateTemplate();
  
  // State management with logging
  const [builderSchema, setBuilderSchema] = useState<FormSchema>(() => {
    const initial = createFormBuilderSchema();
    console.log('📊 [STATE_INIT] Initial builderSchema created:', {
      title: initial.title,
      rowsCount: initial.rows?.length || 0
    });
    return initial;
  });
  
  const [formSchema, setFormSchema] = useState<any>(() => {
    console.log('📊 [STATE_INIT] Initial formSchema set to null');
    return null;
  });
  
  const [activeTab, setActiveTab] = useState(() => {
    console.log('📊 [STATE_INIT] Initial activeTab set to: builder');
    return 'builder';
  });

  const template = templates?.find(t => t.id === id);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Load template data with logging
  useEffect(() => {
    console.log('🔄 [TEMPLATE_EFFECT] Effect triggered:', {
      templateExists: !!template,
      templateId: template?.id,
      templateName: template?.name,
      hasSchema: !!template?.schema_json
    });
    
    if (template) {
      console.log('📝 [TEMPLATE_LOAD] Loading template data into form and state');
      
      form.reset({
        name: template.name,
        description: template.description || '',
      });
      console.log('📝 [TEMPLATE_LOAD] Form reset with template data');
      
      setFormSchema(template.schema_json);
      console.log('📝 [TEMPLATE_LOAD] formSchema state updated');
      
      const newBuilderSchema = createFormBuilderSchema(template.schema_json);
      console.log('📝 [TEMPLATE_LOAD] Created new builder schema:', {
        title: newBuilderSchema.title,
        rowsCount: newBuilderSchema.rows?.length || 0
      });
      
      setBuilderSchema(newBuilderSchema);
      console.log('📝 [TEMPLATE_LOAD] builderSchema state updated');
    }
  }, [template, form]);

  // Schema update handlers with comprehensive logging
  const handleBuilderSchemaChange = useCallback((newSchema: FormSchema) => {
    console.log('🔄 [BUILDER_SCHEMA_CHANGE] === FUNCTION CALLED ===');
    console.log('🔄 [BUILDER_SCHEMA_CHANGE] New schema received:', {
      title: newSchema.title,
      rowsCount: newSchema.rows?.length || 0,
      timestamp: new Date().toISOString()
    });
    console.log('🔄 [BUILDER_SCHEMA_CHANGE] Call stack:', new Error().stack);
    
    setBuilderSchema(newSchema);
    console.log('🔄 [BUILDER_SCHEMA_CHANGE] State updated - NO FORM SUBMISSION SHOULD HAPPEN');
    
    // Check if this triggers any other effects
    setTimeout(() => {
      console.log('🔄 [BUILDER_SCHEMA_CHANGE] Post-update check - current activeTab:', activeTab);
    }, 0);
  }, [activeTab]);

  const handleJsonChange = useCallback((newJsonSchema: any) => {
    console.log('📝 [JSON_CHANGE] === FUNCTION CALLED ===');
    console.log('📝 [JSON_CHANGE] New JSON schema received:', {
      hasElements: !!newJsonSchema?.elements,
      elementsCount: newJsonSchema?.elements?.length || 0
    });
    
    try {
      setFormSchema(newJsonSchema);
      console.log('📝 [JSON_CHANGE] formSchema state updated');
      
      const newBuilderSchema = createFormBuilderSchema(newJsonSchema);
      console.log('📝 [JSON_CHANGE] Created builder schema from JSON');
      
      setBuilderSchema(newBuilderSchema);
      console.log('📝 [JSON_CHANGE] builderSchema state updated');
    } catch (error) {
      console.error('❌ [JSON_CHANGE] Error processing JSON:', error);
      toast({
        title: 'Invalid JSON',
        description: 'Failed to parse the JSON schema. Please check your syntax.',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Tab change with logging
  const handleTabChange = useCallback((newTab: string) => {
    console.log('📑 [TAB_CHANGE] === TAB CHANGING ===');
    console.log('📑 [TAB_CHANGE] From:', activeTab, 'To:', newTab);
    setActiveTab(newTab);
    console.log('📑 [TAB_CHANGE] Tab state updated');
  }, [activeTab]);

  // Get current schema with logging
  const getCurrentJsonSchema = useCallback(() => {
    console.log('🔍 [GET_CURRENT_SCHEMA] === FUNCTION CALLED ===');
    console.log('🔍 [GET_CURRENT_SCHEMA] Active tab:', activeTab);
    
    if (activeTab === 'builder') {
      const output = getFormBuilderOutput(builderSchema);
      console.log('🔍 [GET_CURRENT_SCHEMA] Returning builder output:', {
        elementsCount: output?.elements?.length || 0
      });
      return output;
    }
    
    console.log('🔍 [GET_CURRENT_SCHEMA] Returning formSchema:', {
      elementsCount: formSchema?.elements?.length || 0
    });
    return formSchema;
  }, [activeTab, builderSchema, formSchema]);

  // Manual submit handler - ONLY called by button click
  const handleManualSubmit = async () => {
    console.log('💾 [MANUAL_SUBMIT] === MANUAL SUBMIT BUTTON CLICKED ===');
    console.log('💾 [MANUAL_SUBMIT] Template ID:', id);
    console.log('💾 [MANUAL_SUBMIT] Active tab:', activeTab);
    console.log('💾 [MANUAL_SUBMIT] Current builderSchema rows:', builderSchema.rows?.length || 0);
    
    if (!id || !template) {
      console.log('❌ [MANUAL_SUBMIT] Missing ID or template, returning early');
      return;
    }

    // Get form data manually
    const formData = form.getValues();
    console.log('💾 [MANUAL_SUBMIT] Form data:', formData);

    // Validate form manually
    const isValid = await form.trigger();
    if (!isValid) {
      console.log('❌ [MANUAL_SUBMIT] Form validation failed');
      return;
    }

    try {
      const currentSchema = getCurrentJsonSchema();
      console.log('💾 [MANUAL_SUBMIT] Current schema obtained:', {
        hasElements: !!currentSchema?.elements,
        elementsCount: currentSchema?.elements?.length || 0
      });

      if (!currentSchema || !currentSchema.elements || currentSchema.elements.length === 0) {
        console.log('❌ [MANUAL_SUBMIT] No valid schema, showing error toast');
        toast({
          title: 'Error',
          description: 'Please add some form fields before saving.',
          variant: 'destructive',
        });
        return;
      }

      console.log('📤 [MANUAL_SUBMIT] About to call updateTemplate mutation');
      
      await updateTemplate.mutateAsync({
        id,
        updates: {
          name: formData.name,
          description: formData.description,
          schema_json: currentSchema,
        },
      });

      console.log('✅ [MANUAL_SUBMIT] Update successful, showing success toast');
      
      toast({
        title: 'Template updated',
        description: `"${formData.name}" has been updated successfully.`,
      });

      console.log('🧭 [MANUAL_SUBMIT] About to navigate to /templates');
      navigate('/templates');
      console.log('🧭 [MANUAL_SUBMIT] Navigate call completed');

    } catch (error) {
      console.error('❌ [MANUAL_SUBMIT] Update failed:', error);
      toast({
        title: 'Error',
        description: 'Failed to update template. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Add logging for unexpected form submissions
  const handleUnexpectedSubmit = (e: React.FormEvent) => {
    console.error('🚨 [UNEXPECTED_SUBMIT] Form submission intercepted!', e);
    console.error('🚨 [UNEXPECTED_SUBMIT] This should not happen - investigating...');
    e.preventDefault();
    return false;
  };

  // Component render tracking
  useEffect(() => {
    console.log('🎨 [RENDER_EFFECT] Component rendered/re-rendered');
    return () => {
      console.log('🎨 [RENDER_EFFECT] Component will unmount or re-render');
    };
  });

  if (isLoading) {
    console.log('⏳ [RENDER] Showing loading state');
    return <div>Loading...</div>;
  }

  if (!template) {
    console.log('❌ [RENDER] No template found, showing error');
    return <div>Template not found</div>;
  }

  console.log('🎨 [RENDER] Rendering main component UI');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button 
          type="button"
          variant="ghost" 
          onClick={() => {
            console.log('🧭 [NAVIGATION] Back button clicked');
            navigate('/templates');
          }}
        >
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
            <form className="space-y-6" onSubmit={handleUnexpectedSubmit}>
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
                    Edit your form using the builder or JSON editor below.
                  </p>
                </div>
                
                <Tabs value={activeTab} onValueChange={handleTabChange}>
                  <TabsList>
                    <TabsTrigger value="builder" onClick={() => console.log('📑 [TAB_CLICK] Builder tab clicked')}>Form Builder</TabsTrigger>
                    <TabsTrigger value="editor" onClick={() => console.log('📑 [TAB_CLICK] Editor tab clicked')}>JSON Editor</TabsTrigger>
                    <TabsTrigger value="preview" onClick={() => console.log('📑 [TAB_CLICK] Preview tab clicked')}>
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
                   type="button"
                   disabled={updateTemplate.isPending}
                   onClick={() => {
                     console.log('💾 [BUTTON_CLICK] Update Template button clicked - calling handleManualSubmit');
                     handleManualSubmit();
                   }}
                 >
                   {updateTemplate.isPending ? 'Updating...' : 'Update Template'}
                 </Button>
                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => {
                     console.log('🧭 [BUTTON_CLICK] Cancel button clicked');
                     navigate('/templates');
                   }}
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
