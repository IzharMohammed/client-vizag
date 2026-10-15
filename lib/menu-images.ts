const builtInMenuImages = [
  { matches: ["idli"], src: "/images/menu/idli.webp" },
  { matches: ["poori", "puri"], src: "/images/menu/poori.webp" },
  { matches: ["pesarattu", "pesaratu"], src: "/images/menu/pesarattu.webp" },
] as const;

export function getMenuImageSrc(nameEn: string, imageKey: string | null) {
  if (imageKey) return `/api/images/${encodeURIComponent(imageKey)}`;

  const normalizedName = nameEn.trim().toLocaleLowerCase("en-IN");
  return builtInMenuImages.find(({ matches }) =>
    matches.some((name) => normalizedName.includes(name)),
  )?.src ?? null;
}
