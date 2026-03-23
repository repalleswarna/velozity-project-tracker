# Project Management UI

A production-grade React + TypeScript project management application with Kanban, List, and Timeline views.

## Features

- **Three Views**: Kanban board, sortable list with virtual scrolling, and timeline visualization
- **500 Tasks**: Pre-generated with realistic data including priorities, due dates, and assignees
- **Custom Drag & Drop**: Pointer-based implementation for moving tasks between columns
- **Virtual Scrolling**: Custom implementation for smooth performance with 500+ tasks
- **URL Sync**: Filters and view state synced to URL query parameters
- **Real-time Collaboration**: Simulated users moving between tasks
- **Smart Filtering**: Instant filtering by status, priority, assignee, and date range
- **Responsive Design**: Tailwind CSS with no external UI libraries

## Tech Stack

- **React 19** with TypeScript (strict mode)
- **Zustand** for state management
- **Tailwind CSS v4** with Vite plugin
- **Vite** for build tooling

## Architecture

### State Management

The application uses Zustand for centralized state management with a single store (`src/store/useStore.ts`):

- **tasks**: Array of 500 pre-generated tasks (generated once on initialization)
- **users**: Array of 12 users with unique colors and initials
- **filters**: Current filter state (status, priority, assignee, date range)
- **uiState**: View type and sorting configuration
- **activeUsers**: Map tracking which users are viewing which tasks

All views consume the same dataset - no refetching or duplication. Filters are applied via the `useFilteredTasks` hook which uses `useMemo` for performance.

### URL Synchronization

Filters and view state are synced to URL query parameters (`src/utils/urlSync.ts`):

- Changes to filters/view immediately update the URL
- On page load, state is restored from URL parameters
- Enables sharing filtered views via URL

### Drag and Drop Implementation

Custom pointer-based drag and drop (`src/hooks/useDragAndDrop.ts`):

1. **Pointer Events**: Uses `onPointerDown`, `onPointerMove`, `onPointerUp` for cross-device support
2. **Pointer Capture**: Ensures events are captured even when cursor leaves element
3. **Visual Feedback**:
   - Dragged card follows cursor with offset
   - Placeholder shown in target column
   - Drop zone highlighting
   - Snap back animation on invalid drop
4. **Touch Support**: Works on touch devices via pointer events API

Key features:

- No external libraries
- Smooth 60fps dragging
- Layout shift prevention with placeholders
- Visual feedback for valid/invalid drop zones

### Virtual Scrolling

Custom virtual scrolling implementation (`src/hooks/useVirtualScroll.ts`) for the list view:

1. **Visible Window**: Only renders rows visible in viewport + buffer
2. **Buffer Zone**: 5 rows above/below viewport to prevent flickering
3. **Absolute Positioning**: Items positioned absolutely within container
4. **Scroll Tracking**: Updates visible range on scroll events
5. **Performance**: Handles 500+ items smoothly at 60fps

Formula:

```
startIndex = floor(scrollTop / itemHeight) - overscan
endIndex = floor((scrollTop + containerHeight) / itemHeight) + overscan
```

### Component Structure

```
src/
├── components/
│   ├── Avatar.tsx              # User avatar with initials
│   ├── AvatarStack.tsx         # Stacked avatars for multiple users
│   ├── PriorityBadge.tsx       # Priority indicator
│   ├── DueDateLabel.tsx        # Due date with overdue logic
│   ├── TaskCard.tsx            # Reusable task card
│   ├── KanbanView.tsx          # Kanban board with drag & drop
│   ├── ListView.tsx            # Virtual scrolled table
│   ├── TimelineView.tsx        # Timeline visualization
│   ├── Filters.tsx             # Filter controls
│   └── Header.tsx              # Top navigation
├── hooks/
│   ├── useDragAndDrop.ts       # Drag & drop logic
│   ├── useFilteredTasks.ts     # Filtering & sorting
│   └── useVirtualScroll.ts     # Virtual scrolling
├── store/
│   └── useStore.ts             # Zustand store
├── utils/
│   ├── dataGenerator.ts        # Generate 500 tasks
│   ├── dateUtils.ts            # Date formatting & logic
│   └── urlSync.ts              # URL parameter sync
├── types.ts                    # TypeScript definitions
└── App.tsx                     # Main component
```

### Performance Optimizations

1. **Memoization**: All components wrapped with `React.memo`
2. **useMemo**: Expensive computations cached (filtering, sorting, user maps)
3. **useCallback**: Event handlers memoized to prevent re-renders
4. **Virtual Scrolling**: Only renders visible items
5. **Efficient Updates**: Zustand updates only affected components

### Edge Cases Handled

- Empty states for all views
- Tasks without start dates (shown as markers in timeline)
- Overdue tasks with day count (>7 days shows number)
- "Due Today" label for tasks due today
- Multiple users on same task (avatar stacking)
- Invalid drag operations (snap back)
- Date range filtering edge cases

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Deploy (auto-detected as Vite project)

Build settings:

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### Performance

Expected Lighthouse scores:

- Performance: >85
- Accessibility: >90
- Best Practices: >90
- SEO: >90

Optimizations:

- Code splitting via Vite
- Tree shaking
- Minification
- Virtual scrolling for large lists
- Memoized components

## Usage

### Views

- **Kanban**: Drag tasks between columns (To Do, In Progress, In Review, Done)
- **List**: Sort by clicking column headers, change status via dropdown
- **Timeline**: Horizontal timeline with month grid, tasks shown as bars

### Filters

- **Status**: Filter by task status (multi-select)
- **Priority**: Filter by priority level (multi-select)
- **Assignee**: Filter by assigned user (multi-select)
- **Date Range**: Filter by due date range

Filters apply instantly and sync to URL.

### Collaboration

Simulated users (2-4) randomly move between tasks every 5 seconds. Active users shown:

- In task cards (avatar stack)
- In list view (active column)
- In header (total count + avatars)

## TypeScript

Strict mode enabled with no `any` types. All components, hooks, and utilities fully typed.

## License

MIT
