# DATABASE-PLAN.md
# Tansen Pharmacy — Skin-Care Recommendation Application
# Schema Proposal & Architecture Explanation

> **Status:** Proposal only. No migrations, no tables, no upload logic, no IndexedDB implementation.
> **Last revised:** 2026-09-17

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Role Model](#2-role-model)
3. [Entity-Relationship Summary](#3-entity-relationship-summary)
4. [Table Definitions](#4-table-definitions)
   - 4.1 [categories](#41-categories)
   - 4.2 [skin_problems](#42-skin_problems)
   - 4.3 [products](#43-products)
   - 4.4 [product_skin_problems (junction)](#44-product_skin_problems-junction-table)
   - 4.5 [sessions](#45-sessions)
   - 4.6 [session_concerns](#46-session_concerns)
   - 4.7 [session_products](#47-session_products)
   - 4.8 [daily_concern_counts](#48-daily_concern_counts)
   - 4.9 [temporary_share_links](#49-temporary_share_links)
   - 4.10 [catalog_sync_metadata](#410-catalog_sync_metadata)
   - 4.11 [catalog_deletions](#411-catalog_deletions)
5. [Supabase Storage Layout](#5-supabase-storage-layout)
6. [Image Replacement & Permanent Deletion](#6-image-replacement--permanent-deletion)
7. [Catalog Versioning & Incremental Synchronization](#7-catalog-versioning--incremental-synchronization)
8. [Last-Ten-Session Retention Rule](#8-last-ten-session-retention-rule)
9. [Seven-Day Concern Report](#9-seven-day-concern-report)
10. [Offline Architecture Summary](#10-offline-architecture-summary)
11. [Cross-Cutting Conventions](#11-cross-cutting-conventions)

---

## 1. System Overview

```
+-----------------------------------------------------------------+
|                        SUPABASE (Cloud)                         |
|  +--------------+  +--------------+  +------------------------+ |
|  |  PostgreSQL  |  |   Storage    |  |        Auth            | |
|  |  (source of  |  |  (images)    |  |  (admin only)          | |
|  |    truth)    |  |              |  |                        | |
|  +------+-------+  +--------------+  +------------------------+ |
+---------|----------------------------------------------------- --+
          |  catalog sync (active records + deletions)
          v
+-----------------------------------------------------------------+
|                  CUSTOMER DEVICE (Browser)                      |
|  +-------------------------------------------------------------+ |
|  |                     IndexedDB (Dexie.js)                    | |
|  |  categories | skin_problems | products |                   | |
|  |  product_skin_problems | catalog_deletions                 | |
|  |  + cached images (Base64 / Blob URLs)                      | |
|  +-------------------------------------------------------------+ |
|                                                                  |
|  Recommendation engine runs 100% from IndexedDB when offline    |
+-----------------------------------------------------------------+
```

**Key principles:**
- Supabase PostgreSQL is the **single source of truth** for all data.
- The admin panel is **online-only** and writes directly to Supabase.
- The customer recommendation flow works **offline** after the first successful catalog sync.
- Sessions, QR links, and reports require an internet connection.
- Soft-delete (deactivation) and hard-delete (permanent removal) are separate operations.

---

## 2. Role Model

Only **one admin role** exists in this system.

| Actor | Auth | Capabilities |
|---|---|---|
| **Admin** | Supabase Auth (email + password) | Full CRUD on catalog, view all reports, manage QR links |
| **Customer** | Anonymous (no account) | Start a session, receive recommendations, view/download result |

> Supabase Row Level Security (RLS) uses `auth.uid()` and `auth.role()` to enforce access. Customers are treated as the `anon` Supabase role. No customer authentication is implemented.

---

## 3. Entity-Relationship Summary

```
categories ------------------------------ products
   1                                         M
   (one category has many products)

products ---------- product_skin_problems ---------- skin_problems
   M                     (junction)                      M
   (many-to-many via junction table)

sessions --------------------------------- session_concerns
   1                                              M

sessions --------------------------------- session_products
   1                                              M

session_concerns -------------------- skin_problems
   M                                        1

session_products --------------------- products
   M                                         1

daily_concern_counts ---------------- skin_problems
   M                                        1

temporary_share_links --------------- sessions
   M                                        1
```

---

## 4. Table Definitions

---

### 4.1 `categories`

Represents a grouping of products (e.g., "Moisturizers", "Serums", "Sunscreens").

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `name` | `text` | NO | — | Display name; must be unique |
| `description` | `text` | YES | `NULL` | Optional longer description |
| `display_order` | `integer` | NO | `0` | Controls sort order on UI |
| `is_active` | `boolean` | NO | `true` | `false` = deactivated (hidden from recommendations) |
| `created_at` | `timestamptz` | NO | `now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | NO | `now()` | Last modification timestamp; updated via trigger |
| `deleted_at` | `timestamptz` | YES | `NULL` | Set on permanent deletion; tombstone retained for sync |

#### Primary Key
`id`

#### Unique Constraints
`(name) WHERE deleted_at IS NULL` — category names must be unique among non-deleted records.

#### Indexes
```
idx_categories_is_active          ON categories (is_active)
idx_categories_deleted_at         ON categories (deleted_at)
idx_categories_updated_at         ON categories (updated_at)
idx_categories_display_order      ON categories (display_order)
```

#### Required Fields
`id`, `name`, `display_order`, `is_active`, `created_at`, `updated_at`

#### Deletion Behavior
- **Deactivation:** Set `is_active = false`, update `updated_at`. Products in this category are still stored but excluded from new recommendations.
- **Reactivation:** Set `is_active = true`, update `updated_at`.
- **Permanent deletion:** Set `deleted_at = now()`. The row is **retained** as a tombstone so offline devices can learn the record was removed during the next sync. Products linked to this category must also be permanently deleted or re-assigned before the category can be hard-deleted (enforce via application logic).

#### Synchronized to IndexedDB?
**Yes** — active categories are copied to IndexedDB during catalog sync. Tombstoned entries trigger local deletion during incremental sync.

#### Row Level Security
```sql
-- Anon (customers): read active, non-deleted categories only
CREATE POLICY "anon_read_categories"
  ON categories FOR SELECT
  TO anon
  USING (is_active = true AND deleted_at IS NULL);

-- Admin: full access
CREATE POLICY "admin_all_categories"
  ON categories FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

### 4.2 `skin_problems`

Represents a skin concern that a customer can select (e.g., "Acne", "Hyperpigmentation", "Dryness").

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `name` | `text` | NO | — | Display name; unique among active records |
| `description` | `text` | YES | `NULL` | Explanation shown to customer |
| `image_path` | `text` | YES | `NULL` | Supabase Storage path: `skin-problems/{id}/{filename}` |
| `image_version` | `integer` | NO | `1` | Incremented on every image replacement |
| `is_severe` | `boolean` | NO | `false` | If `true`, show professional-attention warning |
| `is_active` | `boolean` | NO | `true` | `false` = hidden from recommendation flow |
| `created_at` | `timestamptz` | NO | `now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | NO | `now()` | Last modification timestamp |
| `deleted_at` | `timestamptz` | YES | `NULL` | Tombstone for permanent deletion |

#### Primary Key
`id`

#### Unique Constraints
`(name) WHERE deleted_at IS NULL`

#### Indexes
```
idx_skin_problems_is_active       ON skin_problems (is_active)
idx_skin_problems_is_severe       ON skin_problems (is_severe)
idx_skin_problems_updated_at      ON skin_problems (updated_at)
idx_skin_problems_deleted_at      ON skin_problems (deleted_at)
```

#### Required Fields
`id`, `name`, `is_severe`, `is_active`, `image_version`, `created_at`, `updated_at`

#### Deletion Behavior
- **Deactivation:** `is_active = false`. Already-recorded `session_concerns` that reference this problem are preserved for historical reporting.
- **Permanent deletion:** `deleted_at = now()`. Tombstone retained. `product_skin_problems` links are cascade-deleted. `daily_concern_counts` entries are retained for historical reporting integrity; they reference by `skin_problem_id` (nullable FK after deletion).

#### Synchronized to IndexedDB?
**Yes** — active, non-deleted skin problems are synced. Tombstones trigger local removal.

#### Row Level Security
```sql
CREATE POLICY "anon_read_skin_problems"
  ON skin_problems FOR SELECT
  TO anon
  USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "admin_all_skin_problems"
  ON skin_problems FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

### 4.3 `products`

A physical product available for recommendation (e.g., "CeraVe Moisturizing Cream").

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `name` | `text` | NO | — | Product display name |
| `brand` | `text` | YES | `NULL` | Brand or manufacturer name |
| `category_id` | `uuid` | NO | — | FK → `categories.id`; one product belongs to one category |
| `price` | `numeric(10,2)` | YES | `NULL` | Retail price in local currency |
| `instruction` | `text` | YES | `NULL` | Usage / application instructions |
| `image_path` | `text` | YES | `NULL` | Supabase Storage path: `products/{id}/{filename}` |
| `image_version` | `integer` | NO | `1` | Incremented on every image replacement |
| `is_active` | `boolean` | NO | `true` | `false` = excluded from new recommendations |
| `created_at` | `timestamptz` | NO | `now()` | Record creation timestamp |
| `updated_at` | `timestamptz` | NO | `now()` | Last modification timestamp |
| `deleted_at` | `timestamptz` | YES | `NULL` | Tombstone for permanent deletion |

#### Primary Key
`id`

#### Foreign Keys
| FK Column | References | On Delete |
|---|---|---|
| `category_id` | `categories(id)` | `RESTRICT` (cannot delete a category with existing products) |

#### Indexes
```
idx_products_category_id          ON products (category_id)
idx_products_is_active            ON products (is_active)
idx_products_updated_at           ON products (updated_at)
idx_products_deleted_at           ON products (deleted_at)
idx_products_brand                ON products (brand)
```

#### Required Fields
`id`, `name`, `category_id`, `is_active`, `image_version`, `created_at`, `updated_at`

#### Deletion Behavior
- **Deactivation:** `is_active = false`. Linked `product_skin_problems` rows remain. Historical `session_products` retain the reference.
- **Permanent deletion:** `deleted_at = now()`. Tombstone retained. `product_skin_problems` rows are cascade-deleted. `session_products.product_id` is SET NULL (product name is denormalized so reports remain accurate).

#### Synchronized to IndexedDB?
**Yes** — active, non-deleted products (with their `category_id`) are synced.

#### Row Level Security
```sql
CREATE POLICY "anon_read_products"
  ON products FOR SELECT
  TO anon
  USING (is_active = true AND deleted_at IS NULL);

CREATE POLICY "admin_all_products"
  ON products FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

### 4.4 `product_skin_problems` (Junction Table)

Links products to skin problems in a many-to-many relationship. A recommendation is generated by matching a customer's selected skin problems to products via this table.

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Surrogate PK (simplifies sync) |
| `product_id` | `uuid` | NO | — | FK → `products(id)` |
| `skin_problem_id` | `uuid` | NO | — | FK → `skin_problems(id)` |
| `created_at` | `timestamptz` | NO | `now()` | When the link was created |
| `updated_at` | `timestamptz` | NO | `now()` | For incremental sync detection |
| `deleted_at` | `timestamptz` | YES | `NULL` | Tombstone if admin removes this specific link |

#### Primary Key
`id`

#### Unique Constraints
`(product_id, skin_problem_id) WHERE deleted_at IS NULL`

#### Foreign Keys
| FK Column | References | On Delete |
|---|---|---|
| `product_id` | `products(id)` | `CASCADE` |
| `skin_problem_id` | `skin_problems(id)` | `CASCADE` |

#### Indexes
```
idx_psp_product_id                ON product_skin_problems (product_id)
idx_psp_skin_problem_id           ON product_skin_problems (skin_problem_id)
idx_psp_updated_at                ON product_skin_problems (updated_at)
idx_psp_deleted_at                ON product_skin_problems (deleted_at)
```

#### Required Fields
`id`, `product_id`, `skin_problem_id`, `created_at`, `updated_at`

#### Deletion Behavior
- Links are cascade-deleted when a product or skin problem is permanently deleted.
- An admin can remove a specific link without deleting either entity: set `deleted_at = now()`.

#### Synchronized to IndexedDB?
**Yes** — this is the core of the offline recommendation engine. Only non-deleted links between active products and active skin problems are synced.

#### Row Level Security
```sql
CREATE POLICY "anon_read_product_skin_problems"
  ON product_skin_problems FOR SELECT
  TO anon
  USING (deleted_at IS NULL);

CREATE POLICY "admin_all_product_skin_problems"
  ON product_skin_problems FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

### 4.5 `sessions`

Records one customer recommendation session. A session starts when a customer enters their name and selects concerns; it ends when recommendations are presented.

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `first_name` | `text` | NO | — | Customer's first name (no account required) |
| `surname` | `text` | NO | — | Customer's surname |
| `created_at` | `timestamptz` | NO | `now()` | Session start time |
| `completed_at` | `timestamptz` | YES | `NULL` | When recommendations were delivered |
| `is_severe_flagged` | `boolean` | NO | `false` | `true` if any selected concern is severe |
| `recommendation_snapshot` | `jsonb` | YES | `NULL` | Full denormalized recommendation at session time (for QR links and PDF downloads) |

> **`recommendation_snapshot` structure:**
> ```json
> {
>   "concerns": [{ "id": "...", "name": "...", "is_severe": false }],
>   "products": [
>     {
>       "id": "...", "name": "...", "brand": "...",
>       "category": "...", "price": 0.00, "instruction": "..."
>     }
>   ]
> }
> ```
> This snapshot ensures QR links and PDF downloads remain accurate even if catalog records are later changed or deleted.

#### Primary Key
`id`

#### Indexes
```
idx_sessions_created_at           ON sessions (created_at DESC)
idx_sessions_is_severe_flagged    ON sessions (is_severe_flagged)
```

#### Required Fields
`id`, `first_name`, `surname`, `created_at`, `is_severe_flagged`

#### Deletion Behavior
Sessions follow the **last-ten retention rule** (see §8). Older sessions are hard-deleted automatically. `session_concerns` and `session_products` are cascade-deleted with the session.

#### Synchronized to IndexedDB?
**No** — sessions are cloud-only in v1.

#### Row Level Security
```sql
-- Anon: insert only (start a new session). Cannot read others' sessions.
CREATE POLICY "anon_insert_session"
  ON sessions FOR INSERT
  TO anon
  WITH CHECK (true);

-- Admin: full read access for reporting
CREATE POLICY "admin_all_sessions"
  ON sessions FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

### 4.6 `session_concerns`

Records which skin problems a customer selected during a session.

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `session_id` | `uuid` | NO | — | FK → `sessions(id)` |
| `skin_problem_id` | `uuid` | YES | `NULL` | FK → `skin_problems(id)` (nullable: problem may be deleted later) |
| `skin_problem_name` | `text` | NO | — | Denormalized name at time of selection (preserved if problem is deleted) |
| `is_severe` | `boolean` | NO | `false` | Snapshot of severity at time of selection |
| `created_at` | `timestamptz` | NO | `now()` | Timestamp of concern selection |

#### Primary Key
`id`

#### Unique Constraints
`(session_id, skin_problem_id)` — a customer cannot select the same concern twice in one session.

#### Foreign Keys
| FK Column | References | On Delete |
|---|---|---|
| `session_id` | `sessions(id)` | `CASCADE` |
| `skin_problem_id` | `skin_problems(id)` | `SET NULL` |

#### Indexes
```
idx_sc_session_id                 ON session_concerns (session_id)
idx_sc_skin_problem_id            ON session_concerns (skin_problem_id)
idx_sc_created_at                 ON session_concerns (created_at)
```

#### Required Fields
`id`, `session_id`, `skin_problem_name`, `is_severe`, `created_at`

#### Deletion Behavior
Cascade-deleted when the parent session is deleted.

#### Synchronized to IndexedDB?
**No** — session data is online-only.

#### Row Level Security
```sql
CREATE POLICY "anon_insert_session_concerns"
  ON session_concerns FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "admin_all_session_concerns"
  ON session_concerns FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

### 4.7 `session_products`

Records which products were recommended to a customer in a session.

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `session_id` | `uuid` | NO | — | FK → `sessions(id)` |
| `product_id` | `uuid` | YES | `NULL` | FK → `products(id)` (nullable: product may be deleted later) |
| `product_name` | `text` | NO | — | Denormalized at time of recommendation |
| `brand` | `text` | YES | `NULL` | Denormalized at time of recommendation |
| `category_name` | `text` | YES | `NULL` | Denormalized category name at time of recommendation |
| `price` | `numeric(10,2)` | YES | `NULL` | Denormalized at time of recommendation |
| `display_order` | `integer` | NO | `0` | Order in which product appeared in result |
| `created_at` | `timestamptz` | NO | `now()` | Timestamp |

#### Primary Key
`id`

#### Foreign Keys
| FK Column | References | On Delete |
|---|---|---|
| `session_id` | `sessions(id)` | `CASCADE` |
| `product_id` | `products(id)` | `SET NULL` |

#### Indexes
```
idx_sp_session_id                 ON session_products (session_id)
idx_sp_product_id                 ON session_products (product_id)
```

#### Required Fields
`id`, `session_id`, `product_name`, `display_order`, `created_at`

#### Deletion Behavior
Cascade-deleted when the parent session is deleted.

#### Synchronized to IndexedDB?
**No**

#### Row Level Security
```sql
CREATE POLICY "anon_insert_session_products"
  ON session_products FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "admin_all_session_products"
  ON session_products FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

### 4.8 `daily_concern_counts`

An aggregation table that accumulates how many times each skin problem was selected, bucketed by calendar day. This powers the 7-day concern frequency report without requiring a full scan of `session_concerns`.

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `skin_problem_id` | `uuid` | YES | `NULL` | FK → `skin_problems(id)` (`SET NULL` if problem deleted) |
| `skin_problem_name` | `text` | NO | — | Denormalized name (preserved even after deletion) |
| `count_date` | `date` | NO | — | Calendar date (UTC) for this bucket |
| `selection_count` | `integer` | NO | `0` | Number of times selected on this date |
| `updated_at` | `timestamptz` | NO | `now()` | Last upsert time |

#### Primary Key
`id`

#### Unique Constraints
`(skin_problem_id, count_date)` — one row per problem per day.

#### Foreign Keys
| FK Column | References | On Delete |
|---|---|---|
| `skin_problem_id` | `skin_problems(id)` | `SET NULL` |

#### Indexes
```
idx_dcc_count_date                ON daily_concern_counts (count_date DESC)
idx_dcc_skin_problem_id           ON daily_concern_counts (skin_problem_id)
idx_dcc_skin_problem_name         ON daily_concern_counts (skin_problem_name)
```

#### Required Fields
`id`, `skin_problem_name`, `count_date`, `selection_count`, `updated_at`

#### Population Strategy
When a session is completed, the application performs an upsert:
```sql
INSERT INTO daily_concern_counts (skin_problem_id, skin_problem_name, count_date, selection_count)
VALUES ($1, $2, CURRENT_DATE, 1)
ON CONFLICT (skin_problem_id, count_date)
DO UPDATE SET
  selection_count = daily_concern_counts.selection_count + 1,
  skin_problem_name = EXCLUDED.skin_problem_name,
  updated_at = now();
```

#### Deletion Behavior
Rows are **never automatically deleted**. Historical counts are retained indefinitely.

#### Synchronized to IndexedDB?
**No** — admin reporting only.

#### Row Level Security
```sql
-- Anon: no access
CREATE POLICY "anon_no_daily_counts"
  ON daily_concern_counts FOR ALL
  TO anon
  USING (false);

-- Admin: full access
CREATE POLICY "admin_all_daily_counts"
  ON daily_concern_counts FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

### 4.9 `temporary_share_links`

Stores short-lived tokens for QR-code recommendation links. The token encodes access to a specific session's recommendation snapshot without exposing the session ID in the URL.

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `token` | `text` | NO | — | Cryptographically random opaque token (e.g. 32-byte hex); used in QR URL |
| `session_id` | `uuid` | NO | — | FK → `sessions(id)` |
| `expires_at` | `timestamptz` | NO | — | Expiry timestamp (e.g. `now() + interval '24 hours'`) |
| `accessed_count` | `integer` | NO | `0` | How many times the link was opened |
| `max_access_count` | `integer` | YES | `NULL` | Optional access cap (NULL = unlimited until expiry) |
| `created_at` | `timestamptz` | NO | `now()` | Creation timestamp |
| `revoked_at` | `timestamptz` | YES | `NULL` | Set if admin manually revokes the link before expiry |

#### Primary Key
`id`

#### Unique Constraints
`(token)` — tokens must be globally unique.

#### Foreign Keys
| FK Column | References | On Delete |
|---|---|---|
| `session_id` | `sessions(id)` | `CASCADE` |

#### Indexes
```
idx_tsl_token                     ON temporary_share_links (token)
idx_tsl_session_id                ON temporary_share_links (session_id)
idx_tsl_expires_at                ON temporary_share_links (expires_at)
```

#### Required Fields
`id`, `token`, `session_id`, `expires_at`, `accessed_count`, `created_at`

#### QR URL Format
```
https://tansen.app/r/{token}
```
The application server resolves `token` → `session_id` → `recommendation_snapshot` without exposing any permanent identifier in the URL. Once `expires_at` is passed or `revoked_at` is set, the link returns a 404/410 response.

#### Deletion Behavior
- **Expiry:** Application checks `expires_at` on every access. Expired rows can be cleaned up by a scheduled Supabase Edge Function or `pg_cron` job.
- **Cascade deletion:** Removed automatically when the linked session is deleted by the retention rule.

#### Synchronized to IndexedDB?
**No** — requires internet.

#### Row Level Security
```sql
-- Anon: read a single link by token (for QR resolution), enforce expiry in query
CREATE POLICY "anon_read_share_link_by_token"
  ON temporary_share_links FOR SELECT
  TO anon
  USING (
    revoked_at IS NULL
    AND expires_at > now()
  );

-- Admin: full access
CREATE POLICY "admin_all_share_links"
  ON temporary_share_links FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

### 4.10 `catalog_sync_metadata`

A single-row table that records the state of the most recent successful catalog publication. The client device reads this to determine what baseline to use for incremental sync requests.

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `sync_key` | `text` | NO | `'global'` | Always `'global'` in v1; allows future multi-tenant expansion |
| `catalog_version` | `bigint` | NO | `1` | Monotonically increasing counter; incremented on every catalog change |
| `last_published_at` | `timestamptz` | NO | `now()` | Timestamp of the last catalog change |
| `total_active_products` | `integer` | NO | `0` | Snapshot count for client-side validation |
| `total_active_skin_problems` | `integer` | NO | `0` | Snapshot count |
| `total_active_categories` | `integer` | NO | `0` | Snapshot count |
| `updated_at` | `timestamptz` | NO | `now()` | Last update to this metadata row |

#### Primary Key
`id`

#### Unique Constraints
`(sync_key)`

#### Indexes
```
idx_csm_sync_key                  ON catalog_sync_metadata (sync_key)
idx_csm_catalog_version           ON catalog_sync_metadata (catalog_version DESC)
```

#### Required Fields
All fields required.

#### Deletion Behavior
This row is **never deleted**; it is always updated in-place.

#### Synchronized to IndexedDB?
**Yes** — the client stores the latest `catalog_version` and `last_published_at` locally. On next app open, it compares the local version with the server version. If they differ, an incremental sync is triggered.

#### Row Level Security
```sql
-- Anon: read-only
CREATE POLICY "anon_read_sync_metadata"
  ON catalog_sync_metadata FOR SELECT
  TO anon
  USING (true);

-- Admin: full access
CREATE POLICY "admin_all_sync_metadata"
  ON catalog_sync_metadata FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

### 4.11 `catalog_deletions`

A tombstone log that records every permanent deletion of a catalog entity. Offline devices consume this table during incremental sync to learn which local IndexedDB records must be purged.

#### Fields

| Column | Type | Nullable | Default | Notes |
|---|---|---|---|---|
| `id` | `uuid` | NO | `gen_random_uuid()` | Primary key |
| `entity_type` | `text` | NO | — | One of: `'category'`, `'skin_problem'`, `'product'`, `'product_skin_problem'` |
| `entity_id` | `uuid` | NO | — | The UUID of the deleted record in its original table |
| `deleted_at` | `timestamptz` | NO | `now()` | When the deletion occurred |
| `catalog_version` | `bigint` | NO | — | The `catalog_version` at time of deletion (for ordered incremental sync) |

#### Primary Key
`id`

#### Unique Constraints
`(entity_type, entity_id)` — one tombstone per entity.

#### Indexes
```
idx_cd_entity_type                ON catalog_deletions (entity_type)
idx_cd_entity_id                  ON catalog_deletions (entity_id)
idx_cd_deleted_at                 ON catalog_deletions (deleted_at)
idx_cd_catalog_version            ON catalog_deletions (catalog_version)
```

#### Required Fields
All fields required.

#### Deletion Behavior
Tombstones are **never deleted** automatically. They can be archived or pruned by an admin after a long retention window (e.g., 90 days) once all offline devices are assumed to have synced.

#### Synchronized to IndexedDB?
**Yes** — during incremental sync, the client fetches tombstones created after `last_synced_at` and removes corresponding records from IndexedDB. The tombstones themselves are consumed and discarded; they are not stored in IndexedDB.

#### Row Level Security
```sql
-- Anon: read-only (needed for offline sync)
CREATE POLICY "anon_read_catalog_deletions"
  ON catalog_deletions FOR SELECT
  TO anon
  USING (true);

-- Admin: full access
CREATE POLICY "admin_all_catalog_deletions"
  ON catalog_deletions FOR ALL
  TO authenticated
  USING (auth.uid() IS NOT NULL);
```

---

## 5. Supabase Storage Layout

All images are stored in a **single private bucket** named `tansen-catalog`. Images are served via signed URLs (for admin preview) or cached as Blobs in IndexedDB (for offline customer use).

### Bucket Structure

```
tansen-catalog/
|-- products/
|   `-- {product_id}/
|       `-- hero.webp
|           (e.g., products/a1b2c3d4.../hero.webp)
|
`-- skin-problems/
    `-- {skin_problem_id}/
        `-- cover.webp
            (e.g., skin-problems/f7e8d9c0.../cover.webp)
```

### Path Conventions

| Entity | Path Pattern | Example |
|---|---|---|
| Product image | `products/{product_id}/{filename}` | `products/uuid.../hero.webp` |
| Skin problem image | `skin-problems/{skin_problem_id}/{filename}` | `skin-problems/uuid.../cover.webp` |

### Why Use Entity ID in the Path?

Using the entity's UUID as the folder ensures:
1. Paths are globally unique and predictable without generating random filenames.
2. The admin can replace images by uploading to the same folder.
3. Old images in the same folder can be identified and deleted atomically on replacement.

### Image Access Policy

| Context | Method |
|---|---|
| Admin preview in browser | Supabase signed URL (server-generated, short-lived, e.g. 60 minutes) |
| Customer offline use | Image downloaded as a Blob during catalog sync and stored in IndexedDB |
| QR link / PDF download | Signed URL generated on-demand (requires internet) |

---

## 6. Image Replacement & Permanent Deletion

### Image Replacement Workflow

When an admin replaces an existing image:

1. Admin uploads the new image to Supabase Storage:
   `products/{product_id}/hero.webp` (overwrite in-place, or new filename)
2. The application backend:
   a. Deletes the old file from Storage using the stored `image_path` (if the filename changed).
   b. Updates `products.image_path` to the new path.
   c. **Increments `products.image_version` by 1.**
   d. Updates `products.updated_at`.
3. `catalog_sync_metadata.catalog_version` is incremented and `last_published_at` is updated.

The `image_version` field allows offline devices to detect that even if the `image_path` is unchanged (same filename), the image content has changed, and they must re-download it during the next sync.

### Permanent Image Deletion

When a product or skin problem is permanently deleted:

1. The `deleted_at` tombstone is written to the main table.
2. A tombstone is added to `catalog_deletions`.
3. All files under `products/{product_id}/` or `skin-problems/{skin_problem_id}/` are deleted from Supabase Storage.
4. `catalog_sync_metadata.catalog_version` is incremented.

> **Important:** Storage deletion must be treated as **best-effort cleanup**. If Storage deletion fails, the application should retry asynchronously (e.g., via Edge Function with retry logic) and not block the database tombstone write.

### Image Naming Recommendation

Use stable, descriptive filenames:
- `hero.webp` for the primary product image.
- `cover.webp` for the skin problem cover.

Avoid timestamp-based filenames. Use `image_version` in the database to track staleness, not the filename itself.

---

## 7. Catalog Versioning & Incremental Synchronization

### Version Counter

`catalog_sync_metadata.catalog_version` is a monotonically increasing `bigint`. It is incremented by a database trigger or Edge Function whenever any of the following events occur:

| Event | Tables Affected |
|---|---|
| Category created, updated, deactivated, reactivated, deleted | `categories` |
| Skin problem created, updated, deactivated, reactivated, deleted | `skin_problems` |
| Product created, updated, deactivated, reactivated, deleted | `products` |
| Product-problem link added or removed | `product_skin_problems` |

### First Synchronization (Full Sync)

Triggered when the client has no local IndexedDB data (first launch or after a reset).

**Server response payload:**
```json
{
  "catalog_version": 42,
  "last_published_at": "2026-09-17T10:00:00Z",
  "categories": [...],
  "skin_problems": [...],
  "products": [...],
  "product_skin_problems": [...],
  "images": [
    {
      "entity_type": "product",
      "entity_id": "uuid...",
      "image_path": "products/uuid.../hero.webp",
      "image_version": 3
    }
  ]
}
```

**Client steps:**
1. Clear existing IndexedDB stores.
2. Write all received records.
3. Download all images as Blobs and store them in IndexedDB (keyed by `entity_type + entity_id`).
4. Save `catalog_version` and `last_published_at` locally.

### Incremental Synchronization

Triggered when the client opens the app and detects its local `catalog_version` is behind the server's.

**Server response payload:**
```json
{
  "catalog_version": 48,
  "last_published_at": "2026-09-17T18:00:00Z",
  "upserts": {
    "categories": [...],
    "skin_problems": [...],
    "products": [...],
    "product_skin_problems": [...]
  },
  "deletions": [
    { "entity_type": "product", "entity_id": "uuid..." },
    { "entity_type": "product_skin_problem", "entity_id": "uuid..." }
  ],
  "image_updates": [
    {
      "entity_type": "product",
      "entity_id": "uuid...",
      "image_path": "products/uuid.../hero.webp",
      "image_version": 4
    }
  ]
}
```

**Client steps:**
1. **Upsert** changed records into IndexedDB.
2. **Delete** tombstoned records from IndexedDB by `entity_id`.
3. **Re-download** images where `image_version` > locally stored version.
4. Deactivated records (`is_active = false`) are **removed** from IndexedDB (they must not appear in offline recommendations).
5. Update local `catalog_version`.

### Sync Trigger Timing

The client checks for catalog updates:
- On app startup (if online).
- After returning online from offline mode.
- Periodically in the background (optional future enhancement).

---

## 8. Last-Ten-Session Retention Rule

Only the **ten most recent** sessions are retained. This applies globally across all customers (since customers have no accounts).

### Enforcement Mechanism

A **PostgreSQL trigger** on the `sessions` table fires `AFTER INSERT`:

```sql
-- Pseudocode for trigger function
FUNCTION enforce_session_limit()
  DELETE FROM sessions
  WHERE id NOT IN (
    SELECT id FROM sessions ORDER BY created_at DESC LIMIT 10
  );
  RETURN NEW;
```

> **Note:** This trigger runs synchronously within the same transaction as the INSERT. If performance becomes a concern with very large session tables (unlikely given the 10-row cap), it can be moved to a Supabase Edge Function triggered by the `postgres_changes` webhook.

### What Happens to QR Links?

When a session is cascade-deleted by the retention trigger, all its `temporary_share_links` rows are also cascade-deleted (FK `ON DELETE CASCADE`). Existing QR codes pointing to that session will return a 404/410 response immediately.

### What Happens to Daily Counts?

`daily_concern_counts` is populated **during session completion** (via upsert), before the retention trigger would fire. Therefore, even if a session is later purged, its contribution to `daily_concern_counts` is already recorded and preserved permanently.

---

## 9. Seven-Day Concern Report

The admin dashboard displays the most frequently selected skin concerns over the last rolling 7 calendar days.

### Query Against `daily_concern_counts`

```sql
SELECT
  skin_problem_id,
  skin_problem_name,
  SUM(selection_count) AS total_selections
FROM daily_concern_counts
WHERE count_date >= CURRENT_DATE - INTERVAL '6 days'
  AND count_date <= CURRENT_DATE
GROUP BY skin_problem_id, skin_problem_name
ORDER BY total_selections DESC
LIMIT 20;
```

> `CURRENT_DATE - INTERVAL '6 days'` gives a 7-day window inclusive of today.
> `skin_problem_name` is grouped alongside the ID to handle deleted problems (`skin_problem_id IS NULL`) where the denormalized name is the only remaining identifier.

### Why `daily_concern_counts` Instead of Scanning `session_concerns`?

| Approach | Pros | Cons |
|---|---|---|
| Scan `session_concerns` | Always accurate at query time | Sessions are capped at 10 rows — cannot cover 7 days |
| `daily_concern_counts` aggregation | Fast, supports any history window | Requires upsert discipline on session completion |

**Sessions are capped at 10 rows**, which means scanning `session_concerns` directly would only cover the last 10 sessions — not necessarily 7 days of data. The `daily_concern_counts` table is therefore **essential** for meaningful reporting beyond the most recent 10 sessions.

### Report Caching

The 7-day report query is lightweight due to indexing on `count_date`. No additional caching layer is required in v1.

---

## 10. Offline Architecture Summary

### IndexedDB Stores (Dexie.js)

| Store Name | Primary Key | Purpose |
|---|---|---|
| `categories` | `id` | Active categories for display grouping |
| `skin_problems` | `id` | Active concerns shown to customer |
| `products` | `id` | Active products for recommendation |
| `product_skin_problems` | `id` | Links for matching concerns to products |
| `catalog_meta` | `sync_key` | Local `catalog_version` + `last_synced_at` |
| `images` | `entity_type + entity_id` | Blob storage keyed by entity + image_version |

### Recommendation Engine (Offline)

Given a customer's selected `skin_problem_id` set `S`:

```
1. Query product_skin_problems WHERE skin_problem_id IN S
2. Collect distinct product_ids → P
3. Query products WHERE id IN P AND is_active = true
4. Group products by category_id
5. For each category, deduplicate
   (each product appears exactly once per category on the recommendation screen)
6. Return grouped recommendation list ordered by display_order
```

All steps run against local IndexedDB — **no network call required**.

### Severe Warning Logic

During step 1, if any selected `skin_problem.is_severe = true`:
- Display an inline warning banner:
  *"One or more of your selected concerns may benefit from professional attention. Please consult a dermatologist."*
- **Do not block** the recommendation — continue displaying products as normal.

### Session Saving (Online Required)

After the recommendation is generated offline, the app queues the session data in memory. When connectivity is restored:
1. The session is saved to Supabase (`sessions`, `session_concerns`, `session_products`).
2. `daily_concern_counts` is upserted.
3. A `temporary_share_link` is generated if the customer requests a QR code.

> **v1 limitation:** If the customer closes the app before connectivity is restored, the session data is lost. Persistent offline session queuing is a future enhancement.

---

## 11. Cross-Cutting Conventions

### Timestamp Trigger

All tables with `updated_at` should have a PostgreSQL trigger that automatically sets `NEW.updated_at = now()` on every UPDATE.

### UUID Generation

All primary keys use `gen_random_uuid()` (PostgreSQL 13+), available natively in Supabase.

### Soft Delete vs. Hard Delete Summary

| Table | `is_active` Deactivation | `deleted_at` Tombstone | Cascade on Hard Delete |
|---|---|---|---|
| `categories` | YES | YES | RESTRICT if products exist |
| `skin_problems` | YES | YES | CASCADE `product_skin_problems` |
| `products` | YES | YES | CASCADE `product_skin_problems`; SET NULL `session_products.product_id` |
| `product_skin_problems` | NO | YES (link removal) | — |
| `sessions` | NO | NO (hard delete only, retention rule) | CASCADE `session_concerns`, `session_products`, `temporary_share_links` |
| `session_concerns` | NO | NO | — |
| `session_products` | NO | NO | — |
| `daily_concern_counts` | NO | NO (never deleted) | — |
| `temporary_share_links` | NO | NO (uses `revoked_at` + `expires_at`) | — |
| `catalog_sync_metadata` | NO | NO (never deleted) | — |
| `catalog_deletions` | NO | NO (never deleted, archive only) | — |

### IndexedDB Sync Eligibility Summary

| Table | Synced to IndexedDB | Notes |
|---|---|---|
| `categories` | YES | Active only |
| `skin_problems` | YES | Active only |
| `products` | YES | Active only |
| `product_skin_problems` | YES | Non-deleted links only |
| `catalog_sync_metadata` | YES | Version number only |
| `catalog_deletions` | YES (consumed) | Tombstones consumed and purged from IndexedDB; not stored |
| `sessions` | NO | Online-only |
| `session_concerns` | NO | Online-only |
| `session_products` | NO | Online-only |
| `daily_concern_counts` | NO | Admin reporting only |
| `temporary_share_links` | NO | Requires internet |

---

*End of DATABASE-PLAN.md*
*Next step: Review this schema proposal. Once approved, proceed to Supabase migration scripts and IndexedDB store initialization with Dexie.js.*
