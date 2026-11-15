-- ==========================================
-- SCRIPT SETUP DATABASE SUPABASE (TO DO LIST)
-- Salin dan tempel semua kode ini ke:
-- Supabase Dashboard -> SQL Editor -> Klik 'Run'
-- ==========================================

-- 1. Buat tabel penyimpanan data aplikasi
create table if not exists public.app_state (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz default now()
);

-- 2. Aktifkan Row Level Security (RLS) dan berikan izin akses publik
alter table public.app_state enable row level security;

drop policy if exists "Public Access app_state" on public.app_state;
create policy "Public Access app_state"
  on public.app_state
  for all
  using (true)
  with check (true);

-- 3. Aktifkan Realtime agar perubahan di HP / Laptop langsung sinkron seketika
do $$
begin
  if not exists (
    select 1 from pg_publication_tables 
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'app_state'
  ) then
    alter publication supabase_realtime add table public.app_state;
  end if;
exception when others then
  null;
end $$;

-- 4. Masukkan seluruh data kategori dan pekerjaan yang sudah ada secara otomatis
insert into public.app_state (key, data, updated_at)
values
  ('categories', '[
  {
    "id": "cat-ricko-shopee",
    "name": "Ricko''s Media Player - Shopee",
    "icon": "🏪",
    "color": "#ef8e06",
    "group": "Toko Bisnis"
  },
  {
    "id": "cat-shopee-mp3",
    "name": "Toko Shopee MP3 Player",
    "icon": "🏪",
    "color": "#f97316",
    "group": "Toko Bisnis"
  },
  {
    "id": "cat-zyra-jewelry",
    "name": "Toko Zyra Jewelry",
    "icon": "💎",
    "color": "#a855f7",
    "group": "Toko Bisnis"
  },
  {
    "id": "cat-affiliate-sepatu",
    "name": "Akun Affiliate @reviewsepatucowok",
    "icon": "👟",
    "color": "#3b82f6",
    "group": "Akun Affiliate & TikTok"
  },
  {
    "id": "cat-1794636465464",
    "name": "Affiliate x Meta Ads",
    "icon": "🏪",
    "color": "#126920",
    "group": "Akun Affiliate & TikTok"
  },
  {
    "id": "cat-1794636685162",
    "name": "Utas Pilot Threads",
    "icon": "🏪",
    "color": "#6366f1",
    "group": "Akun Affiliate & TikTok"
  }
]'::jsonb, now()),
  ('todos', '[
  {
    "id": "todo-1794636654013-zwng",
    "title": "Punya 50 Iklan Video Berjalan Dan Profit",
    "category": "Affiliate x Meta Ads",
    "type": "target",
    "priority": "medium",
    "completed": false,
    "createdAt": 1794636654013
  },
  {
    "id": "todo-1794636567132-7udf",
    "title": "Simpan 50 Video China Beserta Link nya",
    "category": "Affiliate x Meta Ads",
    "type": "general",
    "priority": "medium",
    "completed": false,
    "createdAt": 1794636567132,
    "subtasks": []
  },
  {
    "id": "todo-1794636118306-vw0q",
    "title": "Buat 10 Video Per Hari , 1 Video Setiap Produk",
    "category": "Akun Affiliate @reviewsepatucowok",
    "type": "daily",
    "priority": "medium",
    "completed": false,
    "createdAt": 1794636118306,
    "subtasks": []
  },
  {
    "id": "todo-1794636055146-05zn",
    "title": "Buat 35 Video Pertama , Setiap Produk 7 Video",
    "category": "Akun Affiliate @reviewsepatucowok",
    "type": "general",
    "priority": "medium",
    "completed": false,
    "createdAt": 1794636055146,
    "subtasks": []
  },
  {
    "id": "todo-1794635705238-isiv",
    "title": "Posting 10 - 15 Video Per Hari",
    "category": "Akun Affiliate @reviewsepatucowok",
    "type": "target",
    "priority": "high",
    "completed": false,
    "createdAt": 1794635705238
  },
  {
    "id": "todo-1794635668825-jwlx",
    "title": "Bisa Dapet Komisi 100rb Setiap Hari",
    "category": "Akun Affiliate @reviewsepatucowok",
    "type": "target",
    "priority": "low",
    "completed": false,
    "createdAt": 1794635668825
  },
  {
    "id": "todo-1794634733642-wj0o",
    "title": "Buat Akun Sosmed MP3 Player",
    "category": "Ricko''s Media Player - Shopee",
    "type": "general",
    "priority": "medium",
    "completed": false,
    "createdAt": 1794634733642,
    "subtasks": [
      {
        "id": "st-1794634743131-t6o",
        "title": "Facebook Page",
        "completed": false
      },
      {
        "id": "st-1794634757867-zwv",
        "title": "Instagram",
        "completed": false
      },
      {
        "id": "st-1794634764332-uem",
        "title": "Threads",
        "completed": false
      }
    ]
  },
  {
    "id": "todo-target-1",
    "title": "Bisa Rutin Posting 10 Video Per Hari",
    "type": "target",
    "category": "Ricko''s Media Player - Shopee",
    "priority": "medium",
    "completed": false,
    "createdAt": 1731540000000
  },
  {
    "id": "todo-daily-1",
    "title": "Edit Semua Produk MP3 Player",
    "type": "general",
    "category": "Ricko''s Media Player - Shopee",
    "priority": "high",
    "completed": false,
    "streak": 2,
    "lastCompletedDate": null,
    "createdAt": 1731540000000,
    "subtasks": [
      {
        "id": "st-1794625522956-w2w",
        "title": "Ubah Semua Gambar Pakai AI Profesional",
        "completed": false
      },
      {
        "id": "st-1794625540426-qs7",
        "title": "Edit Semua Deskripsi Produk",
        "completed": false
      },
      {
        "id": "st-1794625620963-pw0",
        "title": "Update Semua Harga Produk",
        "completed": false
      },
      {
        "id": "st-1794625680757-0z6",
        "title": "Upload Video Tutorial Setiap Produk",
        "completed": false
      }
    ]
  },
  {
    "id": "todo-daily-2",
    "title": "Upload 5 Video Setiap Hari di Shopee Video",
    "type": "daily",
    "category": "Ricko''s Media Player - Shopee",
    "priority": "medium",
    "completed": false,
    "streak": 1,
    "lastCompletedDate": null,
    "createdAt": 1731540000000
  },
  {
    "id": "todo-shopee-daily",
    "title": "Cek laporan pesanan toko dan transaksi hari ini",
    "type": "daily",
    "category": "Toko Shopee MP3 Player",
    "priority": "medium",
    "completed": false,
    "streak": 1,
    "lastCompletedDate": null,
    "createdAt": 1731540000000
  },
  {
    "id": "todo-daily-zyra",
    "title": "Update stok katalog cincin & balas chat customer",
    "type": "daily",
    "category": "Toko Zyra Jewelry",
    "priority": "medium",
    "completed": false,
    "streak": 1,
    "lastCompletedDate": null,
    "createdAt": 1731540000000
  },
  {
    "id": "todo-daily-affiliate",
    "title": "Tambah 10 Produk Di Showcase",
    "type": "general",
    "category": "Akun Affiliate @reviewsepatucowok",
    "priority": "high",
    "completed": false,
    "streak": 1,
    "lastCompletedDate": null,
    "createdAt": 1731540000000,
    "subtasks": [
      {
        "id": "st-1794635809771-gk1",
        "title": "5 Produk Terlaris",
        "completed": false
      },
      {
        "id": "st-1794635824970-bex",
        "title": "5 Produk Berdasarkan Riset",
        "completed": true
      }
    ]
  }
]'::jsonb, now()),
  ('goals', '{
  "goals": [
    {
      "id": "goal-tecno",
      "title": "Beli HP Tecno Camon 50 Pro",
      "category": "Gadget & Kerja AI",
      "icon": "📱",
      "image": "assets/targets/target-tecno.jpg",
      "targetPrice": "Rp 4.500.000",
      "status": "on_progress",
      "note": "Senjata tempur baru untuk kendali 6 studio AI, foto & video jernih, dan pantau bisnis di genggaman setiap saat.",
      "targetDate": "2026"
    },
    {
      "id": "goal-nmax",
      "title": "Beli Motor Yamaha NMAX",
      "category": "Kendaraan Keluarga",
      "icon": "🛵",
      "image": "assets/targets/target-nmax.jpg",
      "targetPrice": "Rp 35.000.000",
      "status": "on_progress",
      "note": "Kendaraan andalan keluarga yang nyaman, gagah, dan siap mengantar rezeki serta mobilitas harian.",
      "targetDate": "2026"
    },
    {
      "id": "goal-umroh",
      "title": "Umroh Bareng Istri",
      "category": "Ibadah Suci & Berkah",
      "icon": "🕋",
      "image": "assets/targets/target-umroh.jpg",
      "targetPrice": "Paket Berdua Makkah & Madinah",
      "status": "on_progress",
      "note": "Impian suci berdua bersama istri tercinta ke Baitullah Makkah & Madinah. Ibadah khusyuk, doa terkabul, barokah dunia dan akhirat.",
      "targetDate": "2026 / 2027"
    }
  ],
  "customQuote": "",
  "currentQuoteIndex": 1
}'::jsonb, now()),
  ('agendas', '[
  {
    "id": "agenda-init-1",
    "title": "Buat 10 video konten Shopee MP3 Player",
    "date": "2026-11-14",
    "category": "Ricko''s Media Player - Shopee",
    "time": "14:00",
    "note": "Siapkan sample barang dan rekam footage studio",
    "completed": false,
    "createdAt": 1731456000000
  }
]'::jsonb, now()),
  ('history', '{
  "2026-11-11": {
    "date": "2026-11-11",
    "tasks": [
      {
        "id": "todo-daily-1",
        "title": "Posting 3 video konten media sosial harian",
        "type": "daily",
        "category": "Akun Affiliate @reviewsepatucowok",
        "pic": "Kael",
        "priority": "high",
        "completed": true,
        "completedAt": 1731320000000
      },
      {
        "id": "todo-daily-2",
        "title": "Cek laporan pesanan toko dan transaksi hari ini",
        "type": "daily",
        "category": "Toko Shopee MP3 Player",
        "pic": "Naila",
        "priority": "medium",
        "completed": true,
        "completedAt": 1731330000000
      },
      {
        "id": "todo-daily-3",
        "title": "Evaluasi progres kerja harian & briefing tim",
        "type": "daily",
        "category": "Operasional & Markas",
        "pic": "Bos Ricko",
        "priority": "medium",
        "completed": false,
        "completedAt": null
      }
    ]
  },
  "2026-11-12": {
    "date": "2026-11-12",
    "tasks": [
      {
        "id": "todo-daily-1",
        "title": "Posting 3 video konten media sosial harian",
        "type": "daily",
        "category": "Akun Affiliate @reviewsepatucowok",
        "pic": "Kael",
        "priority": "high",
        "completed": true,
        "completedAt": 1731410000000
      },
      {
        "id": "todo-daily-2",
        "title": "Cek laporan pesanan toko dan transaksi hari ini",
        "type": "daily",
        "category": "Toko Shopee MP3 Player",
        "pic": "Naila",
        "priority": "medium",
        "completed": false,
        "completedAt": null
      },
      {
        "id": "todo-daily-zyra",
        "title": "Update stok katalog cincin & balas chat customer",
        "type": "daily",
        "category": "Toko Zyra Jewelry",
        "pic": "Naila",
        "priority": "medium",
        "completed": false,
        "completedAt": null
      },
      {
        "id": "todo-daily-3",
        "title": "Evaluasi progres kerja harian & briefing tim",
        "type": "daily",
        "category": "Operasional & Markas",
        "pic": "Bos Ricko",
        "priority": "medium",
        "completed": false,
        "completedAt": null
      }
    ]
  },
  "2026-11-13": {
    "date": "2026-11-13",
    "tasks": []
  },
  "2026-11-14": {
    "date": "2026-11-14",
    "tasks": [
      {
        "id": "todo-1794636118306-vw0q",
        "title": "Buat 10 Video Per Hari , 1 Video Setiap Produk",
        "type": "daily",
        "category": "Akun Affiliate @reviewsepatucowok",
        "priority": "medium",
        "completed": false,
        "completedAt": null
      },
      {
        "id": "todo-daily-2",
        "title": "Upload 5 Video Setiap Hari di Shopee Video",
        "type": "daily",
        "category": "Ricko''s Media Player - Shopee",
        "priority": "medium",
        "completed": false,
        "completedAt": null
      },
      {
        "id": "todo-shopee-daily",
        "title": "Cek laporan pesanan toko dan transaksi hari ini",
        "type": "daily",
        "category": "Toko Shopee MP3 Player",
        "priority": "medium",
        "completed": false,
        "completedAt": null
      },
      {
        "id": "todo-daily-zyra",
        "title": "Update stok katalog cincin & balas chat customer",
        "type": "daily",
        "category": "Toko Zyra Jewelry",
        "priority": "medium",
        "completed": false,
        "completedAt": null
      }
    ]
  }
}'::jsonb, now())
on conflict (key) do update
set data = excluded.data, updated_at = now();
