# The Case

Запуск додатку:
```
docker compose build
docker compose up
```

Після запуску на порту 5000 стане доступний API інтерфейс.
За адресою http://localhost:1080 піднімається веб-інтерфейс мок-серверу для перегляду відправлених листів.

## Структура

- `apps/api` - додаток, який відповідає за API
- `domain/exchangeSubscription` - реалізація доменої логіки
- `infra/database/sequelize/models` - моделі для роботи з базою даних
- `infra/database/sequelize/repository` - реалізація репозиторіїв
- `infra/exchanger` - сервіс завантаження курсів обміну валют
- `infra/mailer` - сервіс відправки листів
- `infra/templateEngine` - сервіс формування шаблону листа
