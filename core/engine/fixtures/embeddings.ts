export type Cluster = "tech" | "food" | "emotion" | "nature" | "music" | "finance" | "sport" | "travel"

export interface ClusterAnchor {
  cluster: Cluster
  cx: number
  cy: number
}

export const CLUSTER_ANCHORS: Record<Cluster, ClusterAnchor> = {
  tech: { cluster: "tech", cx: -0.7, cy: 0.65 },
  food: { cluster: "food", cx: 0.75, cy: 0.6 },
  emotion: { cluster: "emotion", cx: -0.05, cy: -0.85 },
  nature: { cluster: "nature", cx: 0.6, cy: -0.55 },
  music: { cluster: "music", cx: -0.75, cy: -0.05 },
  finance: { cluster: "finance", cx: 0.05, cy: 0.85 },
  sport: { cluster: "sport", cx: -0.45, cy: -0.65 },
  travel: { cluster: "travel", cx: 0.7, cy: 0.05 },
}

export type EmbeddingSource = "index" | "keyword" | "fallback"

export interface PhraseVector {
  phrase: string
  cluster: Cluster
  x: number
  y: number
  source: EmbeddingSource
}

const RAW: Array<[string, Cluster, number, number]> = [
  ["code", "tech", -0.72, 0.62],
  ["programming", "tech", -0.68, 0.7],
  ["software", "tech", -0.65, 0.6],
  ["algorithm", "tech", -0.78, 0.58],
  ["server", "tech", -0.6, 0.7],
  ["database", "tech", -0.55, 0.62],
  ["cloud", "tech", -0.62, 0.78],
  ["docker", "tech", -0.5, 0.68],
  ["kubernetes", "tech", -0.45, 0.72],
  ["python", "tech", -0.7, 0.5],
  ["javascript", "tech", -0.66, 0.45],
  ["typescript", "tech", -0.7, 0.4],

  ["pizza", "food", 0.78, 0.62],
  ["sushi", "food", 0.7, 0.55],
  ["pasta", "food", 0.82, 0.58],
  ["burger", "food", 0.72, 0.66],
  ["salad", "food", 0.65, 0.62],
  ["coffee", "food", 0.75, 0.5],
  ["bread", "food", 0.8, 0.55],
  ["chocolate", "food", 0.85, 0.6],
  ["dinner", "food", 0.7, 0.6],
  ["cooking", "food", 0.78, 0.7],

  ["happy", "emotion", -0.05, -0.88],
  ["sad", "emotion", 0.0, -0.82],
  ["angry", "emotion", -0.1, -0.92],
  ["anger", "emotion", -0.12, -0.9],
  ["love", "emotion", 0.05, -0.78],
  ["fear", "emotion", -0.08, -0.86],
  ["joy", "emotion", 0.02, -0.84],
  ["calm", "emotion", 0.0, -0.74],

  ["forest", "nature", 0.62, -0.55],
  ["mountain", "nature", 0.55, -0.6],
  ["ocean", "nature", 0.65, -0.48],
  ["river", "nature", 0.6, -0.52],
  ["tree", "nature", 0.58, -0.58],
  ["flower", "nature", 0.7, -0.5],
  ["sky", "nature", 0.5, -0.5],
  ["sun", "nature", 0.55, -0.45],

  ["music", "music", -0.78, -0.05],
  ["guitar", "music", -0.72, -0.02],
  ["drums", "music", -0.8, 0.02],
  ["song", "music", -0.7, -0.08],
  ["band", "music", -0.76, 0.05],
  ["concert", "music", -0.74, 0.0],
  ["metal", "music", -0.82, 0.08],
  ["rock", "music", -0.78, 0.05],

  ["money", "finance", 0.05, 0.88],
  ["stock", "finance", 0.08, 0.82],
  ["market", "finance", 0.02, 0.85],
  ["bank", "finance", 0.05, 0.8],
  ["investment", "finance", 0.1, 0.86],
  ["crypto", "finance", 0.0, 0.88],
  ["bitcoin", "finance", -0.02, 0.84],
  ["trading", "finance", 0.06, 0.78],

  ["soccer", "sport", -0.45, -0.68],
  ["football", "sport", -0.42, -0.6],
  ["basketball", "sport", -0.5, -0.62],
  ["tennis", "sport", -0.45, -0.7],
  ["running", "sport", -0.4, -0.65],
  ["gym", "sport", -0.5, -0.58],
  ["workout", "sport", -0.48, -0.62],

  ["travel", "travel", 0.7, 0.05],
  ["airport", "travel", 0.72, 0.08],
  ["beach", "travel", 0.65, 0.02],
  ["hotel", "travel", 0.7, -0.02],
  ["city", "travel", 0.74, 0.05],
  ["tourist", "travel", 0.72, 0.0],
  ["vacation", "travel", 0.68, 0.08],
]

export const PHRASE_VECTORS: PhraseVector[] = RAW.map(([phrase, cluster, x, y]) => ({
  phrase,
  cluster,
  x,
  y,
  source: "index",
}))

export const PHRASE_INDEX: Map<string, PhraseVector> = new Map(
  PHRASE_VECTORS.map((p) => [p.phrase.toLowerCase(), p]),
)

const CLUSTER_KEYWORDS: Record<Cluster, string[]> = {
  tech: [
    "code", "program", "soft", "tech", "data", "comput", "cpu", "gpu", "web", "api", "dev",
    "phone", "mobile", "laptop", "tablet", "screen", "keyboard", "mouse", "internet", "wifi",
    "smart", "app", "robot", "ai", "machine learning", "ml", "algorith", "digital", "cyber",
    "hardware", "device", "router", "network", "linux", "windows", "mac", "android", "ios",
    "github", "git ", "stack", "frontend", "backend", "fullstack", "engineer",
  ],
  food: [
    "food", "eat", "cook", "meal", "drink", "tea", "cake", "fruit", "veg", "vegetable",
    "pizza", "burger", "pasta", "rice", "chicken", "beef", "pork", "fish", "salad", "soup",
    "coffee", "wine", "beer", "snack", "spice", "bread", "cheese", "dessert", "lunch", "breakfast", "restaurant", "kitchen",
  ],
  emotion: [
    "feel", "happy", "sad", "love", "hate", "angr", "anger", "joy", "fear", "calm", "stress",
    "anxi", "depress", "excite", "boring", "lonely", "peace", "smile", "cry", "laugh",
    "frustr", "worry", "proud", "shame", "guilt", "grief", "hope",
  ],
  nature: [
    "tree", "natur", "river", "ocean", "sea ", "lake", "mountain", "hill", "forest", "jungle",
    "sky", "earth", "rain", "wind", "storm", "snow", "ice", "cloud", "fog",
    "sun", "moon", "star", "flower", "plant", "leaf", "grass", "animal", "bird", "fish",
    "weather", "season",
  ],
  music: [
    "music", "song", "guitar", "drum", "band", "rock", "metal", "jazz", "concert",
    "piano", "violin", "bass", "vocal", "singer", "album", "melody", "rhythm", "beat",
    "pop ", "classic", "opera", "punk", "indie", "hiphop", "rap ", "tune", "lyric",
  ],
  finance: [
    "money", "bank", "invest", "stock", "crypto", "bitcoin", "market", "trade", "wealth",
    "dollar", "euro", "tax", "loan", "debt", "income", "salary", "fund", "etf", "asset",
    "profit", "revenue", "budget", "saving", "expense", "interest", "share", "broker",
  ],
  sport: [
    "sport", "ball", "run", "gym", "fit", "team", "play", "exerc",
    "soccer", "football", "basket", "tennis", "swim", "cycl", "bike", "race", "marathon",
    "boxing", "yoga", "athlet", "olympic", "champion", "stadium", "coach", "league", "score",
  ],
  travel: [
    "travel", "trip", "flight", "hotel", "tour", "city", "beach", "vacation", "airport",
    "passport", "visa", "luggage", "hostel", "resort", "destination", "country", "abroad",
    "japan", "brazil", "argentina", "chile", "peru", "mexico", "usa", "america", "canada",
    "france", "spain", "italy", "germany", "portugal", "england", "uk ", "russia", "china",
    "korea", "india", "australia", "egypt", "morocco",
    "london", "paris", "tokyo", "rio", "berlin", "rome", "madrid", "lisbon", "seoul", "dubai",
  ],
}

function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function guessCluster(phrase: string): { cluster: Cluster; source: EmbeddingSource } {
  const lower = phrase.toLowerCase()
  for (const [cluster, keywords] of Object.entries(CLUSTER_KEYWORDS) as [Cluster, string[]][]) {
    if (keywords.some((kw) => lower.includes(kw))) return { cluster, source: "keyword" }
  }
  const clusters = Object.keys(CLUSTER_ANCHORS) as Cluster[]
  return { cluster: clusters[hash(lower) % clusters.length], source: "fallback" }
}

export function resolveEmbedding(phrase: string): PhraseVector {
  const key = phrase.trim().toLowerCase()
  const direct = PHRASE_INDEX.get(key)
  if (direct) return direct

  const { cluster, source } = guessCluster(key)
  const anchor = CLUSTER_ANCHORS[cluster]
  const h = hash(key)
  const jitterX = (((h & 0xff) / 255) - 0.5) * 0.18
  const jitterY = ((((h >> 8) & 0xff) / 255) - 0.5) * 0.18
  return {
    phrase,
    cluster,
    x: anchor.cx + jitterX,
    y: anchor.cy + jitterY,
    source,
  }
}

export function cosineSimilarity(a: PhraseVector, b: PhraseVector): number {
  const dot = a.x * b.x + a.y * b.y
  const magA = Math.sqrt(a.x * a.x + a.y * a.y)
  const magB = Math.sqrt(b.x * b.x + b.y * b.y)
  if (magA === 0 || magB === 0) return 0
  return dot / (magA * magB)
}
