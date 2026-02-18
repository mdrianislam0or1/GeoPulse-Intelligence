// src/types/express/index.d.ts
import { IUserDocument } from '../../modules/User/user.interface'

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument
    }
  }
}
