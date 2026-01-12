# Sales User Implementation Plan

## Database Schema
- [x] Add SalesUser model to prisma/schema.prisma with id, name, uniqueId fields

## Navigation
- [ ] Add "Sales User" to Configuration menu in src/lib/navigation.ts

## API Routes
- [x] Create src/app/api/sales-users/route.ts for CRUD operations
- [x] Implement GET, POST, PUT, DELETE handlers

## Page Component
- [ ] Create src/app/configuration/sales-users/page.tsx
- [ ] Implement table view for listing sales users
- [ ] Add buttons for add, edit, delete operations

## Dialog Components
- [ ] Create src/components/configuration/add-sales-user-dialog.tsx
- [ ] Implement form with name input and auto-generated unique ID
- [ ] Create src/components/configuration/edit-sales-user-dialog.tsx
- [ ] Create src/components/configuration/delete-sales-user-dialog.tsx

## Hooks
- [x] Create src/hooks/use-sales-users.ts for data fetching and mutations

## Types
- [ ] Add SalesUser type to src/types/sales-user.ts

## Database Migration
- [ ] Run prisma generate and migrate to create the table

## Testing
- [ ] Test adding, editing, deleting sales users
- [ ] Verify unique ID generation
