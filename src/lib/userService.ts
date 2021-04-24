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

export const loginUser = async ({
  username,
  password,
}: any): Promise<UserCrudResponse> => {
  const {
    rows,
  } = (await db.query(
    "SELECT * FROM public.user WHERE username = $1 FETCH FIRST 1 ROWS ONLY",
    [username]
  )) as any;
  const userInDb = rows[0];

  try {
    if (userInDb && (await bcrypt.compare(password, userInDb.password))) {
      console.log("found user in db:", userInDb);
      delete userInDb.password;
      return {
        status: Status.SUCCESS,
        data: userInDb,
        token: generateAccessToken(username),
      };
    } else {
      console.log("no user matching in db");
      return { status: Status.FAILURE, error: ["incorrect password"] };
    }
  } catch (error) {
    return { status: Status.FAILURE, error: ["something screwed up"] };
  }
};
