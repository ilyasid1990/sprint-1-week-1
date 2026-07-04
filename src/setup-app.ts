import express, { type Express, type Request, type Response } from "express";
import { HttpStatus } from "./http-statuses.js";
import { db } from "./db.js";
import { Resolutions, type VideoDBType } from "./types-video.js";
import {
  type VideoInputDto,
  type VideoErrorDto,
  type UpdateVideoDto,
} from "./video-dto.js";

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  // Удаление данных из БД
  app.delete("/testing/all-data", (req: Request, res: Response) => {
    db.videos = [];
    res.sendStatus(HttpStatus.NoContent);
  });

  // Получение всех видео из БД
  app.get("/videos", (req: Request, res: Response) => {
    res.status(HttpStatus.Ok).json(db.videos);
  });

  // Создание нового видео в БД
  app.post("/videos", (req: Request, res: Response) => {
    const { title, author, availableResolutions } = req.body as VideoInputDto;

    // Создаем массив для сбора всех ошибок
    const errorsMessages: VideoErrorDto[] = [];

    // 1. Валидация входных данных
    if (!title || typeof title !== "string" || !title.trim()) {
      errorsMessages.push({ message: "Title is required", field: "title" });
    }
    if (!author || typeof author !== "string" || !author.trim()) {
      errorsMessages.push({ message: "Author is required", field: "author" });
    }
    if (!availableResolutions || !availableResolutions.length) {
      errorsMessages.push({
        message: "Available resolutions are required",
        field: "availableResolutions",
      });
    }
    // ОТПРАВЛЯЕМ ОШИБКИ ТОЛЬКО ЕСЛИ ОНИ ЕСТЬ
    if (errorsMessages.length > 0) {
      res.status(HttpStatus.BadRequest).json({ errorsMessages });
      return;
    }

    // 2. Расчет дат (создание сегодня, публикация завтра)
    const createdAt = new Date();
    const publicationDate = new Date();
    publicationDate.setDate(createdAt.getDate() + 1);

    // 3. Создание нового объекта в БД
    const newVideo: VideoDBType = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title: title.trim(),
      author: author.trim(),
      canBeDownloaded: false,
      minAgeRestriction: null,
      createdAt: createdAt.toISOString(),
      publicationDate: publicationDate.toISOString(),
      availableResolutions: availableResolutions,
    };

    // 4. Сохранение в БД и отправка ответа
    db.videos.push(newVideo);

    res.status(HttpStatus.Created).json(newVideo);
  });

  // Получение данных по ID
  app.get("/videos/:id", (req: Request, res: Response) => {
    const idNum = Number(req.params.id);

    if (!Number.isFinite(idNum) || idNum <= 0) {
      res.status(HttpStatus.NotFound).json({ error: "Id doesn't exist" });
      return;
    }

    const videoById = db.videos.find((el) => el.id === idNum);

    if (!videoById) {
      res.status(HttpStatus.NotFound);
      return;
    }

    res.status(HttpStatus.Ok).json(videoById);
  });

  // Удаление данных по ID
  app.delete("/videos/:id", (req: Request, res: Response) => {
    const idNum = Number(req.params.id);

    if (!Number.isFinite(idNum) || idNum <= 0) {
      res.status(HttpStatus.NotFound).json({ error: "Id doesn't exist" });
      return;
    }

    const videoIndex = db.videos.findIndex((el) => el.id === idNum);

    if (videoIndex === -1) {
      res.status(HttpStatus.NotFound);
      return;
    }

    db.videos.splice(videoIndex, 1);

    res.sendStatus(HttpStatus.NoContent);
  });

  // Изменение данных по ID
  app.put("/videos/:id", (req: Request, res: Response) => {
    const idNum = Number(req.params.id);

    // Проверка валидности ID
    if (Number.isNaN(idNum) || idNum <= 0) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    // Поиск видео в БД
    const videoIndex = db.videos.findIndex((el) => el.id === idNum);
    if (videoIndex === -1) {
      res.sendStatus(HttpStatus.NotFound);
      return;
    }

    // Деструктуризация с явными типами из DTO
    const {
      title,
      author,
      availableResolutions,
      canBeDownloaded,
      minAgeRestriction,
      publicationDate,
    } = req.body;

    const errorsMessages: VideoErrorDto[] = [];

    // Валидация Title (обязательное, строка, длина от 1 до 40)
    if (
      !title ||
      typeof title !== "string" ||
      !title.trim() ||
      title.length > 40
    ) {
      errorsMessages.push({
        message: "Title is required and should be max 40 chars",
        field: "title",
      });
    }

    // Валидация Author (обязательное, строка, длина от 1 до 20)
    if (
      !author ||
      typeof author !== "string" ||
      !author.trim() ||
      author.length > 20
    ) {
      errorsMessages.push({
        message: "Author is required and should be max 20 chars",
        field: "author",
      });
    }

    // Валидация Available Resolutions (массив не пустой, содержит только валидные Enum значения)
    if (
      !Array.isArray(availableResolutions) ||
      availableResolutions.length === 0
    ) {
      errorsMessages.push({
        message: "Available resolutions must be a non-empty array",
        field: "availableResolutions",
      });
    } else {
      // Импортируйте Resolutions из вашего db.ts
      const isValidEnum = availableResolutions.every((r) =>
        Object.values(Resolutions).includes(r),
      );
      if (!isValidEnum) {
        errorsMessages.push({
          message: "Invalid resolution value detected",
          field: "availableResolutions",
        });
      }
    }

    // Валидация canBeDownloaded (если передано, должно быть boolean)
    if (canBeDownloaded !== undefined && typeof canBeDownloaded !== "boolean") {
      errorsMessages.push({
        message: "canBeDownloaded must be a boolean",
        field: "canBeDownloaded",
      });
    }

    // Валидация minAgeRestriction (от 1 до 18 или null)
    if (minAgeRestriction !== undefined && minAgeRestriction !== null) {
      if (
        typeof minAgeRestriction !== "number" ||
        minAgeRestriction < 1 ||
        minAgeRestriction > 18
      ) {
        errorsMessages.push({
          message: "Age restriction must be between 1 and 18",
          field: "minAgeRestriction",
        });
      }
    }

    // Валидация publicationDate (должна быть валидной ISO строкой даты)
    if (publicationDate !== undefined) {
      if (
        typeof publicationDate !== "string" ||
        Number.isNaN(Date.parse(publicationDate))
      ) {
        errorsMessages.push({
          message: "Publication date must be a valid ISO string",
          field: "publicationDate",
        });
      }
    }

    // Возврат ошибок валидации
    if (errorsMessages.length > 0) {
      res.status(HttpStatus.BadRequest).json({ errorsMessages });
      return;
    }

    // Мутация объекта в БД (PUT заменяет ресурс целиком, сохраняя системные поля)
    const currentVideo: VideoDBType = db.videos[videoIndex] as VideoDBType;

    db.videos[videoIndex] = {
      id: currentVideo.id, // Гарантия иммутабельности ID
      createdAt: currentVideo.createdAt, // Гарантия иммутабельности даты создания
      title: title.trim(),
      author: author.trim(),
      availableResolutions: availableResolutions,
      canBeDownloaded: canBeDownloaded ?? false, // Слой дефолтных значений из Swagger
      minAgeRestriction:
        minAgeRestriction !== undefined ? minAgeRestriction : null,
      publicationDate:
        publicationDate !== undefined
          ? publicationDate
          : currentVideo.publicationDate,
    };

    // 12. Отправка ответа
    res.sendStatus(HttpStatus.NoContent);
  });

  return app;
};
