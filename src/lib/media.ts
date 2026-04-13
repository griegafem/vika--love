export type MediaPhoto = { src: string; alt: string; n: number };

export const ISTANBUL_NUMS = [1, 2, 3, 8, 9, 10, 11, 12, 13, 14] as const;

// Update this list if you add more photos (vika-19.jpg etc).
export const ALL_PHOTO_NUMS = [
  1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
] as const;

export function buildPhotos(nums: readonly number[]): MediaPhoto[] {
  return nums.map((n) => ({ n, src: `/vika/vika-${n}.jpg`, alt: "Вика" }));
}

export const istanbulPhotos = buildPhotos(ISTANBUL_NUMS);
export const krasnodarPhotos = buildPhotos(
  ALL_PHOTO_NUMS.filter((n) => !(ISTANBUL_NUMS as readonly number[]).includes(n))
);
export const allPhotos = buildPhotos(ALL_PHOTO_NUMS);

export const videos = [
  { src: "/vika/vika-video.mp4", title: "Видео 1" },
  { src: "/vika/vika-video2.mp4", title: "Видео 2" }
];

