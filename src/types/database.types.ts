// =============================================================================
// database.types.ts
// Tansen Pharmacy — Supabase Database Type Definitions
//
// HOW TO REGENERATE THIS FILE AUTOMATICALLY:
//   npx supabase gen types typescript \
//     --project-id ccxholtuuaybwqxkpgie \
//     --schema public \
//     > src/types/database.types.ts
//
// Always regenerate after applying migrations.
// =============================================================================

// ---------------------------------------------------------------------------
// Shared primitives
// ---------------------------------------------------------------------------
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------------------------------------------------------------------------
// Recommendation snapshot shape (stored in sessions.recommendation_snapshot)
// ---------------------------------------------------------------------------
export interface RecommendationConcernSnapshot {
  id: string;
  name: string;
  is_severe: boolean;
}

export interface RecommendationProductSnapshot {
  id: string;
  name: string;
  brand: string | null;
  category: string | null;
  price: number | null;
  instruction: string | null;
}

export interface RecommendationSnapshot {
  concerns: RecommendationConcernSnapshot[];
  products: RecommendationProductSnapshot[];
}

// ---------------------------------------------------------------------------
// Catalog entity types (valid values for catalog_deletions.entity_type)
// ---------------------------------------------------------------------------
export type CatalogEntityType =
  | 'category'
  | 'skin_problem'
  | 'product'
  | 'product_skin_problem';

// ---------------------------------------------------------------------------
// DATABASE — Row types
// Each interface represents one row returned from Supabase.
// ---------------------------------------------------------------------------

export interface AdminProfileRow {
  id: string;
  created_at: string;
}

export interface CategoryRow {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SkinProblemRow {
  id: string;
  name: string;
  description: string | null;
  image_path: string | null;
  image_version: number;
  is_severe: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductRow {
  id: string;
  name: string;
  brand: string | null;
  category_id: string;
  price: number | null;
  instruction: string | null;
  image_path: string | null;
  image_version: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ProductSkinProblemRow {
  id: string;
  product_id: string;
  skin_problem_id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface SessionRow {
  id: string;
  first_name: string;
  surname: string;
  completed_at: string | null;
  is_severe_flagged: boolean;
  recommendation_snapshot: RecommendationSnapshot | null;
  created_at: string;
}

export interface SessionConcernRow {
  id: string;
  session_id: string;
  skin_problem_id: string | null;
  skin_problem_name: string;
  is_severe: boolean;
  created_at: string;
}

export interface SessionProductRow {
  id: string;
  session_id: string;
  product_id: string | null;
  product_name: string;
  brand: string | null;
  category_name: string | null;
  price: number | null;
  instruction: string | null;
  display_order: number;
  created_at: string;
}

export interface DailyConcernCountRow {
  id: string;
  skin_problem_id: string | null;
  skin_problem_name: string;
  count_date: string;       // ISO date string: "YYYY-MM-DD"
  selection_count: number;
  updated_at: string;
}

export interface TemporaryShareLinkRow {
  id: string;
  token: string;
  session_id: string;
  expires_at: string;
  accessed_count: number;
  max_access_count: number | null;
  created_at: string;
  revoked_at: string | null;
}

export interface CatalogSyncMetadataRow {
  id: string;
  sync_key: string;
  catalog_version: number;
  last_published_at: string;
  total_active_products: number;
  total_active_skin_problems: number;
  total_active_categories: number;
  updated_at: string;
}

export interface CatalogDeletionRow {
  id: string;
  entity_type: CatalogEntityType;
  entity_id: string;
  deleted_at: string;
  catalog_version: number;
}

// ---------------------------------------------------------------------------
// DATABASE — Insert types
// Used when calling .insert() — excludes auto-generated fields.
// ---------------------------------------------------------------------------

export type CategoryInsert = {
  name: string;
  description?: string | null;
  display_order?: number;
  is_active?: boolean;
};

export type SkinProblemInsert = {
  name: string;
  description?: string | null;
  image_path?: string | null;
  image_version?: number;
  is_severe?: boolean;
  is_active?: boolean;
};

export type ProductInsert = {
  name: string;
  brand?: string | null;
  category_id: string;
  price?: number | null;
  instruction?: string | null;
  image_path?: string | null;
  image_version?: number;
  is_active?: boolean;
};

export type ProductSkinProblemInsert = {
  product_id: string;
  skin_problem_id: string;
};

export type SessionInsert = {
  first_name: string;
  surname: string;
  completed_at?: string | null;
  is_severe_flagged?: boolean;
  recommendation_snapshot?: RecommendationSnapshot | null;
};

export type SessionConcernInsert = {
  session_id: string;
  skin_problem_id?: string | null;
  skin_problem_name: string;
  is_severe?: boolean;
};

export type SessionProductInsert = {
  session_id: string;
  product_id?: string | null;
  product_name: string;
  brand?: string | null;
  category_name?: string | null;
  price?: number | null;
  instruction?: string | null;
  display_order?: number;
};

// ---------------------------------------------------------------------------
// DATABASE — Update types
// Used when calling .update() — all fields optional except those being changed.
// ---------------------------------------------------------------------------

export type CategoryUpdate = Partial<CategoryInsert>;
export type SkinProblemUpdate = Partial<SkinProblemInsert>;
export type ProductUpdate = Partial<ProductInsert>;

// ---------------------------------------------------------------------------
// DATABASE — Full Supabase schema type map
// Compatible with createClient<Database>() from @supabase/supabase-js
// ---------------------------------------------------------------------------
export interface Database {
  public: {
    Tables: {
      admin_profiles: {
        Row: AdminProfileRow;
        Insert: { id: string };
        Update: Record<string, never>;
      };
      categories: {
        Row: CategoryRow;
        Insert: CategoryInsert;
        Update: CategoryUpdate;
      };
      skin_problems: {
        Row: SkinProblemRow;
        Insert: SkinProblemInsert;
        Update: SkinProblemUpdate;
      };
      products: {
        Row: ProductRow;
        Insert: ProductInsert;
        Update: ProductUpdate;
      };
      product_skin_problems: {
        Row: ProductSkinProblemRow;
        Insert: ProductSkinProblemInsert;
        Update: Record<string, never>;
      };
      sessions: {
        Row: SessionRow;
        Insert: SessionInsert;
        Update: Record<string, never>;
      };
      session_concerns: {
        Row: SessionConcernRow;
        Insert: SessionConcernInsert;
        Update: Record<string, never>;
      };
      session_products: {
        Row: SessionProductRow;
        Insert: SessionProductInsert;
        Update: Record<string, never>;
      };
      daily_concern_counts: {
        Row: DailyConcernCountRow;
        Insert: Record<string, never>; // insert via tansen_record_concern_selection() RPC only
        Update: Record<string, never>;
      };
      temporary_share_links: {
        Row: TemporaryShareLinkRow;
        Insert: {
          token: string;
          session_id: string;
          expires_at: string;
          max_access_count?: number | null;
        };
        Update: { revoked_at?: string | null };
      };
      catalog_sync_metadata: {
        Row: CatalogSyncMetadataRow;
        Insert: Record<string, never>; // seeded by migration; update via triggers
        Update: Record<string, never>;
      };
      catalog_deletions: {
        Row: CatalogDeletionRow;
        Insert: {
          entity_type: CatalogEntityType;
          entity_id: string;
          catalog_version: number;
        };
        Update: Record<string, never>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      tansen_is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      tansen_generate_share_token: {
        Args: Record<string, never>;
        Returns: string;
      };
      tansen_increment_share_link_access: {
        Args: { p_token: string };
        Returns: void;
      };
      tansen_record_concern_selection: {
        Args: {
          p_skin_problem_id: string;
          p_skin_problem_name: string;
        };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
  };
}
