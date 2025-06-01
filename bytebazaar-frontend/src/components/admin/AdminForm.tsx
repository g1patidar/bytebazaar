import React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'email' | 'select' | 'switch' | 'file';
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string | number }[];
  validation?: z.ZodTypeAny;
  defaultValue?: any;
}

interface AdminFormProps {
  fields: FormField[];
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
  className?: string;
  defaultValues?: Record<string, any>;
}

const AdminForm: React.FC<AdminFormProps> = ({
  fields,
  onSubmit,
  submitLabel = 'Submit',
  className,
  defaultValues = {}
}) => {
  // Create schema dynamically based on fields
  const schema = z.object(
    fields.reduce((acc, field) => ({
      ...acc,
      [field.name]: field.validation || z.any()
    }), {})
  );

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...fields.reduce((acc, field) => ({
        ...acc,
        [field.name]: field.defaultValue
      }), {}),
      ...defaultValues
    }
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel>{field.label}</FormLabel>
            <FormControl>
              {field.type === 'textarea' ? (
                <Textarea
                  placeholder={field.placeholder}
                  {...formField}
                />
              ) : field.type === 'select' ? (
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value.toString()}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : field.type === 'switch' ? (
                <Switch
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                />
              ) : field.type === 'file' ? (
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    formField.onChange(file);
                  }}
                />
              ) : (
                <Input
                  type={field.type}
                  placeholder={field.placeholder}
                  {...formField}
                />
              )}
            </FormControl>
            {field.description && (
              <FormDescription>{field.description}</FormDescription>
            )}
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-6", className)}
      >
        {fields.map(renderField)}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {submitLabel}
        </Button>
      </form>
    </Form>
  );
};

export default AdminForm; 