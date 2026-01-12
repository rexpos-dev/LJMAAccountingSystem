export interface SalesUser {
  id: string;
  // Underlying Prisma model uses `name` + `uniqueId`, but for the UI we expose
  // more descriptive fields that map to these:
  //
  // - sp_id         → uniqueId
  // - complete_name → name
  //
  // `username` can be stored separately if/when the backend supports it.
  name: string;
  uniqueId: string;
  sp_id?: string;
  username?: string;
  complete_name?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
