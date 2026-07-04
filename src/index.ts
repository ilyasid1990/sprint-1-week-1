import express from "express";

import { setupApp } from "./setup-app.js";

// Создание приложения
const app = express();
setupApp(app);

// Порт приложения

const PORT = process.env.PORT || 3000;

// Запуск приложения

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
