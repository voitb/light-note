import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, Tag as TagIcon, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNotesStore } from '@/store/notes-store';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/theme-toggle';
import { Logo } from '@/components/logo';

export function SharedNoteView() {
  const { noteId } = useParams<{ noteId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get note from the store
  const { getNote } = useNotesStore();
  const note = noteId ? getNote(noteId) : undefined;
  
  useEffect(() => {
    // Simulate loading for better UX
    const timer = setTimeout(() => {
      setLoading(false);
      
      // Check if note exists and is shared
      if (!note) {
        setError('Note not found');
      } else if (!note.isShared) {
        setError('This note is not shared or has been made private');
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [note]);
  
  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle not found or not shared
  if (!loading && (error || !note)) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <header className="h-14 border-b flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link to="/">
              <Logo />
            </Link>
          </div>
          <ThemeToggle />
        </header>
        
        <div className="flex flex-col items-center justify-center flex-1 p-4 text-center">
          <div className="max-w-md">
            <h1 className="text-2xl font-bold mb-4">{error || 'Note not found'}</h1>
            <p className="text-muted-foreground mb-6">
              {error 
                ? 'This note may have been deleted or made private by the owner.' 
                : 'The note you are looking for does not exist.'}
            </p>
            <Button asChild>
              <Link to="/">Go to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="h-14 border-b flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Logo />
          </Link>
          <div className="text-sm text-muted-foreground hidden md:block">
            Shared Note
          </div>
        </div>
        <ThemeToggle />
      </header>
      
      {/* Content */}
      <div className="flex-1 mx-auto w-full max-w-4xl px-4 py-8">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Homepage
          </Link>
          
          {loading ? (
            <>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex gap-2 mb-6">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </>
          ) : note && (
            <>
              <h1 className="text-3xl font-bold mb-4">{note.title}</h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {note.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mr-1">
                      <TagIcon className="h-3 w-3" />
                    </div>
                    {note.tags.map(tag => (
                      <Badge 
                        key={tag}
                        variant="secondary"
                        className="px-2 py-0 h-6 text-xs bg-muted/50"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <User className="h-3 w-3" />
                  <span>Shared by {note.userId}</span>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  Updated {formatDate(note.updatedAt)}
                </div>
              </div>
              
              <div className="prose prose-sm md:prose-base max-w-none dark:prose-invert border-t pt-6">
                {note.content ? (
                  <ReactMarkdown>{note.content}</ReactMarkdown>
                ) : (
                  <div className="text-muted-foreground italic">
                    This note has no content.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <div>
            Shared via <span className="font-medium">LightNote</span>
          </div>
          <div>
            <Link to="/" className="hover:underline">Create your own notes</Link>
          </div>
        </div>
      </footer>
    </div>
  );
} 