import { db } from "./database"
import { migrate_profile_data } from "./migrations/"

export const migrate = () => {
  db.serialize(() => {
    migrate_profile_data()
  })
}

migrate()