// 1. Перечисление для доступных разрешений видео
export enum Resolutions {
  P144 = "P144",
  P240 = "P240",
  P360 = "P360",
  P480 = "P480",
  P720 = "P720",
  P1080 = "P1080",
  P1440 = "P1440",
  P2160 = "P2160",
}

// 2. Тип, описывающий структуру объекта в базе данных
export type VideoDBType = {
  id: number;
  title: string;
  author: string;
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  createdAt: string;
  publicationDate: string;
  availableResolutions: Resolutions[] | null;
};

// 3. Тип самой базы данных
export type DBType = {
  videos: VideoDBType[];
};
