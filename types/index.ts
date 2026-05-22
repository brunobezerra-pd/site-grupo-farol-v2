export type Talent = {
  id: string;
  name: string;
  description: string | null;
  photo_url: string | null;
  photo_pending: boolean | null;
  instagram_url: string | null;
  tiktok_url: string | null;
  featured: boolean | null;
  categories: string[] | null;
  followers_range: string | null;
  civil_status: string | null;
  has_children: boolean | null;
  dietary_restriction: string | null;
  has_pet: string | null;
  location: string | null;
  birth_date: string | null;
  gender: string | null;
  lgbtqia: boolean | null;
  of_age: boolean | null;
  created_at: string | null;
};

export type TalentInsert = Partial<Omit<Talent, "id" | "name" | "created_at">> & {
  name: string;
  id?: string;
  created_at?: string;
};

export type TalentUpdate = Partial<TalentInsert>;

export type Partner = {
  id: string;
  logo_url: string;
  sort_order: number | null;
  created_at: string | null;
};

export type PartnerInsert = {
  id?: string;
  logo_url: string;
  sort_order?: number | null;
  created_at?: string;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: string | null;
  updated_at: string | null;
};

export type HeroMediaPlacement = "carousel" | "mobile";

export type HeroMediaType = "image" | "video_file" | "video_url" | "embed";

export type HeroMediaItem = {
  id: string;
  placement: HeroMediaPlacement;
  media_type: HeroMediaType;
  source_url: string | null;
  embed_code: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: string | null;
  updated_at: string | null;
};

export type HeroMediaItemInsert = {
  id?: string;
  placement: HeroMediaPlacement;
  media_type: HeroMediaType;
  source_url?: string | null;
  embed_code?: string | null;
  alt_text?: string | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
};

export type HeroMediaItemUpdate = Partial<HeroMediaItemInsert>;

type TableDefinition<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      talents: TableDefinition<Talent, TalentInsert, TalentUpdate>;
      partners: TableDefinition<
        Partner,
        PartnerInsert,
        Partial<PartnerInsert>
      >;
      hero_media_items: TableDefinition<
        HeroMediaItem,
        HeroMediaItemInsert,
        HeroMediaItemUpdate
      >;
      site_settings: TableDefinition<
        SiteSetting,
        Omit<SiteSetting, "id" | "updated_at"> & {
          id?: string;
          updated_at?: string;
        },
        Partial<Omit<SiteSetting, "id" | "updated_at">>
      >;
    };
    Views: Record<string, never>;
    Functions: {
      keepalive: {
        Args: Record<string, never>;
        Returns: number;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
