import type { EncyclopediaChapter } from '../domain/encyclopedia';

const geoIndexingChapter: EncyclopediaChapter = {
  id: 'geo-indexing',
  title: 'Geo-indexing and location search',
  category: 'Systems',
  summary: 'Spatial indexing structures that make proximity queries fast at planetary scale — from ride-sharing driver lookup to map tile serving to nearby-friends features.',
  problemStatement: 'A naive lat/lng table scan is O(n) and unusable beyond a few thousand records. Spatial queries — "find all drivers within 1 km" — need index structures that partition 2-D space so the database prunes irrelevant regions before evaluating distance.',
  interviewQuestion: 'Design a proximity search service that can answer "find the 10 nearest drivers to this passenger" for 5 million concurrent drivers updating location every 4 seconds.',
  coreTension: 'Precision and update throughput are in direct conflict — finer-grained indexing enables exact proximity but makes every location update more expensive.',
  levelExpectations: {
    mid: 'Knows lat/lng columns need an index. Can suggest PostGIS or a geohash column. Understands bounding-box pre-filter before exact distance.',
    senior: 'Chooses between geohash, quadtree, and S2 cells with reasoning. Handles edge cases (poles, anti-meridian). Designs a read path with bounding-box pre-filter + Haversine post-filter. Knows TTL-based expiry for stale locations.',
    staff: 'Defines the full write path — location update ingestion rate, hot-cell problem when many drivers cluster, hierarchical cell resolution tradeoffs. Frames the data model split: ephemeral position store (Redis/geospatial) vs. durable trip state (Postgres). Addresses consistency: stale reads are acceptable, dropped updates are not. Connects index choice to operational complexity and team expertise.',
  },
  coreConcepts: [
    'Geohash: base-32 encode lat/lng into a string where prefix length = precision level. Neighbors share a prefix — proximity query becomes a string prefix scan.',
    'Quadtree: recursive partitioning of 2-D space into 4 quadrants. Variable depth — dense urban areas get deeper trees. Used by Facebook Nearby.',
    'S2 cells (Google): map the sphere to a Hilbert curve, producing cell IDs where nearby cells have nearby IDs. Level 0–30, each level ~4x more precise. Used in Google Maps, Uber H3 is similar.',
    'H3 (Uber): hexagonal hierarchical indexing. Hexagons have equal-area neighbors — no corner distortion like square grids. 15 resolutions, level 9 ≈ 0.1 km².',
    'Bounding-box pre-filter: query a rectangle first (cheap), then apply Haversine or Vincenty for exact distance (expensive but on a small result set).',
    'Hot-cell problem: popular areas (city center) send disproportionate updates to the same cell partition. Solved by cell-level sharding or consistent hashing on cell ID.',
    'Spatial database extensions: PostGIS (Postgres), MongoDB $geoNear, Redis GEOADD/GEORADIUS. All use R-tree or similar internally.',
  ],
  architectureDiagram: `flowchart TD
  A[Driver App] --> B[Location Ingestion Service]
  B --> C[(Redis GEOADD TTL 30s)]
  B --> D[Kafka: location-updates]
  D --> E[(Postgres Trip State)]
  P[Passenger App] --> Q[Proximity API]
  Q --> C
  C --> R[GEORADIUS 1km radius]
  R --> S[Filter by driver status]
  S --> T[Return top-10 by Haversine]
  subgraph Sharding
    C1[Geohash prefix shard A]
    C2[Geohash prefix shard B]
    C3[Geohash prefix shard C]
  end`,
  solutionApproach: [
    'Separate the write path (location ingestion) from the read path (proximity query). Location updates are write-heavy and latency-tolerant; proximity reads are latency-sensitive.',
    'Use Redis GEOADD for ephemeral position storage with 30-60s TTL per driver — automatically expires offline drivers without a cleanup job.',
    'Choose geohash for simplicity (prefix scan, easy debugging) or S2/H3 for accuracy and neighbor computation at global scale.',
    'Fan out proximity queries to the target cell plus its 8 neighbors to avoid missing drivers near cell boundaries.',
    'Publish every location update to Kafka — decouples the ephemeral store from downstream consumers (trip analytics, surge pricing, ETA models) without blocking the write path.',
    'For very high density (millions of drivers), consistent-hash the geohash prefix to a shard. Each shard is a Redis instance owning a cell range.',
  ],
  designPatterns: [
    'Cell decomposition: divide space into addressable units before applying distance computation',
    'Ephemeral + durable split: Redis for live position, Postgres/Cassandra for trip history',
    'Fan-out to neighbors: always query cell + adjacent cells to handle boundary effects',
    'TTL-based expiry: prefer automatic expiry over explicit delete for ephemeral location data',
    'Read-your-writes via sticky routing: route the same driver\'s updates to the same Redis shard',
  ],
  tradeoffs: [
    'Geohash vs S2: geohash is simpler and human-readable; S2 has better area uniformity and avoids boundary distortion at poles. S2 is preferred for global systems.',
    'Cell size vs query cost: larger cells mean fewer shards but more post-filter work; smaller cells reduce post-filter but increase cross-cell fan-out.',
    'Redis vs PostGIS: Redis GEORADIUS is sub-millisecond but RAM-limited; PostGIS scales to disk but p99 latency is 5–50ms. For real-time location, Redis wins.',
    'Update frequency vs freshness: 4-second updates give acceptable UX; 1-second gives better accuracy but 4x the write throughput.',
    'Consistency vs availability: it is acceptable for a passenger to see a driver whose location is 4 seconds stale — eventual consistency is the right model here.',
  ],
  failureScenarios: [
    'Hot cell: a concert or stadium creates a geohash cell with 100x normal driver density. Single Redis shard becomes a bottleneck. Fix: sub-cell sharding or cell-level load shedding with overflow routing.',
    'Anti-meridian boundary: geohash cells wrap incorrectly at ±180° longitude. Fix: use S2 cells or handle the wrapping explicitly in geohash neighbor computation.',
    'Redis eviction: under memory pressure Redis evicts geospatial keys. Driver appears to vanish. Fix: set maxmemory-policy allkeys-lru with sufficient headroom, and monitor eviction rate as a SLO.',
    'Location spoofing: a driver fakes location to cherry-pick rides. Mitigation: cross-reference with GPS accuracy signal, speed plausibility checks, and trip trajectory validation.',
    'Clock skew between drivers: out-of-order location updates store a stale position. Fix: use event time (device timestamp) not server arrival time; reject updates older than the current stored timestamp.',
  ],
  productionConsiderations: [
    'Monitor GEORADIUS latency by cell density — p99 should be under 5ms for the Redis path.',
    'Set Redis maxmemory with headroom for peak driver count × average geospatial key size (~80 bytes per entry).',
    'Implement circuit breaker on the proximity service — fall back to last known position if Redis is degraded.',
    'Log every update to Kafka before writing to Redis — enables position replay for debugging and offline ETA model training.',
    'Instrument the hot-cell detector: alert when any single geohash cell exceeds 10× average update rate.',
  ],
  staffDiscussion: [
    'The choice of cell library (geohash vs H3 vs S2) is less important than defining the data model boundary: what is ephemeral (Redis, TTL-based) vs. what is durable (Postgres, append-only)?',
    'At Staff level, the interesting question is operational: who owns the spatial index in production? A Redis cluster with geospatial workload has different capacity planning than a standard cache.',
    'Connect geo-indexing to product requirements: if your SLA is "find nearest driver under 500ms end-to-end," work backwards from network latency, Redis p99, and fan-out overhead to set the budget for each layer.',
    'The hot-cell problem is an organizational signal: your index choice creates load imbalance that requires either technical mitigation or capacity pre-provisioning. Make that decision explicit.',
  ],
  relatedTopics: ['consistent-hashing', 'database-selection-sharding', 'messaging-delivery-semantics', 'capacity-estimation'],
  realWorldSystems: ['Uber (H3 hexagonal indexing, Schemaless for trips)', 'Google Maps (S2 cells)', 'Facebook Nearby Friends (quadtree + pub-sub fan-out)', 'Lyft (S2 cells)', 'Yelp (geohash + Elasticsearch geo_point)'],
  followUpQuestions: [
    'How would you handle a driver crossing from one geohash cell to another mid-query?',
    'If you needed to support polygon search (is this point inside a delivery zone?), how would your data structure change?',
    'How would you design the ETA service that consumes location updates to predict arrival time?',
    'What changes when you need to support 10 million concurrent users searching for nearby restaurants instead of drivers?',
  ],
  cheatSheet: [
    'Geohash: prefix = precision, neighbors share prefix → use for simple proximity',
    'S2/H3: sphere-native, better area uniformity, prefer for global systems',
    'Always query target cell + 8 neighbors to avoid boundary misses',
    'Redis GEOADD + GEORADIUS: sub-ms proximity queries, TTL for expiry',
    'Separate ephemeral position (Redis) from durable state (Postgres)',
    'Hot cell = geohash prefix gets disproportionate traffic → shard by sub-prefix',
    'Anti-meridian: geohash wraps incorrectly at ±180° — test explicitly',
  ],
  flashcards: [
    { question: 'What is the hot-cell problem in geo-indexing?', answer: 'A dense area (stadium, city center) causes all location updates to hash to the same cell/shard, creating a write bottleneck. Fix: sub-cell sharding or consistent hashing on a finer cell prefix.' },
    { question: 'Why query the 8 neighboring cells in addition to the target cell?', answer: 'A driver 10m across a cell boundary would be missed if you only query the target cell. Querying neighbors guarantees no nearby results are dropped at cell edges.' },
    { question: 'What does geohash length control?', answer: 'Precision: length 4 ≈ 39 km², length 6 ≈ 1.2 km², length 8 ≈ 38 m². Longer prefix = smaller, more precise cell. Neighbors share all but the last character.' },
    { question: 'Why use TTL expiry for driver positions instead of explicit deletes?', answer: 'Explicit deletes require a reliable "driver went offline" event, which can be lost. TTL expiry is self-healing — a driver who stops sending updates automatically disappears from the index after the TTL window.' },
  ],
  oneMinuteAnswer: 'Geo-indexing solves the problem of making "find nearest X" queries fast. The core idea is partitioning 2-D space into addressable cells using geohash, quadtree, S2, or H3, then doing a bounding-box cell lookup before computing exact distances. For real-time systems like ride-sharing, the architecture splits into an ephemeral position store (Redis GEOADD with TTL, sub-millisecond reads) and a durable trip store (Postgres). Queries fan out to the target cell plus 8 neighbors to avoid boundary misses. The hard problems are the hot-cell bottleneck in dense areas, anti-meridian wrapping in geohash, and balancing update frequency against write throughput.',
};

const websocketConnectionChapter: EncyclopediaChapter = {
  id: 'websocket-realtime-connections',
  title: 'WebSocket and real-time connection management',
  category: 'Architecture',
  summary: 'How to maintain millions of persistent bidirectional connections for chat, live comments, collaborative editing, and presence — and route messages to the right connection across a fleet of stateful servers.',
  problemStatement: 'HTTP is request-response: the server can only push data after the client asks. Real-time features (chat, live comments, collaborative cursors) need the server to push events without a client poll. WebSockets solve this but create a fundamentally different operational challenge: connections are stateful and long-lived, which breaks the standard stateless horizontal scaling model.',
  interviewQuestion: 'Design the messaging layer for a chat application that must deliver messages to 10 million concurrent online users with under 100ms end-to-end latency.',
  coreTension: 'WebSockets require persistent connections, which makes servers stateful — but stateful servers are hard to scale, deploy, and balance. Every architectural decision is a negotiation between connection density and operational simplicity.',
  levelExpectations: {
    mid: 'Knows WebSocket opens a persistent connection. Can sketch a single-server chat where messages are delivered in-process. Understands the need for a shared pub-sub when scaling to multiple servers.',
    senior: 'Designs a connection layer (WebSocket gateway) separate from a message-routing layer (pub-sub). Chooses Redis pub-sub or Kafka for fan-out. Handles reconnection, message ordering within a conversation, and at-least-once delivery with client-side dedup.',
    staff: 'Defines the connection tier as a distinct scaling domain: how many connections per server (typically 50k–100k per Node.js process with tuned ulimits), how to drain connections for deploys without mass disconnects, how presence works at scale. Frames the consistency question: is a message "delivered" when accepted by the server, when persisted, or when acknowledged by the recipient client? Connects protocol choice (WebSocket vs SSE vs long-poll) to client environment constraints.',
  },
  coreConcepts: [
    'WebSocket: HTTP upgrade handshake establishes a full-duplex TCP connection. After upgrade, both sides can send frames at any time without polling.',
    'Server-Sent Events (SSE): server-to-client only, over a regular HTTP response stream. Simpler than WebSocket, supported natively by browsers, auto-reconnects. Use when the client never needs to send data over the same channel.',
    'Long-poll: client sends HTTP request, server holds it open until an event occurs, then responds. Works everywhere but wastes a TCP connection per waiting client. Avoid for new systems.',
    'Connection affinity: a client\'s WebSocket connection is pinned to one server instance. When that server gets a message for the client, it can deliver directly. When a different server gets the message, it must route via shared pub-sub.',
    'Pub-sub fan-out: each WebSocket server subscribes to channels (one per conversation or user) in a broker (Redis, NATS, Kafka). When a message arrives, the broker fans it out to all servers subscribed to that channel, each of which delivers to its local connections.',
    'Presence: knowing which users are currently online. Heartbeat model: clients send a ping every 30s, server marks the user offline after 90s without a ping. Redis SET with TTL per user ID is the canonical implementation.',
    'Connection draining: when deploying a new server version, existing connections must be gracefully migrated. Send a "reconnect now" frame to clients, which triggers a new WebSocket handshake to a different server before the old one terminates.',
  ],
  architectureDiagram: `flowchart TD
  C1[Client A] & C2[Client B] --> GW1[WS Gateway 1]
  C3[Client C] --> GW2[WS Gateway 2]
  GW1 & GW2 --> MS[Message Service]
  MS --> DB[(Postgres: message log)]
  MS --> PB[(Redis Pub-Sub)]
  PB --> GW1
  PB --> GW2
  GW1 & GW2 --> HR[(Redis: presence TTL)]
  subgraph Scale
    GW1 -- 50k-100k connections --- GW1
    GW2 -- 50k-100k connections --- GW2
  end`,
  solutionApproach: [
    'Separate the connection gateway (stateful, handles WS lifecycle) from the message service (stateless, handles persistence and business logic). This lets each tier scale independently.',
    'Use Redis pub-sub for fan-out between gateway servers for low-latency (<5ms) delivery. Use Kafka if you need durable fan-out with replay capability for offline users.',
    'Store every message in a durable log (Postgres or Cassandra) before publishing to Redis — guarantees message history is never lost even if pub-sub drops a message.',
    'Assign a monotonically increasing sequence number to each message within a conversation — clients use this to detect gaps and request a backfill on reconnect.',
    'Implement presence with Redis keys (TTL-based heartbeat) rather than a database — presence changes at high frequency and eventual consistency is acceptable.',
    'Use binary WebSocket frames (MessagePack or Protobuf) instead of JSON for message payloads — reduces bandwidth and serialization overhead at high connection counts.',
  ],
  designPatterns: [
    'Gateway + broker split: WebSocket servers handle connections, a pub-sub broker routes messages between servers',
    'Fan-out on write: deliver to all conversation members as messages arrive, not on read',
    'Sequence number gap detection: clients detect and backfill missing messages on reconnect',
    'Heartbeat-based presence: TTL expiry is more reliable than explicit offline events',
    'Sticky load balancing: route reconnects from the same client to the same server to reuse TLS session cache',
  ],
  tradeoffs: [
    'WebSocket vs SSE: WebSocket is bidirectional (needed for chat); SSE is simpler and auto-reconnects but client-to-server uses separate HTTP requests. Choose SSE for notifications or live feeds where the client never sends data on the same channel.',
    'Redis pub-sub vs Kafka: Redis is lower latency (<1ms) but not durable — if a subscriber disconnects mid-message, the message is lost. Kafka is durable with replay but adds 5–20ms latency. For chat: use both — Redis for live delivery, Kafka for offline message queue.',
    'Fan-out on write vs read: fan-out on write (push to all recipients immediately) gives lower read latency but is expensive for group chats with 1000+ members. Fan-out on read (pull on open) scales better for large groups but adds latency.',
    'Connection count per server: Node.js can handle 100k connections with tuned ulimits but memory use is ~5 MB per connection at rest. At 1M connections you need 10+ gateway servers just for memory, regardless of CPU.',
    'At-least-once vs exactly-once: at-least-once delivery with client-side dedup (by message ID) is the practical choice. Exactly-once across a distributed system is expensive and rarely necessary for chat.',
  ],
  failureScenarios: [
    'Redis pub-sub drops a message: if the gateway is briefly disconnected from Redis, messages published during that window are lost. Mitigation: Kafka as the durable fan-out layer; Redis as the fast delivery path. Clients backfill from Kafka on reconnect.',
    'Mass reconnect storm: server restart causes all 50k connected clients to reconnect simultaneously. Fix: exponential backoff with jitter on the client, staggered restart with connection draining.',
    'Head-of-line blocking: a slow client receiving large messages blocks its WebSocket read loop, causing ping timeouts and spurious disconnects. Fix: use a message queue per connection with max queue depth and eviction.',
    'Presence flapping: mobile clients lose network briefly and TTL expires, making the user appear offline. Fix: grace period — show "online" for 2× the heartbeat interval before marking offline.',
    'Gateway OOM: too many connections or large in-memory queues exhaust server memory. Fix: circuit breaker that rejects new connections above a threshold; monitor connection count as a primary capacity metric.',
  ],
  productionConsiderations: [
    'Set OS-level ulimits for open file descriptors (each connection = one FD): typically 1M per server, configured in /etc/security/limits.conf.',
    'Monitor connections-per-server, message delivery latency (p50/p99), and reconnect rate as the primary WebSocket health metrics.',
    'Implement a health endpoint that reports connection count — use it to drain unhealthy servers from the load balancer without closing connections abruptly.',
    'Test connection draining under load before every deploy — mass reconnects during deploys are a common source of cascading failures.',
    'Use TLS session resumption (session tickets or session IDs) to reduce the handshake cost of client reconnects.',
  ],
  staffDiscussion: [
    'The fundamental challenge is that WebSocket connections are stateful infrastructure in a world designed for stateless services. The gateway + pub-sub architecture is the standard answer, but the interesting question is where the complexity boundary sits between the gateway and the message service.',
    'At Staff level, the reliability question matters most: what does "delivered" mean? Delivered to the server? Persisted? Acknowledged by the recipient? Define this as a product requirement first, then choose the architecture that satisfies it at acceptable cost.',
    'Connection draining strategy is often overlooked until the first deploy causes a mass reconnect event. Design it into the gateway from day one — it\'s much harder to retrofit.',
    'The choice between Redis and Kafka for fan-out should be driven by durability requirements for offline users, not latency preferences. If an offline user must receive messages on reconnect, you need a durable store regardless of Redis.',
  ],
  relatedTopics: ['messaging-delivery-semantics', 'event-driven-architecture', 'load-balancing-rate-limits', 'slo-observability-incidents'],
  realWorldSystems: ['Discord (Elixir WebSocket gateways, Cassandra for message history)', 'Slack (WebSocket gateway fleet, Kafka for fan-out)', 'WhatsApp (Ejabberd/XMPP, custom C++ for connections)', 'Figma (WebSocket + CRDT for collaborative editing)', 'Twitch (WebSocket for live chat, IRC-compatible protocol)'],
  followUpQuestions: [
    'How would your design change for a group chat with 100,000 members (a public Discord server)?',
    'How do you handle message ordering when two clients send messages simultaneously?',
    'How would you implement read receipts and typing indicators without overwhelming the system?',
    'How does your presence system handle a user with multiple devices open simultaneously?',
  ],
  cheatSheet: [
    'WebSocket = full-duplex TCP; SSE = server-to-client only (simpler, auto-reconnects)',
    'Gateway + pub-sub: WS servers handle connections, Redis/Kafka routes between servers',
    'Store message in DB before pub-sub publish — durability before delivery',
    'Sequence numbers per conversation → clients detect gaps, backfill on reconnect',
    'Presence: Redis key TTL per user, heartbeat every 30s, offline after 90s',
    'ulimit tuning: 1 FD per connection, set to 1M+ per server',
    'Connection draining: send close frame before deploy, clients reconnect with backoff+jitter',
    '100k connections ≈ 500 MB RAM — memory is the primary capacity constraint',
  ],
  flashcards: [
    { question: 'Why does a WebSocket gateway need a pub-sub broker?', answer: 'A client\'s connection is pinned to one gateway server. When a message is sent, it arrives at whichever server accepts the HTTP request — which may be different from the server holding the recipient\'s connection. The pub-sub broker (Redis/Kafka) routes the message to the right server, which then delivers it locally.' },
    { question: 'What is the connection draining problem in WebSocket deployments?', answer: 'When you restart a WebSocket server, all its connections close simultaneously, causing a mass reconnect storm. Connection draining: the load balancer stops sending new connections, the server sends close frames prompting clients to reconnect gradually, then the server shuts down after connections drain.' },
    { question: 'When would you choose SSE over WebSocket?', answer: 'When the client only needs to receive data (notifications, live feeds, status updates) and never sends data on the same channel. SSE is simpler, auto-reconnects natively, works through HTTP/2 multiplexing, and avoids the WebSocket upgrade overhead.' },
    { question: 'What is presence flapping and how do you prevent it?', answer: 'A mobile client briefly loses network, the heartbeat TTL expires, the user appears offline, the connection resumes, the user appears online again — rapidly. Prevention: show "online" for 2× the heartbeat interval before marking offline; use a grace period buffer.' },
  ],
  oneMinuteAnswer: 'WebSocket connections are full-duplex and stateful, which breaks stateless horizontal scaling. The standard architecture is a connection gateway tier (each server holds 50–100k connections) backed by a pub-sub broker (Redis for speed, Kafka for durability). When a message is sent, it is persisted first, then published to the broker, which fans it out to all gateway servers subscribed to that conversation — each delivers to its locally-connected clients. Key hard problems: connection draining during deploys (avoid mass reconnect storms), presence at scale (Redis TTL-based heartbeats), fan-out cost for large groups, and defining what "delivered" means in your consistency model.',
};

const socialFanoutChapter: EncyclopediaChapter = {
  id: 'social-fanout',
  title: 'Social feed fan-out and news feed architecture',
  category: 'Systems',
  summary: 'The core data model and delivery strategy behind Twitter, Instagram, and LinkedIn feeds — how a single post from a celebrity reaches 100 million followers without melting the database.',
  problemStatement: 'A naive news feed reads all accounts a user follows, fetches their recent posts, and merges/sorts them at read time. This is O(following × posts) per feed request and collapses under load. At Twitter scale (50M DAU, celebrities with 100M followers) the write side must deliver a post to millions of feed caches in seconds, and the read side must assemble a personalized, ranked feed in under 100ms.',
  interviewQuestion: 'Design the news feed system for a social platform with 500 million users, where top creators have up to 50 million followers each.',
  coreTension: 'Fan-out on write gives fast reads but makes celebrity posts catastrophically expensive to write; fan-out on read is cheap to write but slow and unscalable to read. No single strategy works for all users.',
  levelExpectations: {
    mid: 'Knows the difference between push and pull fan-out. Can design a pull-based feed that queries all followed accounts at read time. Understands the celebrity problem as a write bottleneck.',
    senior: 'Designs a hybrid: fan-out on write for normal users (pre-populate feed caches), fan-out on read for celebrities (merge at read time). Handles feed storage (Redis sorted set, Cassandra timeline table), ranking, and pagination via cursor.',
    staff: 'Defines the celebrity threshold and how it changes dynamically (Bieber problem — he gained 1M followers overnight). Addresses consistency: users tolerate seeing a post up to 30s late but not missing it entirely. Frames ranking as a separate service consuming the same event stream. Connects the data model to storage costs at scale (each feed cache entry × 500M users).',
  },
  coreConcepts: [
    'Fan-out on write (push model): when a user posts, immediately write the post ID to every follower\'s feed cache. O(followers) writes per post. Fast reads — feed is pre-assembled. Collapses for users with millions of followers.',
    'Fan-out on read (pull model): when a user opens their feed, query all accounts they follow, fetch recent posts, merge and sort. O(following) reads per feed request. Cheap writes, expensive reads that do not cache well.',
    'Hybrid model: fan-out on write for users below a follower threshold (e.g., < 100k followers). Fan-out on read for celebrities. Merge both at read time — celebrity posts are fetched fresh and merged with the pre-populated feed.',
    'Feed cache: a per-user sorted set in Redis where the score is the post timestamp. ZREVRANGE returns the feed in chronological/reverse-chronological order. Typical capacity: last 1000 posts per user.',
    'Ranking layer: the raw chronological timeline is re-scored by a ranking model (engagement probability, freshness, diversity) before serving. This runs asynchronously or at read time on the top-N candidates.',
    'Cursor-based pagination: encode the last-seen post ID or score as the cursor. Next page query uses ZRANGEBYSCORE with the cursor as the upper bound. Avoids the offset drift problem when new posts arrive.',
    'Activity fan-out vs. notification fan-out: activity fan-out (populating feeds) and push notifications are separate systems with different latency and delivery guarantees.',
  ],
  architectureDiagram: `flowchart LR
  U[User Post] --> PS[Post Service]
  PS --> DB[(Cassandra: posts)]
  PS --> KF[Kafka: post-created]
  KF --> FW{Fan-out Workers}
  FW -- followers lt 100k --> RD[(Redis ZADD feed:user_id)]
  FW -- followers ge 100k --> CI[(Celebrity Post Index)]
  FR[Feed Request] --> FS[Feed Service]
  FS --> RD
  FS --> CI
  FS --> RK[Ranking Layer]
  RK --> RESP[Ranked paginated feed]
  UG[(User Graph Service)] --> FW`,
  solutionApproach: [
    'Use Kafka as the backbone: every post event fans out through a Kafka topic. Fan-out workers are Kafka consumers — easy to scale, replay, and tune independently of the write path.',
    'Implement the hybrid model with a configurable celebrity threshold (default 100k followers). The threshold should be queryable at fan-out time — check the author\'s follower count before deciding push vs pull.',
    'Store feed caches as Redis sorted sets with post timestamp as score. Cap per-user feed at 1000 entries — users rarely scroll beyond that, and it bounds memory.',
    'Implement the Bieber problem mitigation: when a normal user crosses the celebrity threshold, backfill their existing followers\' feeds are eventually consistent; new posts go through the celebrity path immediately.',
    'Separate the ranking model from the feed assembly — ranking is a read-path concern. Fetch the top 200 candidate posts, score them, return the top 20. Ranking runs on a separate fleet with its own latency budget.',
    'Use cursor-based pagination anchored to post_id or (timestamp, post_id) tuple — pure timestamp cursors miss posts with the same millisecond timestamp.',
  ],
  designPatterns: [
    'Hybrid push-pull fan-out: push for normal users, pull for celebrities, merge at read time',
    'Event-driven fan-out: decouple post creation from fan-out via Kafka — fan-out workers scale independently',
    'Sorted set feed cache: Redis ZADD/ZREVRANGE with timestamp score for O(log n) insert, O(k) page read',
    'Top-K merge: merge multiple sorted streams into one ranked feed using a min-heap',
    'Async ranking: assemble the candidate set synchronously, score asynchronously in a background job',
  ],
  tradeoffs: [
    'Fan-out on write vs read: push gives fast feed reads but writes are O(followers). Pull is write-cheap but read latency is O(following × posts). Hybrid is the answer for asymmetric follow graphs.',
    'Redis vs Cassandra for feed storage: Redis is fast (sub-ms) but RAM-limited. Cassandra is cheap at scale but p99 is 5–15ms. Use Redis for the hot feed (last 200 posts), Cassandra for historical timeline.',
    'Feed freshness vs consistency: pre-populated feeds show posts up to 30s late for large follower sets. This is a product decision — most products accept eventual consistency for feed delivery.',
    'Ranking at read time vs write time: ranking at read time uses fresh signals (trending topics, session context) but adds latency. Ranking at write time is faster to serve but stalens quickly. Hybrid: pre-rank to a score, re-rank top-N at read time.',
    'Celebrity threshold management: static threshold is operationally simple but wrong. Dynamic threshold (automatically move to celebrity path when follower count crosses N) requires monitoring follower growth and triggering path migration.',
  ],
  failureScenarios: [
    'Celebrity post storm: a celebrity with 50M followers posts. 50M ZADD operations flood Redis. Mitigation: throttle fan-out worker throughput, use lazy fan-out (write to follower feeds on next login rather than immediately), or skip the top 1% of follower counts entirely.',
    'Fan-out lag: Kafka consumer lag builds up during a traffic spike, delaying feed updates by minutes. Mitigation: consumer group autoscaling, lag-based alerting (alert at > 30s lag), and a fallback to pull-mode when lag exceeds threshold.',
    'Feed cache cold start: a new user with no cache sees an empty feed. Mitigation: on first login, synchronously fetch the last 20 posts from each followed account (pull mode) to bootstrap the cache.',
    'Follower list inconsistency: user unfollows an account, but the fan-out worker still has the old follower list cached. Fix: fan-out workers query the User Graph Service with a short TTL cache (5 minutes) — stale delivery is acceptable, eventual consistency is the goal.',
    'Redis eviction under memory pressure: feed caches are evicted. Users see empty or stale feeds. Fix: LRU eviction policy, monitor eviction rate, and rebuild cache from Cassandra on cache miss.',
  ],
  productionConsiderations: [
    'Monitor Kafka consumer lag per partition — this is the primary health metric for fan-out timeliness.',
    'Track fan-out write rate (ZADDs/sec) in Redis; alert at > 80% of Redis write capacity.',
    'Implement a feed quality metric: percentage of feed items that are > 24h old (staleness signal).',
    'Test the celebrity threshold migration path — what happens when a user crosses the threshold mid-campaign?',
    'Keep feed cache size bounded (1000 entries max) to control memory and prevent runaway growth from high-frequency posters.',
  ],
  staffDiscussion: [
    'The most important Staff-level insight is that fan-out strategy is a product decision, not an engineering one: how stale can a feed be? Which users get prioritized delivery? These tradeoffs should be documented and owned by product, not silently absorbed by engineering.',
    'The data model boundary between the fan-out system and the ranking system is where most complexity accumulates. Keeping them decoupled (fan-out populates candidate sets; ranking scores them) preserves the ability to iterate ranking independently.',
    'At Staff level, connect feed architecture to business metrics: feed latency affects session length, which affects ad revenue. The 30s fan-out delay is not a technical detail — it has a measurable product impact that should inform the engineering investment decision.',
    'The "Bieber problem" is a forcing function for making the celebrity threshold explicit and configurable. Any system that hard-codes this threshold will break when a creator goes viral overnight.',
  ],
  relatedTopics: ['messaging-delivery-semantics', 'websocket-realtime-connections', 'consistent-hashing', 'stream-processing'],
  realWorldSystems: ['Twitter/X (fan-out on write for most users, fan-out on read for celebrities, Redis for feed cache)', 'Instagram (Cassandra timeline tables, ranking via ML)', 'Facebook (TAO graph for social graph, memcache for feed caching)', 'LinkedIn (Kafka-based fan-out, Espresso for timeline storage)'],
  followUpQuestions: [
    'How would you handle a user who follows 10,000 accounts? At what point does the pull model become untenable?',
    'How do you ensure that a post from a celebrity appears in all followers\' feeds within 5 minutes, even under peak load?',
    'How does your design change if you need to support chronological feed, algorithmic feed, and a "Following" tab simultaneously?',
    'How would you implement "mute" or "unfollow" such that the feed updates within seconds?',
  ],
  cheatSheet: [
    'Push (fan-out on write): fast reads, expensive celebrity writes → cap at 100k followers',
    'Pull (fan-out on read): cheap writes, slow reads → use for celebrities only',
    'Hybrid: push for normal users + pull for celebrities, merge at read time',
    'Redis sorted set: ZADD feed:{user_id} timestamp post_id → ZREVRANGE for feed page',
    'Kafka → fan-out workers: decouple post creation from delivery, scale independently',
    'Cap feed cache at 1000 entries per user; Cassandra for historical timeline',
    'Cursor pagination: use (timestamp, post_id) tuple, not pure offset',
    'Celebrity threshold must be dynamic — viral growth can cross it overnight',
  ],
  flashcards: [
    { question: 'What is the celebrity (Bieber) problem in news feed systems?', answer: 'A user with millions of followers posts content. Fan-out on write means millions of Redis ZADDs in seconds — a write storm that saturates the fan-out infrastructure. Solution: route celebrities through fan-out on read; pull their posts at feed assembly time instead of pre-populating every follower\'s cache.' },
    { question: 'Why use Kafka between the post service and fan-out workers?', answer: 'Decoupling: post creation is synchronous (user waits for 200 OK); fan-out is asynchronous and can be slow or retried without affecting the post write path. Kafka also enables replay (re-fan-out if a worker bug caused missed deliveries) and independent scaling of fan-out workers.' },
    { question: 'What data structure powers a news feed cache and why?', answer: 'A Redis sorted set (ZSET) where the member is the post_id and the score is the timestamp. ZADD is O(log n), ZREVRANGE for a page is O(k). This gives sub-millisecond feed page reads with efficient time-ordered insertion.' },
    { question: 'What is cursor-based pagination and why is offset-based wrong for feeds?', answer: 'Offset-based pagination breaks when new posts arrive: page 2 at offset 20 shifts to include posts from page 1, causing duplicates or gaps. Cursor-based pagination encodes the last-seen post\'s (timestamp, post_id) — the next page query uses this as a lower bound, immune to new insertions above the cursor.' },
  ],
  oneMinuteAnswer: 'News feed systems face an asymmetry: celebrities generate posts that must reach millions of followers, but reading a feed must be fast for every user. Fan-out on write pre-populates per-user Redis sorted sets — fast reads but catastrophically expensive for celebrities. Fan-out on read fetches posts from followed accounts at read time — cheap writes but O(following) reads per request. The production answer is hybrid: fan-out on write for users below a follower threshold, fan-out on read for celebrities, merged at read time. Posts flow through Kafka to fan-out workers, which write post IDs into Redis sorted sets capped at 1000 entries per user. The hard problems are the celebrity threshold (must be dynamic — viral growth is overnight), feed freshness SLA (how stale is acceptable?), and connecting ranking to the candidate assembly pipeline.',
};

const typeaheadChapter: EncyclopediaChapter = {
  id: 'typeahead-autocomplete',
  title: 'Typeahead and autocomplete at scale',
  category: 'Systems',
  summary: 'How search-as-you-type suggestions work at Google/Twitter scale — prefix indexing, candidate ranking, real-time freshness, and delivering sub-100ms results for every keystroke.',
  problemStatement: 'A typeahead system must return ranked suggestions for a partial query within 100ms end-to-end. At Google scale that means indexing billions of query strings, returning relevant completions for arbitrary prefixes, incorporating real-time trending signals, and personalizing results — all while handling millions of keystrokes per second.',
  interviewQuestion: 'Design the autocomplete service for a search engine that processes 10 billion queries per day with under 100ms p99 suggestion latency.',
  coreTension: 'Prefix indexes must be both highly compressed (to fit in memory) and fast to update (trending queries change by the minute) — static tries are compact but stale, distributed tries are fresh but operationally complex.',
  levelExpectations: {
    mid: 'Knows a trie maps prefixes to completions. Can design a single-server trie with top-K suggestions stored at each node. Understands the memory problem for large datasets.',
    senior: 'Designs a distributed trie or prefix-sharded inverted index. Handles ranking (frequency × recency), cache hierarchy for hot prefixes, and the offline rebuild vs real-time update tradeoff. Understands the personalization layer.',
    staff: 'Frames the read vs write SLA split: suggestions must be fast (100ms), freshness can be eventual (5–10 minutes for trending). Defines the data pipeline: query log → aggregation → prefix score table → serving cache. Addresses the shard hot-spot problem (queries starting with "the" are disproportionately common). Connects autocomplete quality to business metrics (CTR on suggestions).',
  },
  coreConcepts: [
    'Trie (prefix tree): each node represents one character; paths from root to node represent a prefix. Completions are stored or computed at each node. Memory-efficient for shared prefixes but naive implementations use too much RAM at Google scale.',
    'Compressed trie (radix tree/Patricia tree): collapse single-child chains into a single node labeled with the full substring. Reduces node count and memory by 10–100x.',
    'Top-K per node: rather than storing all completions at each node, store only the top-K (K=5–10) ranked suggestions. Ranking by query frequency × recency score.',
    'Prefix sharding: shard the trie by prefix — one shard owns all prefixes starting with "a", another "b", etc. More fine-grained: shard by first 2–3 characters. Requests fan out to the relevant shard.',
    'Two-tier architecture: a warm in-memory trie handles the top-N most popular prefixes. A backend inverted index handles tail prefixes. Cache hit rate for in-memory tier is typically 90%+.',
    'Query log aggregation: every search query is logged, aggregated by prefix in a streaming pipeline (Kafka + Flink), and scores are updated in the serving index every 5–10 minutes.',
    'Personalization: a second-pass reranking layer adjusts suggestions based on user history, location, and language — runs after the generic prefix lookup.',
  ],
  architectureDiagram: `flowchart TD
  K[Keystrokes] --> CDN[CDN: top 100k prefix cache]
  CDN -- cache miss --> AC[Autocomplete Service]
  AC --> TS[(In-memory Trie Shard by prefix 0:2)]
  TS --> TK[Top-K candidates]
  TK --> PS[Personalization Service]
  PS --> RESP[Ranked suggestions JSON]
  SL[Search Logs] --> KF[Kafka: query-log]
  KF --> FL[Flink: 5-min aggregation]
  FL --> RS[(Redis: prefix score table)]
  RS --> RB[Trie Rebuild Job hourly]
  RB -- hot-swap --> TS`,
  solutionApproach: [
    'Separate the offline index build pipeline (query log → aggregate → build trie) from the online serving path. Freshness comes from the pipeline; correctness comes from periodic full rebuilds.',
    'Use a two-tier cache: CDN edge cache for the top 100k most popular prefixes (static, extremely hot), origin in-memory trie for the long tail.',
    'Shard the trie by the first 2–3 characters of the prefix. Requests fan out to exactly one shard — no cross-shard coordination on the critical path.',
    'Store top-K completions at each trie node (K=10) with pre-computed scores. Avoids traversing the full subtree at query time — serving is a single node lookup.',
    'Update scores in Redis continuously from the streaming pipeline, and rebuild the in-memory trie from Redis every 60 minutes. Hot-swap: build the new trie in the background, then atomically swap the pointer.',
    'Add a trending boost: multiply the base frequency score by a recency multiplier for queries that have spiked in the last 10 minutes. This surfaces breaking news and viral topics.',
  ],
  designPatterns: [
    'Precomputed top-K per node: avoid subtree traversal at query time by storing winners at each node',
    'Offline build + hot-swap: build index offline, atomically replace serving copy',
    'CDN prefix caching: cache the most popular prefix responses at edge, before hitting origin',
    'Streaming freshness pipeline: Kafka + Flink for continuous score updates, separate from full rebuild',
    'Two-pass serving: generic prefix lookup + personalization rerank',
  ],
  tradeoffs: [
    'Trie vs inverted index: tries give O(prefix length) lookup but are hard to update incrementally. Inverted index (prefix → posting list) is easier to update but requires merge at query time.',
    'Freshness vs complexity: real-time trie updates (per-keystroke index writes) are extremely expensive. Eventual freshness (5–10 minute pipeline lag) is almost always acceptable — users do not expect to see their own query suggested instantly.',
    'Memory vs coverage: storing top-K=10 per node uses much less memory than top-100 but reduces diversity of suggestions. Tune K based on available memory and suggestion quality requirements.',
    'CDN caching vs freshness: CDN cache TTL of 5 minutes means top prefixes are always 0–5 minutes stale. For most autocomplete use cases this is fine; for financial or emergency queries it may not be.',
    'Personalization cost vs quality: personalization requires a second service call on the critical path (adds 10–20ms). Can be done asynchronously with a previous-session cache to reduce latency impact.',
  ],
  failureScenarios: [
    'Hot shard: common prefixes ("th", "wh", "an") receive disproportionate traffic. A single shard for "th" gets 5× average load. Fix: sub-shard by second character; dedicate additional replicas to hot shards.',
    'Trie rebuild OOM: full trie rebuild holds both old and new trie in memory simultaneously. For a 50 GB trie, this doubles peak memory. Fix: streaming rebuild that builds the new trie in a separate process, swap after completion.',
    'Score staleness during Kafka lag: if the aggregation pipeline falls behind, scores freeze and trending queries don\'t surface. Fix: alert on aggregation lag > 15 minutes; fall back to raw frequency without trending boost.',
    'Empty prefix case: user types nothing and the service must return popular global queries. This is a separate "trending queries" feature, not typeahead — ensure it has its own cache and does not overload the trie shard.',
    'Unicode and internationalization: non-ASCII characters break naive character-based trie sharding. Fix: normalize to Unicode NFC, shard by Unicode block or use a language-aware tokenizer.',
  ],
  productionConsiderations: [
    'Track suggestion CTR (click-through rate) as the primary quality metric — low CTR on a prefix means suggestions are irrelevant.',
    'Monitor trie memory usage and set alerts at 80% capacity — trie growth is non-linear when new query patterns emerge.',
    'Implement prefix-level cache hit metrics to understand CDN effectiveness for top prefixes.',
    'Test the hot-swap mechanism in staging before every trie rebuild deployment — a failed swap leaves the service serving stale data.',
    'Log which suggestion was selected per query — this is the training signal for the ranking model.',
  ],
  staffDiscussion: [
    'The most important Staff insight is the read/write SLA separation: the read path must be <100ms, but freshness can be eventual (minutes). Conflating these forces expensive real-time index updates that are never necessary for suggestion quality.',
    'Autocomplete quality is a product metric problem, not just a latency problem. Connect suggestion CTR and search success rate to your ranking model — a fast but irrelevant suggestion is worse than a slightly slower relevant one.',
    'The CDN caching layer for hot prefixes is often more impactful than trie optimizations. If 90% of traffic is the top 100k prefixes and they are CDN-cached, the trie only serves the long tail.',
    'At Staff level, define the SLA for trending query freshness explicitly: "a query that spikes 10x should appear as a suggestion within 10 minutes." This is a product requirement that drives pipeline design, not an engineering constant.',
  ],
  relatedTopics: ['search-engine-internals', 'consistent-hashing', 'stream-processing', 'database-selection-sharding'],
  realWorldSystems: ['Google Search autocomplete (distributed trie, 5-second freshness at scale)', 'Twitter/X typeahead (Earlybird real-time index)', 'Amazon search suggest (prefix-sharded, personalization rerank)', 'Elasticsearch prefix queries (edge n-gram tokenizer)'],
  followUpQuestions: [
    'How would you support fuzzy matching (handling typos) in typeahead?',
    'How does your design change if you need to support autocomplete in 50 languages simultaneously?',
    'How would you add real-time trending topic injection — a breaking news query that must surface within 60 seconds?',
    'How would you measure and improve the quality of your autocomplete suggestions?',
  ],
  cheatSheet: [
    'Trie: O(prefix length) lookup; store top-K completions per node to avoid subtree traversal',
    'Shard by first 2 characters; hot shards ("th", "wh") get dedicated replicas',
    'CDN cache top 100k prefixes — covers ~90% of traffic at the edge',
    'Offline build + hot-swap: build new trie from Redis scores, atomically swap pointer',
    'Streaming pipeline: query log → Kafka → Flink → score updates every 5 min',
    'Full rebuild every 1 hour for correctness; streaming updates for freshness',
    'Personalization is a second pass — rerank generic candidates with user history',
    'Read SLA: <100ms; freshness SLA: 5–10 minutes — keep them separate',
  ],
  flashcards: [
    { question: 'Why store top-K completions at each trie node instead of computing them at query time?', answer: 'Computing completions at query time requires traversing the entire subtree below the matched node — O(subtree size), which is expensive for short prefixes like "a" that have millions of completions. Pre-storing top-K at each node makes serving O(1) after prefix lookup, at the cost of more memory and more complex writes.' },
    { question: 'How does a typeahead system stay fresh without real-time trie updates?', answer: 'A streaming pipeline (Kafka + Flink) continuously aggregates query log events into prefix score tables (Redis). A periodic rebuild job (every 60 minutes) reads these scores and rebuilds the trie, hot-swapping it into the serving process. Freshness is eventual (minutes), not real-time, which is sufficient for autocomplete quality.' },
    { question: 'What is the hot shard problem in typeahead?', answer: 'Some prefixes are disproportionately common ("the", "what", "an"). If sharded by first character, the "t" shard gets far more traffic than "z". Fix: shard by first 2–3 characters; identify hot shards via traffic monitoring and add dedicated replicas.' },
    { question: 'Why is CDN caching effective for typeahead?', answer: 'The top 100k prefixes account for ~90%+ of all autocomplete traffic. These top prefixes have stable, high-confidence suggestions that change slowly. Caching them at CDN edges (TTL 5 minutes) means the vast majority of typeahead requests are served without hitting origin servers.' },
  ],
  oneMinuteAnswer: 'Typeahead requires sub-100ms prefix lookup over billions of query strings. The serving architecture is a sharded in-memory compressed trie (sharded by first 2 characters of the prefix) with top-K completions pre-stored at each node — no subtree traversal on the critical path. The top 100k prefixes are cached at CDN edges, covering ~90% of traffic without hitting origin. Freshness comes from a streaming pipeline: query logs flow through Kafka and Flink into a Redis score table, which feeds hourly trie rebuilds. The rebuilt trie is hot-swapped into serving atomically. The key Staff insight is separating read SLA (<100ms) from freshness SLA (5–10 minutes eventual) — conflating them forces expensive real-time index writes that are never necessary for autocomplete quality.',
};

const topKStreamingChapter: EncyclopediaChapter = {
  id: 'topk-streaming-aggregation',
  title: 'Top-K and streaming aggregation',
  category: 'Systems',
  summary: 'How to identify the most frequent items in a data stream — trending hashtags, top songs, most-clicked ads — without materializing the full dataset, using probabilistic data structures that trade a small error bound for massive memory savings.',
  problemStatement: 'Finding exact top-K most frequent items in a stream requires maintaining counts for every distinct item — billions of entries for large-scale systems. Probabilistic data structures (Count-Min Sketch, heavy hitter algorithms) solve this by trading a bounded error for orders-of-magnitude memory reduction, enabling real-time trending detection at scale.',
  interviewQuestion: 'Design a system that identifies the top 100 trending hashtags on a platform with 500 million tweets per day, updated every minute.',
  coreTension: 'Exact counting requires O(distinct items) memory and is infeasible at stream scale; approximate counting requires careful error bound analysis to ensure the approximation is still useful for the product.',
  levelExpectations: {
    mid: 'Knows you need to count items in a stream. Suggests a hash map of counts. Recognizes the memory problem at scale. May suggest sampling.',
    senior: 'Knows Count-Min Sketch and can explain its error bound. Designs a two-tier system: Count-Min Sketch for approximate counts, min-heap for maintaining top-K candidates. Handles the windowing requirement (trending = recent, not all-time).',
    staff: 'Frames the accuracy vs memory tradeoff as a product requirement: "we can tolerate a hashtag being ranked ±5 positions, but cannot miss an item with > 1% share." Connects error bounds to epsilon/delta parameters. Addresses the lambda architecture question: where do you use approximate streaming vs exact batch? Defines SLOs for trending freshness (how quickly does a spike show up?).',
  },
  coreConcepts: [
    'Heavy hitters problem: find all items whose frequency exceeds n/k (where n = stream length, k = desired count threshold). Any solution must handle arbitrary insertion order.',
    'Count-Min Sketch (CMS): a d×w array of counters with d independent hash functions. Increment: hash item with each function, increment the cell in each row. Query: hash with each function, return the minimum cell value across rows. Error guarantee: estimated count ≤ true count + ε×n with probability 1 - δ.',
    'CMS parameters: width w = ⌈e/ε⌉, depth d = ⌈ln(1/δ)⌉. For ε=0.1% error and δ=1% failure probability: w ≈ 2718, d ≈ 5. Total cells = ~13,590 vs billions of distinct items.',
    'HyperLogLog (HLL): counts distinct items (cardinality), not frequency. Used for "how many unique users" questions. Not for top-K frequency.',
    'Min-heap for top-K: maintain a min-heap of K items sorted by count. When CMS returns a count for a new item that exceeds the heap minimum, swap it in. O(log K) per insertion.',
    'Sliding window: trending = high frequency in the recent window (last hour/day), not all-time. Use time-decayed counts (exponential decay) or segment the stream into windows and aggregate.',
    'Space-Saving algorithm: exact heavy hitter algorithm that guarantees finding all items with frequency > n/k. Uses exactly k counters. No false positives, bounded false negative rate.',
  ],
  architectureDiagram: `flowchart TD
  EV[Events: tweets clicks] --> KF[Kafka topic]
  KF --> FJ[Flink Job per partition]
  FJ --> CMS[(Count-Min Sketch 1-min window)]
  CMS --> MH[Min-heap top-100 candidates]
  MH --> RE[(Redis: partition top-100)]
  CO[Coordinator every 60s] --> RE
  CO --> MG[Merge and re-rank all partitions]
  MG --> TR[(Redis ZSET trending:hashtags)]
  TR --> CDN[CDN cache TTL 60s]
  KF --> SP[Spark batch 24h exact counts]
  SP --> AN[(Analytics store: exact)]
  API[Read API] --> TR`,
  solutionApproach: [
    'Use Count-Min Sketch per Kafka partition — each partition runs its own CMS and top-K heap. This parallelizes the counting work without cross-partition coordination on the hot path.',
    'Merge partition-level top-K lists in a coordinator service every minute. Merging K-item lists from N partitions is O(N×K×log K) — cheap at N=100, K=100.',
    'Use time-decayed counts for trending: multiply old counts by a decay factor (e.g., 0.5 per hour) to make recent events dominate. Avoids all-time heavy hitters crowding out fresh trends.',
    'Separate the trending API (Redis sorted set, fast read) from the computation pipeline (Flink). The trending endpoint is read-only with a CDN cache TTL of 60 seconds.',
    'Run a daily Spark batch job on the raw Kafka log for exact counts — use this for analytics, billing, and as a quality signal to tune CMS parameters.',
    'Tune epsilon and delta to your product requirement: if missing a trend with 1% share is unacceptable, set ε=0.001. Compute the resulting memory cost and verify it fits in the Flink task manager heap.',
  ],
  designPatterns: [
    'Partition-local CMS + periodic merge: avoid cross-partition coordination by computing locally and merging periodically',
    'Lambda architecture: streaming for freshness (CMS, approximate), batch for accuracy (Spark, exact)',
    'Min-heap top-K maintenance: O(log K) insertion into a bounded heap for candidate tracking',
    'Time-decayed counts: exponential decay makes the signal responsive to recent changes',
    'CDN-cached read path: trending list is a read-heavy, infrequently-updated endpoint — aggressive CDN caching is correct',
  ],
  tradeoffs: [
    'Count-Min Sketch vs exact counting: CMS uses O(1/ε × log(1/δ)) memory vs O(distinct items). At ε=0.1%, O(2718 × 5) = 13,590 cells vs billions of items. The tradeoff: CMS always overcounts (never undercounts), and the overcount is bounded.',
    'CMS vs Space-Saving: Space-Saving gives exact heavy hitters (no false positives) with k counters but requires knowing k in advance. CMS is more flexible for general frequency queries but has false positives.',
    'Window size vs freshness: 1-minute windows give near-real-time trending but are noisier (a single spam burst trends). 10-minute windows are smoother but lag. Product requirement drives the choice.',
    'Streaming accuracy vs batch accuracy: CMS gives approximate counts in real-time; Spark gives exact counts with 1–24h lag. For trending display, approximate is fine. For billing or legal, exact is required.',
    'Partition count vs aggregation cost: more partitions means more parallelism but more merging work. 100 partitions × top-100 each = 10,000 items to merge per minute — still trivial.',
  ],
  failureScenarios: [
    'CMS counter overflow: with billions of events and integer counters (uint32), frequent items overflow at ~4 billion. Fix: use uint64 counters or normalize counts periodically.',
    'Cold start: a new Flink job starts with empty CMS — takes one window (1 minute) to populate. Trending list is empty or stale during this window. Fix: snapshot and restore CMS state on job restart (Flink savepoint).',
    'Spam attack: a coordinated campaign floods a hashtag to artificially trend it. CMS detects the high frequency but cannot distinguish organic from spam. Mitigation: add a distinct-user filter (HyperLogLog per hashtag) — require trending items to have N distinct users, not just N occurrences.',
    'Slow coordinator: if the merge coordinator fails, trending list freezes at the last snapshot. Fix: redundant coordinator with leader election (ZooKeeper/etcd), alerting on trending freshness age.',
    'Partition skew: one Kafka partition receives 10× the average traffic (hot partition from a single celebrity). That partition\'s CMS is more accurate; others may miss items. Fix: monitor partition lag and traffic distribution; repartition by hash if skew is persistent.',
  ],
  productionConsiderations: [
    'Instrument CMS error rate: compare CMS count estimates against daily Spark exact counts for the top-100 items. Alert if mean absolute error > 2× the theoretical bound.',
    'Monitor Flink checkpoint latency — missed checkpoints mean lost CMS state on failure.',
    'Track trending freshness: how quickly does a 10× spike in a hashtag appear in the trending list? SLO: within 2 minutes.',
    'Implement the distinct-user filter for spam resistance before launch — retrofitting it is difficult.',
    'Set Flink task manager heap based on CMS size × number of windows in flight × number of hash tables.',
  ],
  staffDiscussion: [
    'The most important Staff-level question is: what error is acceptable to the product? A trending list where the #1 and #2 items might be swapped is fine. A billing system where counts are off by 0.1% is not. Get this requirement in writing before choosing ε.',
    'Count-Min Sketch is one of the most underused data structures in production systems because engineers are uncomfortable with "approximate." The Staff framing: approximate with a known, bounded error is preferable to exact with unknown latency — define the error budget, then choose the data structure.',
    'The spam resistance problem (distinct user filter) is often not thought of at design time. At Staff level, anticipate that any trending feature will be gamed, and design the distinct-user gate as a first-class requirement rather than an afterthought.',
    'Connect the trending pipeline to the recommendation system: trending topics that a user\'s network is engaging with should score higher than global trends. This requires joining the CMS output with a social graph query — a cross-system dependency to design explicitly.',
  ],
  relatedTopics: ['stream-processing', 'social-fanout', 'messaging-delivery-semantics', 'metrics-monitoring-alerting'],
  realWorldSystems: ['Twitter trending topics (Count-Min Sketch + time decay, Summingbird pipeline)', 'Spotify top songs (sliding window aggregation)', 'YouTube trending (multi-signal ranking on aggregated view counts)', 'Facebook trending (abandoned for quality reasons — a cautionary tale about naive frequency as a proxy for quality)'],
  followUpQuestions: [
    'How would you extend this design to support personalized trending (trending within my network, not globally)?',
    'How do you handle the case where a legitimate news event causes a spike that looks identical to a spam attack?',
    'If you needed exact counts for billing purposes alongside approximate trending, how would you architect the two pipelines?',
    'How does your design change if you need trending at multiple granularities: per-city, per-country, and globally?',
  ],
  cheatSheet: [
    'Count-Min Sketch: d×w counter array, d hash functions, query = min across rows',
    'Error: estimated count ≤ true count + ε×n, probability 1-δ',
    'w = ⌈e/ε⌉, d = ⌈ln(1/δ)⌉ — tune ε and δ to product requirements',
    'CMS always overcounts, never undercounts — safe for "at least this frequent" queries',
    'Min-heap of K items: O(log K) to update top-K as new counts arrive',
    'Time decay: multiply old counts by decay factor to surface recent trends',
    'Distinct-user filter (HyperLogLog per item) prevents spam from gaming trending',
    'Lambda: CMS/Flink for real-time approximate, Spark for daily exact correction',
  ],
  flashcards: [
    { question: 'What error guarantee does Count-Min Sketch provide?', answer: 'The estimated count for any item is always ≥ the true count (no undercounting) and ≤ true count + ε×n with probability 1-δ, where n is the total stream length. It overcounts but never undercounts, and the overcount is bounded by ε×n.' },
    { question: 'How do you maintain a top-K list using Count-Min Sketch?', answer: 'Keep a min-heap of K (item, count) pairs. When CMS returns a count for a new item that exceeds the minimum count in the heap, eject the minimum and insert the new item. The heap always holds the K items with the highest estimated counts. O(log K) per new candidate.' },
    { question: 'What is time decay in streaming aggregation and why is it needed?', answer: 'Trending means "popular recently," not "popular all-time." Without decay, an item that trended 6 months ago maintains a high count forever. Time decay multiplies accumulated counts by a factor < 1 (e.g., 0.5 per hour), causing old counts to shrink so recent spikes dominate the ranking.' },
    { question: 'What is the difference between Count-Min Sketch and HyperLogLog?', answer: 'Count-Min Sketch estimates the frequency of specific items in a stream (how many times did hashtag X appear?). HyperLogLog estimates the number of distinct items in a stream (how many unique users sent a tweet?). They answer different questions — CMS for frequency, HLL for cardinality.' },
  ],
  oneMinuteAnswer: 'Top-K streaming aggregation answers "what are the most frequent items right now?" without materializing full counts. Count-Min Sketch is the core data structure: a d×w counter array with d hash functions. For any item, increment the cell at each (row, hash) position; query by taking the minimum across rows. The error is bounded: estimated ≤ true count + ε×n with probability 1-δ. Parameters ε and δ are set by the product error requirement. At scale, each Kafka partition runs its own CMS and a min-heap of top-K candidates; a coordinator merges partition-local lists every minute. Time decay (exponential decay on accumulated counts) makes the system respond to recent spikes rather than all-time leaders. A distinct-user filter (HyperLogLog per candidate) prevents spam from gaming the trending list.',
};

export const phase18AChapters: EncyclopediaChapter[] = [
  geoIndexingChapter,
  websocketConnectionChapter,
  socialFanoutChapter,
  typeaheadChapter,
  topKStreamingChapter,
];
