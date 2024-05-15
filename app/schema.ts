import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const drizzlePosts = sqliteTable("posts", {
  id: integer("id").primaryKey(),
  uuid: text("uuid", { length: 256 }).notNull().unique(),
  title: text("title", { length: 64 }).notNull(),
  text: text("text", { length: 2048 }).notNull(),
})

export const drizzleUsers = sqliteTable("users", {
  id: integer("id").primaryKey(),
  uuid: text("uuid", { length: 256 }).notNull(),
  name: text("name", { length: 256 }).notNull(),
  email: text("email", { length: 256 }).notNull().unique(),
  login: text("login", { length: 256 }).notNull().unique(),
  hashedPassword: text("hashed_password", { length: 256 }),
  avatarIconURL: text("avatar_icon_url", { length: 256 }),
})