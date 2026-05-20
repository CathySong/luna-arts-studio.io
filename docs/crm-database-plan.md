# Luna CRM 数据库方案（小工作室）

> 解决 production 报错：`CRM data cannot be saved in this environment (e.g. Vercel serverless)`  
> 目标：在 Vercel 上**持久保存**学生、上课记录、点评、付款与作品照片。

**只用免费方案** → 见 **[crm-database-free.md](./crm-database-free.md)**（Neon 免费档 + Vercel Blob，约 $0/月）。

---

## 1. 现状与问题

| 项目 | 当前实现 | Production（Vercel） |
|------|----------|----------------------|
| 结构化数据 | `data/crm/db.json` 单文件 | 文件系统只读/不持久，**写入失败** |
| 图片 | `public/uploads/crm/*.jpg` | 部署后丢失，**不能依赖本地目录** |
| 并发 | 内存队列 `lockChain` 串行写 JSON | Serverless 多实例下**不可靠** |

本地 `npm run dev` 正常；上线后只能读（且常为空库），一保存就报错。

---

## 2. 推荐方案（小工作室标配）

**PostgreSQL（Neon）+ Vercel Blob**

| 组件 | 用途 | 为何适合 |
|------|------|----------|
| **[Neon Postgres](https://neon.tech)** | 学生、课时、点评、付款等 | Vercel Marketplace 一键接入；免费档够用；Serverless 友好 |
| **[Vercel Blob](https://vercel.com/docs/storage/vercel-blob)** | 课堂作品 / 上课照片 | 与 Next.js 同平台；按 URL 存图；无需自建 S3 |

预估规模（Luna 级别）：

- 学生 &lt; 200、年上课记录 &lt; 5,000、图片 &lt; 10GB  
- **月费约 $0–5**（Neon 免费档 + Blob 少量存储）

### 不推荐（本阶段）

| 方案 | 原因 |
|------|------|
| 继续 `db.json` 放 Blob | 无查询、无关系、并发差，只适合临时过渡 |
| 自建 MySQL 服务器 | 运维成本高，对小工作室过重 |
| MongoDB Atlas | 可以，但关系型数据（学生–付款–课时）用 SQL 更直观 |

---

## 3. 数据模型（Postgres）

与现有 `lib/crm/types.ts` 一一对应。

```sql
-- 学生
CREATE TABLE students (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  age           INT,
  parent_name   TEXT,
  parent_email  TEXT,
  parent_phone  TEXT,
  hobbies       JSONB NOT NULL DEFAULT '[]',
  loved_arts    JSONB NOT NULL DEFAULT '[]',
  notes         TEXT,
  classes_taken INT NOT NULL DEFAULT 0,
  notebooklm_source_id   TEXT,
  notebooklm_source_name TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 课堂场次
CREATE TABLE class_sessions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  class_type  TEXT NOT NULL,
  date        DATE NOT NULL,
  instructor  TEXT,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 作品（图片 URL 指向 Vercel Blob）
CREATE TABLE artworks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  student_id  UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  image_url   TEXT NOT NULL,
  title       TEXT,
  medium      TEXT,
  notes       TEXT,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 课堂场次点评（关联场次 + 多幅作品）
CREATE TABLE class_reviews (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID NOT NULL REFERENCES class_sessions(id) ON DELETE CASCADE,
  student_id   UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  content      TEXT NOT NULL,
  status       TEXT NOT NULL CHECK (status IN ('draft','generated','approved')),
  version      INT NOT NULL DEFAULT 1,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  artwork_ids  JSONB NOT NULL DEFAULT '[]'
);

-- 付款
CREATE TABLE payments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id        UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount            NUMERIC(10,2) NOT NULL,
  paid_at           DATE NOT NULL,
  lessons_purchased INT NOT NULL,
  notes             TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 上课记录（含嵌套 AI 点评、多张照片 URL）
CREATE TABLE attendances (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id          UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  session_id          UUID REFERENCES class_sessions(id) ON DELETE SET NULL,
  date                DATE NOT NULL,
  content             TEXT NOT NULL,
  lessons_used        INT NOT NULL DEFAULT 1,
  lesson_theme        TEXT,
  techniques_learned  TEXT,
  image_urls          JSONB NOT NULL DEFAULT '[]',
  review              JSONB,  -- AttendanceReview 对象
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_attendances_student ON attendances(student_id, date DESC);
CREATE INDEX idx_payments_student ON payments(student_id, paid_at DESC);
CREATE INDEX idx_artworks_session ON artworks(session_id);
CREATE INDEX idx_reviews_student ON class_reviews(student_id);
```

**字段映射**

| 现 JSON 字段 | 新库 |
|--------------|------|
| `imagePath` / `imagePaths[]` | `image_url` / `image_urls[]`（Blob 公网 URL） |
| `AttendanceReview` | `attendances.review` JSONB |
| `artworkIds[]` | `class_reviews.artwork_ids` JSONB |

`classes_taken` 可由 `attendances` 计数触发器维护，或继续应用层 `syncStudentClassesTaken`。

---

## 4. 图片存储（Vercel Blob）

```
上传流程：
  Admin 表单 multipart
    → API 写入 Blob: crm/{studentId}/{uuid}.jpg
    → 返回 https://....blob.vercel-storage.com/...
    → Postgres 只存 URL 字符串
```

环境变量：

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

改造文件：

- `lib/crm/upload-image.ts` → 根据 `BLOB_READ_WRITE_TOKEN` 选择 Blob 或本地目录（dev fallback）

---

## 5. 应用层改造（保持 API 不变）

目标：**Admin UI 与 `/api/admin/*` 路由不改**，只换数据层。

```
lib/crm/
  types.ts              # 保留
  db.ts                 # 改为门面：读 CRM_STORAGE 环境变量
  db-json.ts            # 现有 JSON 实现（仅 local dev）
  db-postgres.ts        # Neon 实现（production）
  blob.ts               # 统一上传
```

```env
# local
CRM_STORAGE=json

# production (Vercel)
CRM_STORAGE=postgres
DATABASE_URL=postgresql://...@neon.tech/neondb?sslmode=require
BLOB_READ_WRITE_TOKEN=...
```

门面示例：

```typescript
// lib/crm/db.ts
const impl =
  process.env.CRM_STORAGE === "postgres"
    ? await import("./db-postgres")
    : await import("./db-json");

export const listStudents = impl.listStudents;
// ... 其余 export 同名函数
```

推荐 ORM：**[Drizzle ORM](https://orm.drizzle.team)**（轻量、TypeScript 友好）或 **`@neondatabase/serverless`** 裸 SQL。

---

## 6. 实施阶段

### Phase 1 — 基础设施（约 0.5 天）

1. Vercel Dashboard → Storage → **Create Neon Database** → 自动注入 `DATABASE_URL`
2. 同上 → **Create Blob Store** → 注入 `BLOB_READ_WRITE_TOKEN`
3. 本地：`vercel env pull` 或手动写入 `.env.local`
4. 执行 `docs/crm-schema.sql`（或 Drizzle migrate）建表

### Phase 2 — 数据层（约 1–2 天）

1. 新增 `db-postgres.ts`，实现与 `db.ts` 相同的函数签名
2. `upload-image.ts` 支持 Blob
3. `CRM_STORAGE` 开关 + production 默认 `postgres`
4. `npm run build` + `npm run test:crm` 对 Neon 跑通

### Phase 3 — 数据迁移（约 0.5 天）

脚本 `scripts/migrate-json-to-postgres.mjs`：

1. 读取 `data/crm/db.json`
2. INSERT 各表（保留原 UUID 若已是 uuid 格式）
3. 扫描 `public/uploads/crm/`，上传到 Blob，更新 `image_url` / `image_urls`

### Phase 4 — 上线与验证（约 0.5 天）

1. Vercel Production 环境变量齐全
2. `/admin` 新增学生、上课记录、上传照片、生成点评
3.  redeploy 后数据仍在

---

## 7. 环境变量清单（Production）

| 变量 | 必填 | 说明 |
|------|------|------|
| `ADMIN_PASSWORD` | ✓ | 后台登录 |
| `CLAUDE_API_KEY` | ✓ | AI 点评 |
| `DATABASE_URL` | ✓ | Neon 连接串 |
| `CRM_STORAGE` | ✓ | 设为 `postgres` |
| `BLOB_READ_WRITE_TOKEN` | ✓ | 图片持久化 |
| `CLAUDE_MODEL` |  | 可选 |
| NotebookLM 相关 |  | 可选 |

---

## 8. 成本与备份

| 服务 | 免费档 | 小工作室典型 |
|------|--------|--------------|
| Neon | 0.5 GB 存储、计算有限 | 足够 |
| Vercel Blob | 按量 | 图片少时 &lt; $1/月 |
| 备份 | Neon 自动每日备份（付费档）| 可每周 `pg_dump` 到本地 |

---

## 9. 备选：极简过渡方案（1 小时内）

若**暂时不想上 Postgres**，仅缓解图片问题：

- 数据仍用 JSON → 存 **Vercel Blob** 单文件 `crm/db.json`（整库读写）  
- **缺点**：并发差、无索引、库变大后慢  
- **仅适合** &lt; 30 学生、短期过渡  

长期仍建议 Phase 1–4 的 Postgres 方案。

---

## 10. 决策摘要

| 问题 | 答案 |
|------|------|
| 用什么库？ | **Neon Postgres** |
| 图片放哪？ | **Vercel Blob** |
| 改动大吗？ | 数据层替换；**UI/API 基本不动** |
| 本地开发？ | `CRM_STORAGE=json` 继续用 `db.json` |
| 工期？ | **约 2–4 天** 可上线 production CRM |

---

## 11. 下一步（实施时）

1. 确认采用 Neon + Blob  
2. 在仓库添加 `drizzle` 或 `schema.sql` + `db-postgres.ts`  
3. 运行迁移脚本导入现有 `data/crm/db.json`  
4. Vercel 配置环境变量并 redeploy  

如需，可在本仓库直接按本方案实现 Phase 1–2（schema + `db-postgres` + Blob 上传）。
