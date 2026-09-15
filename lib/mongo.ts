import { MongoClient, ServerApiVersion, Db, Collection, Document } from "mongodb"

/**
 * The connect *promise* is cached, not the resolved Db.
 *
 * Caching the resolved value meant every request arriving before the first
 * connect() settled missed the cache and constructed its own MongoClient — a
 * connection storm on any cold start. Caching the promise makes concurrent
 * callers await the same connection.
 *
 * It hangs off globalThis so Next's dev HMR reuses one client across reloads
 * instead of leaking one per reload.
 */
const globalForMongo = globalThis as typeof globalThis & {
  __mongoDbPromise?: Promise<Db>
}

export function getMongoDb(): Promise<Db> {
  if (globalForMongo.__mongoDbPromise) return globalForMongo.__mongoDbPromise

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

  const dbName = process.env.MONGODB_DB || "resume_builder"

  globalForMongo.__mongoDbPromise = client
    .connect()
    .then((connected) => connected.db(dbName))
    .catch((error) => {
      // Do not cache a failed connection, or the process can never recover.
      globalForMongo.__mongoDbPromise = undefined
      throw error
    })

  return globalForMongo.__mongoDbPromise
}

export function getCollection<TSchema extends Document = Document>(db: Db, name: string): Collection<TSchema> {
  return db.collection<TSchema>(name)
}


