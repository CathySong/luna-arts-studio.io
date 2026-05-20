# Luna CRM — 免费版数据库方案（$0/月）

小工作室用量下，**不必付费**即可在 Vercel Production 正常保存 CRM 数据。

---

## 推荐：方案 A（与 Vercel 最省事）

**Neon Postgres 免费档 + Vercel Blob 免费额度**

| 服务 | 免费额度（够用） | 注册 |
|------|------------------|------|
| **Neon** | 约 512 MB 存储、每月计算时长有限；无活动会休眠（首次访问自动唤醒） | [neon.tech](https://neon.tech) |
| **Vercel Blob** | Hobby 项目含 Blob 存储（课堂照片一般 &lt; 1 GB） | Vercel Dashboard → Storage |

**适合**：已用 Vercel 部署网站，希望点几下就连上数据库。

### 5 分钟配置（Vercel Dashboard）

1. 打开项目 → **Storage** → **Create Database** → 选 **Neon** → **Continue**（免费计划）
2. 再 **Create Store** → **Blob** → 创建 store
3. 到 **Settings → Environment Variables**，确认已自动添加：
   - `DATABASE_URL`（或 `POSTGRES_URL`）
   - `BLOB_READ_WRITE_TOKEN`
4. 手动添加：
   ```env
   CRM_STORAGE=postgres
   ```
5. **Redeploy** Production

本地 `.env.local`（`vercel env pull` 或从 Dashboard 复制）：

```env
CRM_STORAGE=postgres
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
ADMIN_PASSWORD=你的密码
CLAUDE_API_KEY=...
```

本地开发仍可用 JSON（不连 Neon）：

```env
CRM_STORAGE=json
```

> **说明**：代码里需完成 `db-postgres.ts` 实现（见 `crm-database-plan.md`）。当前仓库仍是 JSON，配置好变量后需实施迁移才能消除保存错误。

---

## 备选：方案 B（一个账号搞定 DB + 图片）

**[Supabase](https://supabase.com) 免费档**

| 项目 | 免费额度 |
|------|----------|
| Postgres 数据库 | 500 MB |
| Storage（图片） | 1 GB |
| API | 免费 |

**适合**：想少配几个服务；接受在 Supabase 控制台管理文件。

环境变量示例：

```env
CRM_STORAGE=postgres
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
```

图片改存 Supabase Storage，不必用 Vercel Blob。

---

## 备选：方案 C（SQLite 边缘库）

**[Turso](https://turso.tech) 免费档**

| 项目 | 免费额度 |
|------|----------|
| 存储 | 约 5 GB |
| 读/写 | 每月大量免费额度 |

**适合**：数据量小、想要极简；需改 schema 为 SQLite（与 Postgres 方案略有不同）。

```env
CRM_STORAGE=turso
TURSO_DATABASE_URL=libsql://xxx.turso.io
TURSO_AUTH_TOKEN=...
```

---

## 三家对比（小工作室）

| | Neon + Blob | Supabase | Turso |
|---|-------------|----------|-------|
| 月费 | **$0** | **$0** | **$0** |
| 与 Vercel 集成 | ⭐⭐⭐ 最好 | ⭐⭐ 好 | ⭐⭐ 好 |
| 图片存储 | Vercel Blob | Supabase Storage | 需另配 Blob/R2 |
| 数据库 | Postgres | Postgres | SQLite |
| 休眠/冷启动 | Neon 空闲会 sleep，首请求略慢 | 较少 | 较少 |

**Luna 默认建议：方案 A（Neon + Blob）**，与现有 Postgres 表设计一致。

---

## 免费档能存多少？

粗算（远超小工作室需求）：

| 数据 | 估算大小 |
|------|----------|
| 100 学生 + 档案 | &lt; 1 MB |
| 2000 条上课记录 + 点评 | &lt; 10 MB |
| 500 张图（每张 500 KB） | ~250 MB |

合计 &lt; 300 MB → **Neon 512 MB 与 Supabase 500 MB 都够**。

---

## 实施顺序（仍免费）

1. Vercel 创建 Neon + Blob（方案 A）
2. 仓库执行 `docs/crm-schema.sql` 建表（实施 Phase 2 时添加）
3. 运行 `scripts/migrate-json-to-postgres.mjs` 导入现有 `data/crm/db.json`
4. 设置 `CRM_STORAGE=postgres` 并 redeploy

详细表结构见 [`crm-database-plan.md`](./crm-database-plan.md)。

---

## 常见问题

**Q: Neon 免费库会丢数据吗？**  
A: 不会无故删除；长期不用可能 **pause**，恢复后数据仍在。

**Q: 必须绑信用卡吗？**  
A: Neon / Supabase / Turso 注册通常 **不需要**；Vercel Hobby Hosting 免费。

**Q: 现在配置了变量就能用吗？**  
A: 还需在代码里接上 Postgres 存储层；目前 production 仍会报 JSON 写入错误，直到 `db-postgres` 落地。

---

## 下一步

在仓库实现免费版存储（Neon + Blob）时，对助手说：

> 按 `crm-database-free.md` 方案 A 实现 `db-postgres` 和 Blob 上传
