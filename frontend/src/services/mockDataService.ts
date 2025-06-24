import { useNotesStore } from '@/store/notes-store';
import { mockNotes } from '@/lib/mock-data';

export class MockDataService {
  static initializeNotes(): void {
    const { notes, addNote } = useNotesStore.getState();

    if (notes.length === 0) {
      mockNotes.forEach((note) => {
        addNote({
          userId: "default",
          title: note.title,
          content: note.content,
          tags: note.tags,
          isPinned: note.isPinned,
        });
      });
    }
  }
}

export const mockDataService = {
  initializeNotes: MockDataService.initializeNotes,
};