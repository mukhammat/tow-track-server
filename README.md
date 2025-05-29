# 📦 tow-track-server backend

tow-track-server построен на **TypeScript**, **Node.js**, **Express**, **Zod** **PostgreSQL** и **Drizzle ORM**.  
Разработка и запуск осуществляется в окружении **Docker**.

---

## 🚀 Быстрый старт

1. Склонируй репозиторий:

   ````
   git clone https://github.com/mukhammat/tow-track-server.git
   cd tow-track-server
   ```

   ````

2. Запусти проект:
   ```
   docker compose up --build
   ```

## ⌨️ Ручной старт

1. Склонируй репозиторий:

   ```
   git clone https://github.com/mukhammat/tow-track-server.git
   cd tow-track-server
   ```

2. Создай .env

   ```
   DATABASE_URL="postgresql://postgres:nohamylove@localhost:5432/backend_test_db? schema=public"
   PORT=5000
   NODE_ENV=development
   ```

   Если в production установит для `NODE_ENV=production`

3. Сгенерируйте и мигрируйте бд

```
    npm run generate
    npm run migrate
```

4. Запустите проект

```
    npm run dev


```

    Если в production соберите проект:

    npm run build

```
    затем запустите:

    npm start
```