import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RootLayout } from "./components/layout/root-layout";
import { useEffect } from "react";
import { useUserStore } from "./store/user-store";
import { themeService } from "./services/themeService";
import { mockDataService } from "./services/mockDataService";
import { NotesLayout } from "./components/notes/notes-layout";
import { NoteEditor } from "./components/notes/note-editor";
import { NotesEmptyState } from "./components/notes/notes-empty-state";
import { NotesWelcome } from "./components/notes/notes-welcome";
import { SharedNoteView } from "./components/notes/shared-note-view";
import { LandingPage, AboutPage, LoginPage, RegisterPage, TermsPage, PrivacyPage, NotFoundPage } from "./pages";
import "./App.css";
import { LLMProvider } from "./context/llm/llm-provider";

function App() {
  const { preferences } = useUserStore();

  // Apply theme when component mounts or theme changes
  useEffect(() => {
    themeService.setTheme(preferences.theme);
  }, [preferences.theme]);

  // Initialize notes with mock data
  useEffect(() => {
    mockDataService.initializeNotes();
  }, []);

  return (
    <div className="w-full h-full min-h-screen mx-0 px-0 flex flex-col">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPage />} />
            <Route path="*" element={<NotFoundPage />} />
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
