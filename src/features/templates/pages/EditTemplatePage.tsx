import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { SurveyCreatorComponent, SurveyCreator } from 'survey-creator-react';
import 'survey-creator-core/survey-creator-core.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useTemplates, useUpdateTemplate } from '../hooks/useTemplates';
import { useToast } from '@/hooks/use-toast';

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
  const [formSchema, setFormSchema] = useState<any>(null);
  const [creator, setCreator] = useState<SurveyCreator | null>(null);

  const template = templates?.find(t => t.id === id);

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  // Initialize SurveyJS Creator and load template data
  useEffect(() => {
    if (template) {
      // Set form values
      form.reset({
        name: template.name,
        description: template.description || '',
      });

      // Initialize creator with template schema
      const surveyCreator = new SurveyCreator({
        showLogicTab: true,
        showTranslationTab: false,
        showEmbededSurveyTab: false,
      });

      // Load existing schema if available
      if (template.schema_json) {
        surveyCreator.JSON = template.schema_json;
        setFormSchema(template.schema_json);
      }

      surveyCreator.onModified.add((sender, options) => {
        setFormSchema(sender.JSON);
      });

      setCreator(surveyCreator);
    }
  }, [template, form]);

  const onSubmit = async (data: TemplateFormData) => {
    if (!id || !template) return;

    try {
      if (!formSchema) {
        toast({
          title: 'Error',
          description: 'Please design your form before saving.',
          variant: 'destructive',
        });
        return;
      }

      await updateTemplate.mutateAsync({
        id,
        updates: {
          name: data.name,
          description: data.description,
          schema_json: formSchema,
        },
      });

      toast({
        title: 'Template updated',
        description: `"${data.name}" has been updated successfully.`,
      });

      navigate('/templates');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update template. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!template) {
    return <div>Template not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/templates')}>
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
                    Design your form using the drag-and-drop builder below.
                  </p>
                </div>
                <div className="border rounded-lg overflow-hidden min-h-[600px]">
                  {creator && (
                    <SurveyCreatorComponent creator={creator} />
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={updateTemplate.isPending}>
                  {updateTemplate.isPending ? 'Updating...' : 'Update Template'}
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