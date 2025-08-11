import { MongoClient, ServerApiVersion, Db, Collection } from "mongodb"

let cachedClient: MongoClient | null = null
let cachedDb: Db | null = null

export async function getMongoDb(): Promise<Db> {
  if (cachedDb && cachedClient) return cachedDb

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI is not set in environment variables")
  }

  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  })

  await client.connect()
  const dbName = process.env.MONGODB_DB || "resume_builder"
  const db = client.db(dbName)

  cachedClient = client
  cachedDb = db
  return db
}

export function getCollection<TSchema = any>(db: Db, name: string): Collection<TSchema> {
  return db.collection<TSchema>(name)
}


