import { db } from "../database"

export const migrate_profile_data = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS profile_data (
      data_name TEXT PRIMARY KEY,
      data_value TEXT DEFAULT ''
    );
  `,
  (error) => {
    if(error) {
      console.error(error.message)
    }
    console.log('profile_data table created successfully')
  })
}