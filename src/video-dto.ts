import { Resolutions } from "./types-video.js";

export type VideoInputDto = {
  title: string;
  author: string;
  availableResolutions: Resolutions[];
};

export type VideoErrorDto = {
  message: string;
  field: string;
};

export type UpdateVideoDto = {
  title: string;
  author: string;
  availableResolutions: Resolutions[];
  canBeDownloaded: boolean;
  minAgeRestriction: number;
  publicationDate: string;
};
