import express, {type Express} from "express";

import { setupApp } from "./setup-app.js";

// Создание приложения
export const app: Express = express();
setupApp(app);

// Порт приложения

const PORT = process.env.PORT || 3003;

// Запуск приложения

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

export default app;