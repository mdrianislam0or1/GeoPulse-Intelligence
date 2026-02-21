/**
 * IUserDocument type — matches what the auth middleware attaches to req.user.
 * The full Mongoose document is in auth.model.ts; this is the express-facing slice.
 */
export interface IUserDocument {
  userId: string;
  email: string;
  role: string;
}
