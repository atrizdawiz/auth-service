import { user } from ".prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import prisma from "./prismaClient";
import { generateAccessToken } from "./tokenService";

dotenv.config();

export enum Status {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
interface UserCrudResponse {
  data?: user;
  error?: string[];
  status: Status;
  token?: string;
}

export const createUser = async ({
  name,
  password,
  email,
}: user): Promise<UserCrudResponse> => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        email,
      },
    });
    return { status: Status.SUCCESS, data: newUser };
  } catch (error) {
    return { status: Status.FAILURE, error: error.meta.target };
  }
};

export const loginUser = async ({
  name,
  password,
}: user): Promise<UserCrudResponse> => {
  const userInDb = await prisma.user.findUnique({ where: { name } });
  try {
    if (userInDb && (await bcrypt.compare(password, userInDb.password))) {
      delete userInDb.password;
      return {
        status: Status.SUCCESS,
        data: userInDb,
        token: generateAccessToken(name),
      };
    } else {
      return { status: Status.FAILURE, error: ["incorrect password"] };
    }
  } catch (error) {
    return { status: Status.FAILURE, error: ["something screwed up"] };
  }
};
