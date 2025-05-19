export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  tags: string[];
  color?: string;
}

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Welcome to LightNote",
    content: "# Welcome to LightNote\n\nThis is your first note. Here are some tips to get started:\n\n- Click on the + button to create a new note\n- Use Markdown to format your notes\n- Tag your notes for better organization\n- Pin important notes to the top\n\n## Markdown Support\n\nLightNote supports **bold**, *italic*, and `code` formatting. You can also create:\n\n- Lists\n- [Links](https://example.com)\n- And more!# Welcome to LightNote\n\nThis is your first note. Here are some tips to get started:\n\n- Click on the + button to create a new note\n- Use Markdown to format your notes\n- Tag your notes for better organization\n- Pin important notes to the top\n\n## Markdown Support\n\nLightNote supports **bold**, *italic*, and `code` formatting. You can also create:\n\n- Lists\n- [Links](https://example.com)\n- And more!# Welcome to LightNote\n\nThis is your first note. Here are some tips to get started:\n\n- Click on the + button to create a new note\n- Use Markdown to format your notes\n- Tag your notes for better organization\n- Pin important notes to the top\n\n## Markdown Support\n\nLightNote supports **bold**, *italic*, and `code` formatting. You can also create:\n\n- Lists\n- [Links](https://example.com)\n- And more!# Welcome to LightNote\n\nThis is your first note. Here are some tips to get started:\n\n- Click on the + button to create a new note\n- Use Markdown to format your notes\n- Tag your notes for better organization\n- Pin important notes to the top\n\n## Markdown Support\n\nLightNote supports **bold**, *italic*, and `code` formatting. You can also create:\n\n- Lists\n- [Links](https://example.com)\n- And more!# Welcome to LightNote\n\nThis is your first note. Here are some tips to get started:\n\n- Click on the + button to create a new note\n- Use Markdown to format your notes\n- Tag your notes for better organization\n- Pin important notes to the top\n\n## Markdown Support\n\nLightNote supports **bold**, *italic*, and `code` formatting. You can also create:\n\n- Lists\n- [Links](https://example.com)\n- And more!# Welcome to LightNote\n\nThis is your first note. Here are some tips to get started:\n\n- Click on the + button to create a new note\n- Use Markdown to format your notes\n- Tag your notes for better organization\n- Pin important notes to the top\n\n## Markdown Support\n\nLightNote supports **bold**, *italic*, and `code` formatting. You can also create:\n\n- Lists\n- [Links](https://example.com)\n- And more!# Welcome to LightNote\n\nThis is your first note. Here are some tips to get started:\n\n- Click on the + button to create a new note\n- Use Markdown to format your notes\n- Tag your notes for better organization\n- Pin important notes to the top\n\n## Markdown Support\n\nLightNote supports **bold**, *italic*, and `code` formatting. You can also create:\n\n- Lists\n- [Links](https://example.com)\n- And more!# Welcome to LightNote\n\nThis is your first note. Here are some tips to get started:\n\n- Click on the + button to create a new note\n- Use Markdown to format your notes\n- Tag your notes for better organization\n- Pin important notes to the top\n\n## Markdown Support\n\nLightNote supports **bold**, *italic*, and `code` formatting. You can also create:\n\n- Lists\n- [Links](https://example.com)\n- And more!# Welcome to LightNote\n\nThis is your first note. Here are some tips to get started:\n\n- Click on the + button to create a new note\n- Use Markdown to format your notes\n- Tag your notes for better organization\n- Pin important notes to the top\n\n## Markdown Support\n\nLightNote supports **bold**, *italic*, and `code` formatting. You can also create:\n\n- Lists\n- [Links](https://example.com)\n- And more!# Welcome to LightNote\n\nThis is your first note. Here are some tips to get started:\n\n- Click on the + button to create a new note\n- Use Markdown to format your notes\n- Tag your notes for better organization\n- Pin important notes to the top\n\n## Markdown Support\n\nLightNote supports **bold**, *italic*, and `code` formatting. You can also create:\n\n- Lists\n- [Links](https://example.com)\n- And more!",
    createdAt: "2023-05-15T12:00:00Z",
    updatedAt: "2023-05-15T12:00:00Z",
    isPinned: true,
    tags: ["getting-started", "tutorial"]
  },
  {
    id: "2",
    title: "Meeting Notes: Product Launch",
    content: "# Product Launch Meeting\n\n**Date**: June 10, 2023\n**Attendees**: John, Sarah, Michael, Emma\n\n## Agenda\n\n1. Review marketing materials\n2. Finalize launch date\n3. Assign responsibilities\n\n## Action Items\n\n- [ ] Sarah: Complete press release by Friday\n- [ ] Michael: Review website copy\n- [ ] Emma: Prepare social media schedule\n- [ ] John: Confirm venue for launch event",
    createdAt: "2023-06-10T14:30:00Z",
    updatedAt: "2023-06-11T09:15:00Z",
    isPinned: false,
    tags: ["meetings", "product-launch"]
  },
  {
    id: "3",
    title: "Book Recommendations",
    content: "# Books to Read\n\n## Fiction\n\n- The Midnight Library by Matt Haig\n- Project Hail Mary by Andy Weir\n- Klara and the Sun by Kazuo Ishiguro\n\n## Non-Fiction\n\n- Atomic Habits by James Clear\n- Four Thousand Weeks by Oliver Burkeman\n- The Psychology of Money by Morgan Housel",
    createdAt: "2023-04-22T18:45:00Z",
    updatedAt: "2023-07-02T11:20:00Z",
    isPinned: false,
    tags: ["books", "recommendations", "reading-list"]
  },
  {
    id: "4",
    title: "Weekly Goals",
    content: "# Goals for This Week\n\n## Work\n\n- Complete project proposal\n- Review team metrics\n- Schedule quarterly planning meeting\n\n## Personal\n\n- Run 5k three times\n- Meditate for 10 minutes daily\n- Call mom on Wednesday\n\n## Learning\n\n- Finish React course module 3\n- Read one chapter of TypeScript book",
    createdAt: "2023-07-03T08:00:00Z",
    updatedAt: "2023-07-03T08:00:00Z",
    isPinned: true,
    tags: ["goals", "planning", "productivity"]
  },
  {
    id: "5",
    title: "Recipe: Pasta with Garlic and Oil",
    content: "# Pasta Aglio e Olio\n\n## Ingredients\n\n- 1 pound (450g) spaghetti\n- 6 cloves garlic, thinly sliced\n- 1/2 cup extra virgin olive oil\n- 1/4 teaspoon red pepper flakes\n- 1/4 cup chopped fresh parsley\n- 1/2 cup grated Parmesan cheese\n- Salt and black pepper to taste\n\n## Instructions\n\n1. Bring a large pot of salted water to boil and cook pasta until al dente\n2. While pasta cooks, heat olive oil in a large pan over medium heat\n3. Add garlic and red pepper flakes, cook until garlic is golden (2-3 minutes)\n4. Reserve 1/2 cup pasta water, then drain pasta\n5. Add pasta to the pan with garlic oil, toss to coat\n6. Add pasta water as needed to create a light sauce\n7. Remove from heat, add parsley and cheese, toss again\n8. Season with salt and pepper",
    createdAt: "2023-03-10T19:25:00Z",
    updatedAt: "2023-03-10T19:45:00Z",
    isPinned: false,
    tags: ["recipes", "food", "italian"]
  },
  {
    id: "6",
    title: "Travel Packing List",
    content: "# Travel Packing List\n\n## Essentials\n\n- Passport/ID\n- Wallet and cards\n- Phone and charger\n- Medications\n- Travel insurance documents\n\n## Clothing\n\n- 5x t-shirts\n- 2x pants/shorts\n- 1x light jacket\n- Underwear and socks\n- Comfortable walking shoes\n- Sleepwear\n\n## Toiletries\n\n- Toothbrush and toothpaste\n- Deodorant\n- Shampoo/conditioner\n- Sunscreen\n- Basic first aid items",
    createdAt: "2023-05-20T15:10:00Z",
    updatedAt: "2023-06-01T10:30:00Z",
    isPinned: false,
    tags: ["travel", "planning", "packing"]
  }
];

// Helper function to get a single note by ID
export function getNoteById(id: string): Note | undefined {
  return mockNotes.find(note => note.id === id);
}

// Helper function to get all notes, with pinned notes first
export function getAllNotes(): Note[] {
  return [...mockNotes].sort((a, b) => {
    // Sort by pinned status (pinned first)
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    
    // Then sort by updatedAt (newest first)
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
} 