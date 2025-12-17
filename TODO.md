# TODO: Implement Stock Products Table Enhancements

## Tasks
- [x] Rename dialog title from "External Products" to "Stock Products" in `src/components/inventory/inventory-dialog.tsx`
- [x] Modify `useExternalProducts` hook in `src/hooks/use-products.ts` to accept pagination parameters (page, limit) and fetch with offset
- [x] Add pagination controls below the table in `src/components/inventory/inventory-dialog.tsx` using a pagination component
- [x] Add a new first column "Action" with radio buttons for each row in the table for edit/view/update actions
- [x] Add an "Add Products" button in the dialog header section
- [x] Add a "Close" button at the bottom of the dialog content

## Followup Steps
- [ ] Test pagination functionality
- [ ] Implement handlers for radio button actions (edit/view/update) - currently placeholders
- [ ] Implement handler for "Add Products" button - currently a placeholder
