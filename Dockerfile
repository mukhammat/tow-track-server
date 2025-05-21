# Используем официальный Node.js образ
FROM node:lts

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы package.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Генерируем Drizzle клиент
RUN npm run generate

# Собираем проект (если TypeScript)
RUN npm run build

# Открываем порт
EXPOSE 3000

# Команда запуска
CMD ["sh", "-c", "npm run migrate && npm run dev"]