# Light Note Database Context - Senior-Level Architecture

## 🏗️ **Folder Structure Overview**

This database layer follows **senior-level enterprise patterns** with proper separation of concerns:

```
src/
├── types/database/                    # 📋 Type Definitions (Thematic Separation)
│   ├── entities.ts                   # Core data models (Note, Folder, etc.)
│   ├── filters.ts                    # Query filters and search types
│   ├── providers.ts                  # Provider interfaces and contracts
│   ├── events.ts                     # Real-time events and subscriptions
│   ├── errors.ts                     # Comprehensive error handling
│   └── index.ts                      # Clean type exports
│
├── context/database/                  # 🔌 Database Implementation Layer
│   ├── providers/                    # Database provider implementations
│   │   ├── dexie-provider.ts        # Local IndexedDB via Dexie
│   │   └── supabase-provider.ts     # Cloud provider (future)
│   │
│   ├── factories/                    # Provider management and creation
│   │   └── database-factory.ts      # Singleton factory for providers
│   │
│   ├── hooks/                        # React integration hooks
│   │   └── use-database.ts          # Database context hooks
│   │
│   ├── database-provider.tsx         # React context provider
│   ├── index.ts                      # Main exports
│   └── README.md                     # This documentation
│
└── store/                            # 🗃️ Zustand Stores (Database-Aware)
    ├── database-notes-store.ts       # Notes with persistence
    ├── database-folders-store.ts     # Folders with persistence
    └── database-search-store.ts      # Search history with persistence
```

## 🎯 **Key Senior-Level Design Patterns**

### 1. **Separation of Concerns**
- **Types**: Pure TypeScript interfaces, no business logic
- **Providers**: Database-specific implementations
- **Context**: React integration layer
- **Stores**: Application state management
- **Hooks**: Reusable React logic

### 2. **Interface Segregation**
- Each provider implements the same `IDatabaseProvider` interface
- Types are split thematically (entities, filters, events, errors)
- Clean boundaries between UI and data layers

### 3. **Dependency Inversion**
- High-level modules depend on abstractions, not concretions
- Database factory manages provider lifecycle
- Easy to swap providers without changing application code

### 4. **Single Responsibility**
- Each file has one clear purpose
- Provider handles only database operations
- Context handles only React integration
- Stores handle only state management

## 🚀 **Usage Examples**

### Basic Setup
```typescript
// 1. Wrap your app
import { DatabaseProvider } from '@/context/database'

function App() {
  return (
    <DatabaseProvider defaultConfig={{ provider: 'dexie' }}>
      <YourApp />
    </DatabaseProvider>
  )
}

// 2. Use in components
import { useDatabase, useDatabaseNotesStore } from '@/context/database'

function NotesComponent() {
  const { provider, state } = useDatabase()
  const { notes, loadNotes, addNote } = useDatabaseNotesStore()
  
  useEffect(() => {
    if (provider) {
      useDatabaseNotesStore.getState().setDatabase(provider)
      loadNotes('user-123')
    }
  }, [provider])
  
  return <div>{notes.length} notes loaded</div>
}
```

### Advanced Provider Switching
```typescript
import { useDatabase } from '@/context/database'

function ProviderSwitcher() {
  const { switchProvider, state } = useDatabase()
  
  const handleSwitchToCloud = async () => {
    await switchProvider('supabase', {
      url: 'https://your-project.supabase.co',
      anonKey: 'your-anon-key',
      enableRealtime: true
    })
  }
  
  const handleSwitchToLocal = async () => {
    await switchProvider('dexie', {
      databaseName: 'MyNotesDB',
      enableCache: true
    })
  }
  
  return (
    <div>
      <p>Current: {state.currentProvider}</p>
      <button onClick={handleSwitchToLocal}>Use Local Storage</button>
      <button onClick={handleSwitchToCloud}>Use Cloud Storage</button>
    </div>
  )
}
```

### Type-Safe Operations
```typescript
import type { 
  Note, 
  CreateNoteInput, 
  NoteFilters,
  DatabaseOperationResult 
} from '@/types/database'

// Type-safe note creation
const createNote = async (noteData: CreateNoteInput): Promise<Note | null> => {
  const { execute } = useDatabaseOperation<Note>()
  
  return await execute(async (db) => {
    return await db.createNote(noteData)
  })
}

// Type-safe filtering
const searchNotes = async (filters: NoteFilters): Promise<Note[]> => {
  const { execute } = useDatabaseOperation<Note[]>()
  
  return await execute(async (db) => {
    return await db.getNotes(filters)
  }) || []
}
```

## 🔧 **Provider Implementation Guide**

### Creating a New Provider

1. **Implement the Interface**:
```typescript
// providers/custom-provider.ts
import type { IDatabaseProvider } from '@/types/database'

export class CustomProvider implements IDatabaseProvider {
  async initialize(): Promise<void> { /* ... */ }
  async createNote(note: CreateNoteInput): Promise<Note> { /* ... */ }
  // ... implement all interface methods
}
```

2. **Register in Factory**:
```typescript
// factories/database-factory.ts
case 'custom':
  provider = new CustomProvider(config.options)
  break
```

3. **Add Type Support**:
```typescript
// types/database/providers.ts
export type DatabaseProvider = 'dexie' | 'supabase' | 'custom'

export interface CustomProviderConfig extends BaseProviderConfig {
  customOption?: string
}
```

## 📊 **Performance Optimizations**

### 1. **Lazy Loading**
```typescript
// Providers are only loaded when needed
const factory = DatabaseFactory.getInstance()
const provider = await factory.createProvider(config) // Lazy instantiation
```

### 2. **Connection Pooling**
```typescript
// Factory reuses existing connections
const sameProvider = await factory.createProvider(sameConfig) // Returns existing
```

### 3. **Type-Level Optimizations**
```typescript
// Compile-time type checking prevents runtime errors
const note: Note = await provider.createNote(noteData) // Type-safe
```

### 4. **Optimized Queries**
```typescript
// Proper indexing and filtering at database level
const notes = await provider.getNotes({
  userId: 'user-123',
  folderId: 'folder-456',
  limit: 20
}) // Uses composite indexes
```

## 🛡️ **Error Handling Strategy**

### 1. **Structured Error Types**
```typescript
import { 
  DatabaseError, 
  NotFoundError, 
  ValidationError,
  isRetryableError 
} from '@/types/database'

try {
  await provider.createNote(noteData)
} catch (error) {
  if (error instanceof ValidationError) {
    // Handle validation issues
    console.log(`Field ${error.field}: ${error.message}`)
  } else if (isRetryableError(error)) {
    // Retry the operation
    setTimeout(() => retry(), error.retryAfterMs || 1000)
  }
}
```

### 2. **Graceful Degradation**
```typescript
const { execute, error, isLoading } = useDatabaseOperation()

if (error) {
  return <ErrorBoundary error={error} />
}

if (isLoading) {
  return <LoadingSpinner />
}
```

## 🔄 **Migration Strategy**

### From Old Structure to New Structure

1. **Update Imports**:
```typescript
// Before
import { Note } from '@/lib/database/types'

// After  
import type { Note } from '@/types/database'
```

2. **Update Provider Usage**:
```typescript
// Before
const factory = new DatabaseFactory()

// After
const factory = DatabaseFactory.getInstance()
```

3. **Update Store Integration**:
```typescript
// Before
const { notes } = useNotesStore()

// After
const { provider } = useDatabase()
const { notes } = useDatabaseNotesStore()

useEffect(() => {
  if (provider) {
    useDatabaseNotesStore.getState().setDatabase(provider)
  }
}, [provider])
```

## 🧪 **Testing Strategy**

### 1. **Unit Tests**
```typescript
// Test provider implementations
describe('DexieProvider', () => {
  it('should create notes', async () => {
    const provider = new DexieProvider()
    await provider.initialize()
    
    const note = await provider.createNote({
      userId: 'test',
      title: 'Test Note',
      content: 'Content',
      tags: [],
      isPinned: false
    })
    
    expect(note.id).toBeDefined()
    expect(note.title).toBe('Test Note')
  })
})
```

### 2. **Integration Tests**
```typescript
// Test complete flow
describe('Database Integration', () => {
  it('should switch providers seamlessly', async () => {
    const factory = DatabaseFactory.getInstance()
    
    const dexieProvider = await factory.createProvider({ provider: 'dexie' })
    await dexieProvider.createNote(testNote)
    
    const supabaseProvider = await factory.switchProvider({ provider: 'supabase' })
    const notes = await supabaseProvider.getNotes()
    
    expect(notes).toContain(testNote)
  })
})
```

### 3. **Component Tests**
```typescript
// Test React integration
describe('Database Context', () => {
  it('should provide database to components', () => {
    const { result } = renderHook(() => useDatabase(), {
      wrapper: ({ children }) => (
        <DatabaseProvider defaultConfig={{ provider: 'dexie' }}>
          {children}
        </DatabaseProvider>
      )
    })
    
    expect(result.current.provider).toBeDefined()
    expect(result.current.state.isConnected).toBe(true)
  })
})
```

## 🚀 **Future Enhancements**

### 1. **Multi-Provider Sync**
```typescript
// Sync data between providers
const syncManager = new MultiProviderSyncManager([dexieProvider, supabaseProvider])
await syncManager.syncAll()
```

### 2. **Advanced Caching**
```typescript
// Redis-like caching layer
const cachedProvider = new CachedProvider(baseProvider, {
  ttl: 60000,
  maxSize: 1000
})
```

### 3. **Real-time Collaboration**
```typescript
// WebSocket-based real-time updates
const realtimeProvider = new RealtimeProvider(supabaseProvider, {
  enablePresence: true,
  enableBroadcast: true
})
```

## 📚 **Best Practices**

### 1. **Type Safety First**
- Always use TypeScript strict mode
- Prefer interfaces over types for extensibility
- Use branded types for IDs

### 2. **Error Boundaries**
- Wrap database operations in try-catch
- Use structured error types
- Implement retry mechanisms

### 3. **Performance**
- Batch operations when possible
- Use proper indexing
- Implement pagination for large datasets

### 4. **Security**
- Validate all inputs
- Sanitize user data
- Use parameterized queries

### 5. **Maintainability**
- Keep providers stateless
- Use dependency injection
- Write comprehensive tests

This architecture provides a **enterprise-grade, scalable, and maintainable** database layer that can grow with your application's needs while maintaining clean separation of concerns and type safety throughout.