# 📦 RequestTrack Backend

Бэкенд RequestTrack построен на **TypeScript**, **Node.js**, **Express**, **Zod** **PostgreSQL** и **Drizzle ORM**.  
Разработка и запуск осуществляется в окружении **Docker**.

---

## 🚀 Быстрый старт

1. Склонируй репозиторий:

   ````
   git clone https://github.com/mukhammat/RequestTrack.git
   cd RequestTrack
   ```

   ````

2. Запусти проект:
   ```
   docker compose up --build
   ```

## ⌨️ Ручной старт

1. Склонируй репозиторий:

   ```
   git clone https://github.com/mukhammat/RequestTrack.git
   cd RequestTrack
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

## 📘 API Эндпойнты

### 🔹 POST /api/request/requests

Создать обращение

- **URL:** `/api/request/requests`
- **Метод:** `POST`

### 🔹 PATCH /api/request/requests/:requestId/status/:status

Изменение статуса обращения.

- **URL:** `/api/request/requests/:requestId/status/:status`
- **Метод:** `PATCH`
- **Авторизация:** Требуется `Bearer Token`

#### 📌 Параметры пути:

- `requestId` – ID обращения
- `status` – Новый статус обращения

#### 🛠 Допустимые значения `:status`:

| Статус      | Назначение                    |
| ----------- | ----------------------------- |
| `working`   | Взять обращение в работу      |
| `completed` | Завершить обработку обращения |
| `canceled`  | Отменить обращение            |

#### 📝 Дополнительные поля тела запроса:

В некоторых случаях требуется передать дополнительную информацию в теле запроса (JSON):

- Для `completed`:
  - `result` – Текст с решением проблемы
- Для `canceled`:
  - `result` – Причина отмены обращения

### 🔹 GET /api/request/requests

Получить список обращений с возможностью фильтрации по дате или диапазону дат.

- **URL:** `/api/request/requests`
- **Метод:** `GET`
- **Авторизация:** Требуется `Bearer Token`

#### 🔍 Query-параметры:

- `date` – Фильтрация по конкретной дате (формат: `YYYY-MM-DD`)
- `from` – Начало диапазона дат (формат: `YYYY-MM-DD`)
- `to` – Конец диапазона дат (формат: `YYYY-MM-DD`)

### 🔹 PATCH /api/request/cancel-all

Отменить все обращения, которые находятся в статусе "working"

- **URL:** `/api/request/cancel-all`
- **Метод:** `PATCH`
