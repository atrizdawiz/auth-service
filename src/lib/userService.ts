import db from "./pgClient";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { generateAccessToken } from "./tokenService";

dotenv.config();

export enum Status {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
interface UserCrudResponse {
  data?: any;
  error?: string[];
  status: Status;
  token?: string;
}

export const createUser = async ({
  username,
  password,
  email,
}: any): Promise<UserCrudResponse> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result: any = await db.query(
      `INSERT INTO public.user (username, password, email)
VALUES ($1, $2, $3)`,
      [username, hashedPassword, email]
    );
    const newUser: any = result.rowCount === 1 ? { username, email } : null;

    return { status: Status.SUCCESS, data: newUser };
  } catch (error) {
    return { status: Status.FAILURE, error };
  }
};

type LoginData = {
  user: string;
  password: string;
};

export const loginUser = async ({
  user,
  password,
}: LoginData): Promise<UserCrudResponse> => {
  let userInDb: any;
  const isEmail = user.includes("@");

  if (isEmail) {
    const {
      rows,
    } = (await db.query(
      "SELECT * FROM public.user WHERE email = $1 FETCH FIRST 1 ROWS ONLY",
      [user]
    )) as any;
    userInDb = rows[0];
  } else {
    const {
      rows,
    } = (await db.query(
      "SELECT * FROM public.user WHERE username = $1 FETCH FIRST 1 ROWS ONLY",
      [user]
    )) as any;
    userInDb = rows[0];
  }

  try {
    if (userInDb && (await bcrypt.compare(password, userInDb.password))) {
      delete userInDb.password;
      return {
        status: Status.SUCCESS,
        data: userInDb,
        token: generateAccessToken(user),
      };
    } else {
      return { status: Status.FAILURE, error: ["incorrect password"] };
    }
  } catch (error) {
    console.log(error);
    return { status: Status.FAILURE, error: ["something screwed up"] };
  }
};
