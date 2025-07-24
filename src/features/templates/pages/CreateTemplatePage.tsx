import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { useCreateTemplate } from '../hooks/useTemplates';
import { useToast } from '@/hooks/use-toast';
import { TemplateSelector } from '../components/TemplateSelector';
import { JsonEditor } from '../components/JsonEditor';
import { FormPreview } from '../components/FormPreview';
import { FormBuilder, createFormBuilderSchema, getFormBuilderOutput } from '../components/builder/FormBuilder';
import { PrebuiltTemplate } from '../data/prebuiltTemplates';
import { FormSchema } from '../components/builder/utils/schemaConverter';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export const CreateTemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createTemplate = useCreateTemplate();
  const [selectedTemplate, setSelectedTemplate] = useState<PrebuiltTemplate | null>(undefined);
  const [formSchema, setFormSchema] = useState<any>(null);
  const [builderSchema, setBuilderSchema] = useState<FormSchema>(createFormBuilderSchema());
  const [activeTab, setActiveTab] = useState('builder');

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Handle template selection
  const handleTemplateSelection = (template: PrebuiltTemplate | null) => {
    setSelectedTemplate(template);
    if (template) {
      setFormSchema(template.schema_json);
      setBuilderSchema(createFormBuilderSchema(template.schema_json));
      // Auto-fill form fields with template name and description
      form.setValue('name', template.name);
      form.setValue('description', template.description);
    } else {
      // Reset to blank schema for custom creation
      setFormSchema({
        title: 'New Form',
        elements: []
      });
      setBuilderSchema(createFormBuilderSchema());
      form.setValue('name', '');
      form.setValue('description', '');
    }
  };

  const onSubmit = async (data: TemplateFormData) => {
    try {
      // Get the current schema based on active tab
      let currentSchema = formSchema;
      if (activeTab === 'builder') {
        currentSchema = getFormBuilderOutput(builderSchema);
      }

      if (!currentSchema || (currentSchema.elements && currentSchema.elements.length === 0 && builderSchema.fields.length === 0)) {
        toast({
          title: 'Error',
          description: 'Please add at least one field to your form.',
          variant: 'destructive',
        });
        return;
      }

      await createTemplate.mutateAsync({
        name: data.name,
        description: data.description,
        schema_json: currentSchema,
      });

      toast({
        title: 'Template created',
        description: `"${data.name}" has been created successfully.`,
      });

      navigate('/templates');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create template. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/templates')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Templates
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Template</h1>
          <p className="text-muted-foreground">
            Create a new form template for your practice
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

              {selectedTemplate === undefined ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Template Selection</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Choose a template to get started quickly, or create a custom form from scratch.
                    </p>
                  </div>
                  <TemplateSelector
                    onSelectTemplate={handleTemplateSelection}
                    selectedTemplateId={selectedTemplate?.id}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium mb-2">Form Builder</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedTemplate 
                          ? `Customize the ${selectedTemplate.name} template` 
                          : 'Create your custom form using JSON editor'
                        }
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTemplate(undefined)}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Change Template
                    </Button>
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
                          onChange={setBuilderSchema}
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="editor" className="space-y-4">
                      <JsonEditor
                        value={activeTab === 'builder' ? getFormBuilderOutput(builderSchema) : formSchema}
                        onChange={(value) => {
                          setFormSchema(value);
                          if (activeTab === 'editor') {
                            setBuilderSchema(createFormBuilderSchema(value));
                          }
                        }}
                        height="500px"
                      />
                    </TabsContent>
                    
                    <TabsContent value="preview" className="space-y-4">
                      {(activeTab === 'builder' ? getFormBuilderOutput(builderSchema) : formSchema) ? (
                        <FormPreview schema={activeTab === 'builder' ? getFormBuilderOutput(builderSchema) : formSchema} />
                      ) : (
                        <div className="p-8 text-center text-muted-foreground">
                          <p>No form schema to preview. Please create your form first.</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={createTemplate.isPending || selectedTemplate === undefined}
                >
                  {createTemplate.isPending ? 'Creating...' : 'Create Template'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/templates')}
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