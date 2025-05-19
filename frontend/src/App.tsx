import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./components/layout/root-layout";
import { LandingPage } from "./components/landing-page";
import { TermsPage } from "./components/terms-page";
import { PrivacyPage } from "./components/privacy-page";
import { useEffect } from "react";
import { setTheme } from "./lib/theme";
import { useUserStore } from "./lib/store/user-store";
import { useNotesStore } from "./lib/store/notes-store";
import { NotesLayout } from "./components/notes/notes-layout";
import { NoteEditor } from "./components/notes/note-editor";
import { NotesEmptyState } from "./components/notes/notes-empty-state";
import { NotesWelcome } from "./components/notes/notes-welcome";
import { SharedNoteView } from "./components/notes/shared-note-view";
import { mockNotes } from "./lib/mock-data";
import "./App.css";
import { LLMProvider } from "./context/llm/llm-provider";

function App() {
  const { preferences } = useUserStore();

  // Apply theme when component mounts or theme changes
  useEffect(() => {
    setTheme(preferences.theme);
  }, [preferences.theme]);

  // Initialize notes with mock data
  useEffect(() => {
    const { notes, addNote } = useNotesStore.getState();

    if (notes.length === 0) {
      // Add all mock notes to the store
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
  }, []);

  return (
    <div className="w-full h-full min-h-screen mx-0 px-0 flex flex-col">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<LandingPage />} />
            <Route
              path="about"
              element={
                <div className="w-full py-10 px-4">
                  About Page (Coming Soon)
                </div>
              }
            />
            <Route
              path="login"
              element={
                <div className="w-full py-10 px-4">
                  Login Page (Coming Soon)
                </div>
              }
            />
            <Route
              path="register"
              element={
                <div className="w-full py-10 px-4">
                  Register Page (Coming Soon)
                </div>
              }
            />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route
              path="*"
              element={<div className="w-full py-10 px-4">404 - Not Found</div>}
            />
          </Route>

          {/* Notes Application Routes */}
          <Route
            path="/notes"
            element={
              <LLMProvider>
                <NotesLayout />
              </LLMProvider>
            }
          >
            <Route index element={<NotesEmptyState />} />
            {/* For backward compatibility - redirect to default user */}
            <Route path=":id" element={<NoteEditor />} />

            {/* New nested user/note structure */}
            <Route path=":userId">
              <Route index element={<NotesWelcome />} />
              <Route path=":noteId" element={<NoteEditor />} />
            </Route>
          </Route>

          {/* Shared Note View Route */}
          <Route path="/shared/:noteId" element={<SharedNoteView />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
