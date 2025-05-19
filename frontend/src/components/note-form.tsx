import { zodResolver } from "@hookform/resolvers/zod"
import { type FieldValues, useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { noteFormSchema } from "@/lib/schemas"
import type { NoteFormValues } from "@/lib/schemas"

interface NoteFormProps {
  defaultValues?: Partial<NoteFormValues>
  onSubmit: (data: NoteFormValues) => void
}

export function NoteForm({ defaultValues, onSubmit }: NoteFormProps) {
  const form = useForm({
    resolver: zodResolver(noteFormSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      ...defaultValues,
    },
  })

  function handleSubmit(data: FieldValues) {
    onSubmit(data as NoteFormValues)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6 w-full max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Create Note</h2>
          <p className="text-muted-foreground">Enter your note details below</p>
        </div>
        
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Note title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Write your note content using Markdown..." 
                  className="min-h-[200px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit">Save Note</Button>
        </div>
      </form>
    </Form>
  )
} 