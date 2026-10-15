INSERT INTO "menu_items" (
  "name_en", "name_te", "description_en", "description_te",
  "price", "category", "image_key", "is_available", "sort_order"
)
SELECT
  'Idli', 'ఇడ్లీ',
  'Soft steamed idlis with sambar and fresh chutneys',
  'సాంబార్, తాజా చట్నీలతో మెత్తని ఇడ్లీలు',
  60, 'Breakfast', NULL, true, -30
WHERE NOT EXISTS (
  SELECT 1 FROM "menu_items" WHERE lower(trim("name_en")) = 'idli'
);

INSERT INTO "menu_items" (
  "name_en", "name_te", "description_en", "description_te",
  "price", "category", "image_key", "is_available", "sort_order"
)
SELECT
  'Poori', 'పూరి',
  'Golden puffed pooris with Andhra-style potato curry',
  'ఆంధ్ర శైలి బంగాళాదుంప కూరతో బంగారు పూరీలు',
  80, 'Breakfast', NULL, true, -20
WHERE NOT EXISTS (
  SELECT 1 FROM "menu_items" WHERE lower(trim("name_en")) IN ('poori', 'puri')
);

INSERT INTO "menu_items" (
  "name_en", "name_te", "description_en", "description_te",
  "price", "category", "image_key", "is_available", "sort_order"
)
SELECT
  'Pesarattu', 'పెసరట్టు',
  'Green gram crepe with ginger and coconut chutneys',
  'అల్లం, కొబ్బరి చట్నీలతో పెసర పిండి అట్టు',
  90, 'Breakfast', NULL, true, -10
WHERE NOT EXISTS (
  SELECT 1 FROM "menu_items" WHERE lower(trim("name_en")) IN ('pesarattu', 'pesaratu')
);
