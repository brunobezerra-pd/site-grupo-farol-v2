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

export type ImageSlot = {
  id: string;
  slot_key: string;
  image_url: string | null;
  enabled: boolean | null;
  label: string | null;
  created_at: string | null;
};

export type SiteSetting = {
  id: string;
  key: string;
  value: string | null;
  updated_at: string | null;
};

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
      image_slots: TableDefinition<
        ImageSlot,
        Omit<ImageSlot, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        },
        Partial<Omit<ImageSlot, "id" | "created_at">>
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
