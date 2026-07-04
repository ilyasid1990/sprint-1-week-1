import { Resolutions, type VideoDBType, type DBType } from "./types-video.js";

export const mockVideos: VideoDBType[] = [
  {
    id: 1,
    title: "Introduction to TypeScript",
    author: "John Doe",
    canBeDownloaded: true,
    minAgeRestriction: null, // Нет ограничений
    createdAt: "2026-07-03T12:00:00.000Z",
    publicationDate: "2026-07-04T12:00:00.000Z", // +1 день
    availableResolutions: [Resolutions.P720, Resolutions.P1080],
  },
  {
    id: 2,
    title: "Cyberpunk 2077 Gameplay Review",
    author: "Gaming Channel",
    canBeDownloaded: false, // По умолчанию false
    minAgeRestriction: 18, // Максимальное ограничение
    createdAt: "2026-07-01T15:30:00.000Z",
    publicationDate: "2026-07-02T15:30:00.000Z",
    availableResolutions: [
      Resolutions.P1080,
      Resolutions.P1440,
      Resolutions.P2160,
    ], // 4K видео
  },
  {
    id: 3,
    title: "Cute Cat Compilation 2026",
    author: "Animal Planet",
    canBeDownloaded: true,
    minAgeRestriction: 1, // Минимальное ограничение (для детей)
    createdAt: "2026-07-03T09:00:00.000Z",
    publicationDate: "2026-07-04T09:00:00.000Z",
    availableResolutions: [
      Resolutions.P360,
      Resolutions.P480,
      Resolutions.P720,
    ],
  },
  {
    id: 4,
    title: "ASMR for Deep Sleep (Lo-Fi)",
    author: "RelaxVibes",
    canBeDownloaded: false,
    minAgeRestriction: 12,
    createdAt: "2026-06-30T22:00:00.000Z",
    publicationDate: "2026-07-01T22:00:00.000Z",
    availableResolutions: null, // Разрешения не указаны
  },
  {
    id: 5,
    title: "Short Shorts Reel",
    author: "QuickContent",
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: "2026-07-03T18:15:00.000Z",
    publicationDate: "2026-07-04T18:15:00.000Z",
    availableResolutions: [Resolutions.P144, Resolutions.P240], // Низкое разрешение для мобильных
  },
];

// Чтобы сразу инициализировать базу данных этими данными:
export const db: DBType = {
  videos: mockVideos,
};
