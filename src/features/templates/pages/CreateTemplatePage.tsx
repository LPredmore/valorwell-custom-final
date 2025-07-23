import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateTemplate } from '../hooks/useTemplates';
import { useToast } from '@/hooks/use-toast';

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type TemplateFormData = z.infer<typeof templateSchema>;

export const CreateTemplatePage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createTemplate = useCreateTemplate();

  const form = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const onSubmit = async (data: TemplateFormData) => {
    try {
      // For now, create a basic schema structure
      // This will be enhanced with the form builder in the next phase
      const basicSchema = {
        type: 'object',
        properties: {
          notes: {
            type: 'string',
            title: 'Notes',
            description: 'General notes field'
          }
        },
        required: []
      };

      await createTemplate.mutateAsync({
        name: data.name,
        description: data.description,
        schema_json: basicSchema,
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

              <div className="bg-muted p-4 rounded-lg">
                <h3 className="font-medium mb-2">Form Builder (Coming Soon)</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced form builder with drag-and-drop fields will be available in the next update.
                  For now, templates are created with a basic notes field.
                </p>
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={createTemplate.isPending}>
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