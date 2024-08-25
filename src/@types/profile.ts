import { Request } from "express";

export interface ProfilePic extends Request {
  body: {
    avatarUrl: string;
    publicId: string;
  };
}

// export interface UpdateProfile extends Request{
//   body:{
//     name?: string;
//   }
// }
