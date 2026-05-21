# Supabase 安装与配置 — Luna CRM

免费档即可：500 MB 数据库 + 1 GB 文件存储。

---

## 1. 创建 Supabase 项目

1. 打开 [supabase.com](https://supabase.com) → **Start your project** → 用 GitHub 登录  
2. **New project**  
   - Organization：自选  
   - Name：`luna-crm`  
   - Database Password：生成并**保存**  
   - Region：选离用户近的（如 `East US`）  
3. 等待项目创建完成（约 1–2 分钟）

---

## 2. 运行数据库表结构

1. 左侧 **SQL Editor** → **New query**  
2. 复制仓库文件全文：  
   [`supabase/migrations/20260520120000_crm_schema.sql`](../supabase/migrations/20260520120000_crm_schema.sql)  
3. 点击 **Run**  
4. 左侧 **Table Editor** 应看到：`students`, `class_sessions`, `artworks`, `class_reviews`, `payments`, `attendances`

---

## 3. 创建图片存储桶（Storage）

1. 左侧 **Storage** → **New bucket**  
2. 设置：  
   - **Name**：`crm-artworks`（必须与代码一致）  
   - **Public bucket**：✅ 开启（课堂照片需公网 URL 给 Claude 读图）  
3. **Create bucket**

可选策略（Storage → crm-artworks → Policies）：允许 service role 上传；公开读。

---

## 4. 获取 API 密钥

**Project Settings** → **API**：

| 字段 | 环境变量 |
|------|----------|
| Project URL | `NEXT_PUBLIC_SUPABASE_URL` |
| Publishable key | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` |
| `service_role` key（secret） | `SUPABASE_SERVICE_ROLE_KEY` |

SSR 工具：`utils/supabase/client.ts`、`server.ts`、`middleware.ts`（`@supabase/ssr`）。

⚠️ **切勿**把 `service_role` 暴露到浏览器或提交 Git。CRM 后台写入必须用 service_role。

---

## 5. 本地 `.env.local`

```env
CRM_STORAGE=supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # 必填：API → service_role

ADMIN_PASSWORD=your-strong-password
CLAUDE_API_KEY=sk-ant-...
```

本地若继续用 JSON 文件：

```env
CRM_STORAGE=json
# 不填 Supabase 变量即可
```

---

## 6. Vercel Production

1. Vercel 项目 → **Settings** → **Environment Variables**  
2. 为 **Production**（及 Preview 如需要）添加：

| Name | Value |
|------|--------|
| `CRM_STORAGE` | `supabase` |
| `NEXT_PUBLIC_SUPABASE_URL` | 从 Supabase 复制 |
| `SUPABASE_SERVICE_ROLE_KEY` | **service_role** 密钥（见下方） |
| `ADMIN_PASSWORD` | 强密码 |
| `CLAUDE_API_KEY` | Anthropic 密钥 |

可选（SSR 用，CRM 写入不依赖此项）：

| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable key |

### ⚠️ 常见错误：只配了 Publishable Key

Vercel 连接 Supabase 时**通常只会自动添加** URL 和 Publishable/Anon key。  
**`SUPABASE_SERVICE_ROLE_KEY` 必须手动添加**：

1. 打开 [Supabase Dashboard](https://supabase.com/dashboard) → 你的项目  
2. **Project Settings** → **API**  
3. 找到 **`service_role`**（标注 secret）→ **Reveal** → 复制  
4. 粘贴到 Vercel 变量名 **`SUPABASE_SERVICE_ROLE_KEY`**（整行只有 JWT，不要 `#` 注释）  
5. 勾选 **Production** → Save → **Redeploy**

### 部署后自检

登录后台后访问（需已登录 cookie）：

`GET /api/admin/storage-status`

应看到 `"backend":"supabase"` 且 `"serviceRole":true`。

3. **Deployments** → 最新部署 → **Redeploy**

---

## 7. 验证

```bash
# 本地（需 .env.local 已配置 supabase）
CRM_STORAGE=supabase npm run dev
```

1. 打开 `http://localhost:3000/studio` → 登录  
2. **新建学生** → 刷新后仍在  
3. **添加上课记录** + 上传照片 → 保存成功  
4. **生成 AI 点评** → 无报错  

Production：同样流程在 `https://你的域名/studio`。

---

## 8. 从 JSON 迁移旧数据（可选）

若本地有 `data/crm/db.json`：

```bash
# 需先配置 Supabase 环境变量
CRM_STORAGE=supabase node scripts/migrate-json-to-supabase.mjs
```

（脚本见仓库；若尚未添加，可先在后台手动重建学生记录。）

---

## 9. 故障排查

| 错误 | 处理 |
|------|------|
| `Supabase is not configured` | 检查 URL + service_role 是否写入 `.env.local` / Vercel |
| `relation "students" does not exist` | 在 SQL Editor 重新运行 migration |
| `Storage upload failed` / bucket | 创建名为 `crm-artworks` 的 **Public** bucket |
| `Invalid API key` | 勿用 `anon` key，需 **service_role** |
| 仍提示 JSON 无法保存 | 确认 `CRM_STORAGE=supabase` 并已 redeploy |

---

## 10. 架构说明

```
CRM_STORAGE=supabase
    ↓
lib/crm/db.ts → lib/crm/db-supabase.ts
    ↓
Supabase Postgres（表） + Storage bucket crm-artworks（图）
```

依赖：`@supabase/supabase-js`（已加入 `package.json`）。
