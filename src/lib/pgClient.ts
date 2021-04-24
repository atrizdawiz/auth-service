import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export default {
  query: (text: any, params: any, callback?: any) => {
    return pool.query(text, params, callback);
  },
};
