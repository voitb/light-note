import { useRef } from "react";
import { useNoteEditor } from "@/hooks/useNoteEditor";
import { useUnsavedChangesWarning } from "@/hooks/useUnsavedChangesWarning";
import { useSaveShortcut } from "@/hooks/useSaveShortcut";
import { NoteTitleBar } from "./NoteTitleBar";
import { NoteTagsBar } from "./NoteTagsBar";
import { NoteEditorSection } from "./NoteEditorSection";
import { NoteFooterBar } from "./NoteFooterBar";
import { DeleteNoteDialog } from "./DeleteNoteDialog";

export function NoteEditor() {
  const editorRef = useRef<HTMLDivElement>(null);
  const {
    note,
    title,
    content,
    tags,
    newTag,
    lastSaved,
    isSaving,
    hasUnsavedChanges,
    isEditing,
    deleteDialogOpen,
    tagInputRef,
    handleTitleChange,
    handleContentChange,
    handleNewTagChange,
    addTag,
    handleTagKeyDown,
    removeTag,
    openDeleteDialog,
    handleDelete,
    handleSave,
    toggleEditMode,
    discardChanges,
    handlePreviewDoubleClick,
    setDeleteDialogOpen,
    isPinned,
    toggleNotePinStatus,
  } = useNoteEditor();

  useUnsavedChangesWarning(hasUnsavedChanges);
  useSaveShortcut({
    onSave: handleSave,
    onClose: toggleEditMode,
    onDiscard: discardChanges,
  });

  if (!note && !isEditing) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col h-full w-full" ref={editorRef}>
      <NoteTitleBar
        title={title}
        onTitleChange={handleTitleChange}
        isEditing={isEditing}
        toggleEditMode={toggleEditMode}
        hasUnsavedChanges={hasUnsavedChanges}
        isSaving={isSaving}
        onSave={handleSave}
        onDelete={openDeleteDialog}
        note={note}
        isPinned={isPinned}
        onTogglePin={toggleNotePinStatus}
      />
      <NoteTagsBar
        tags={tags}
        newTag={newTag}
        tagInputRef={tagInputRef}
        onNewTagChange={handleNewTagChange}
        onTagKeyDown={handleTagKeyDown}
        onAddTag={addTag}
        onRemoveTag={removeTag}
      />
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full flex flex-col">
          <NoteEditorSection
            isEditing={isEditing}
            content={isEditing ? content : note?.content || ""}
            onContentChange={handleContentChange}
            onPreviewDoubleClick={handlePreviewDoubleClick}
          />
          <NoteFooterBar lastSaved={lastSaved} noteContent={content} />
        </div>
      </div>

      <DeleteNoteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        title={title}
      />
    </div>
  );
}
