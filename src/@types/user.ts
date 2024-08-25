import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: any;
        name: string;
        email: string;
        verified: boolean;
        avatar?: string;
      };
      token?: string;
    }
  }
}

export interface CreateUser extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}
export interface LoginUser extends Request {
  body: {
    email: string;
    password: string;
  };
}
export interface VerifyEmailRequest extends Request {
  body: {
    userId: string;
    token: string;
  };
}

export interface CreateUserRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
  };
}
