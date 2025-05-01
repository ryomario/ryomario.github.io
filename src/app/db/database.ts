import path from "path";
import sqlite3 from "sqlite3";

const dbPath = path.join(process.cwd(), 'profile.db')

export const db = new sqlite3.Database(
  dbPath,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (error) => {
    if(error) {
      console.log(error)
    }
    console.log('Connected to the profile.db')
  }
)

export const apiGetAll = async <T>(query: string, values: string[]) => {
  return await new Promise<T[]>((resolve, reject) => {
    db.all(query, values, (err: Error, row: T[]) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(row);
    });
  });
};

export const apiGetOne = async <T>(query: string, values: string[]) => {
  return await new Promise<T>((resolve, reject) => {
    db.get(query, values, (err: Error, row: T) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(row);
    });
  });
};
 
export const apiPost = async (query: string, values: string[]) => {
  return await new Promise<number>((resolve, reject) => {
    db.run(query, values, function (err) {
      if (err) {
        console.log(err);
        reject(err);
      }
      resolve(this.changes);
    });
  });
};