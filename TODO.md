# TODO: Replace "number" with "accnt_no" in Account Model

## Tasks
- [x] Update `prisma/schema.prisma` to change field name from "number" to "accnt_no"
- [x] Update `src/app/api/accounts/route.ts` to use "accnt_no" instead of "number"
- [x] Update `src/lib/database.ts` to change "number" to "accnt_no" in types and queries
- [x] Run Prisma migration to update database schema
- [x] Regenerate Prisma client
- [ ] Test account creation and updates
