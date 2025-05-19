import React from "react";
import { useNotesSidebar } from "../../hooks/useNotesSidebar";
import { NotesSidebarHeader } from "./NotesSidebarHeader";
import { NotesList } from "./NotesList";
import { TagsSection } from "./TagsSection";
import { UserProfileSection } from "./UserProfileSection";
import { SearchDialog } from "./search-dialog";

export function NotesSidebar() {
  const {
    searchQuery,
    setSearchQuery,
    filterTag,
    setFilterTag,
    view,
    setView,
    searchDialogOpen,
    setSearchDialogOpen,
    settingsDialogOpen,
    setSettingsDialogOpen,
    effectiveNoteId,
    effectiveUserId,
    filteredNotes,
    allTags,
    openDeleteDialog,
    toggleTheme,
    getUserInitials,
    currentUser,
    preferences,
    handleClearFilters,
  } = useNotesSidebar();

  const sortedNotes = React.useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) {
        return -1;
      }
      if (!a.isPinned && b.isPinned) {
        return 1;
      }
      if (a.updatedAt && b.updatedAt) {
        const dateA = new Date(a.updatedAt).getTime();
        const dateB = new Date(b.updatedAt).getTime();
        return dateB - dateA;
      }
      return 0;
    });
  }, [filteredNotes]);

  return (
    <div className="flex h-full w-full flex-col">
      <NotesSidebarHeader
        view={view}
        onViewChange={setView}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        onSearchClick={() => setSearchDialogOpen(true)}
        effectiveUserId={effectiveUserId}
        filterTag={filterTag}
        onFilterTagClear={() => setFilterTag(null)}
      />

      <NotesList
        filteredNotes={sortedNotes}
        effectiveNoteId={effectiveNoteId}
        onSelectTag={setFilterTag}
        effectiveUserId={effectiveUserId}
        onOpenDeleteDialog={openDeleteDialog}
        searchQuery={searchQuery}
        filterTag={filterTag}
        onClearFilters={handleClearFilters}
      />

      <TagsSection
        allTags={allTags}
        filterTag={filterTag}
        onSelectTag={setFilterTag}
      />

      <UserProfileSection
        currentUser={currentUser}
        preferences={preferences}
        onOpenSettings={() => setSettingsDialogOpen(true)}
        settingsDialogOpen={settingsDialogOpen}
        onSettingsDialogChange={setSettingsDialogOpen}
        onToggleTheme={toggleTheme}
        getUserInitials={getUserInitials}
        allTagsLength={allTags.length}
      />

      <SearchDialog
        open={searchDialogOpen}
        onOpenChange={setSearchDialogOpen}
        userId={effectiveUserId}
      />
    </div>
  );
}
