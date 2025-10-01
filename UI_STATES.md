# UI States Documentation

Документация по всем состояниям пользовательского интерфейса.

## 📊 Состояния приложения

### 1. Loading State (Загрузка)

**Когда показывается:**

- При первой загрузке страницы
- Во время получения данных с API

**Компонент:** `LoadingSpinner.tsx`

**Внешний вид:**

- Анимированный синий спиннер в центре экрана
- Чистый дизайн без лишних элементов

**Код:**

```tsx
{loading ? <LoadingSpinner /> : <IdeaList ... />}
```

---

### 2. Empty State (Пустое состояние)

**Когда показывается:**

- Когда API возвращает пустой массив идей `[]`
- База данных не содержит записей
- После успешной загрузки, но данных нет

**Компонент:** `EmptyState.tsx` используется в `IdeaList.tsx`

**Внешний вид:**

- 💡 Иконка лампочки (серая)
- Заголовок: "Идей пока нет"
- Описание с пояснением
- Подсказка для разработчиков с командой `npm run prisma:seed`

**Тестирование:**

```bash
# Очистить базу данных
cd backend
npx prisma migrate reset --force --skip-seed

# Перезагрузить страницу - увидите Empty State
```

**Восстановление данных:**

```bash
npm run prisma:seed
```

---

### 3. Success State (Успешное состояние)

**Когда показывается:**

- Когда данные успешно загружены
- Массив идей не пустой

**Компонент:** `IdeaList.tsx` → `IdeaCard.tsx`

**Внешний вид:**

- Grid с карточками идей (1-2-3 колонки в зависимости от экрана)
- Каждая карточка содержит:
  - Название идеи
  - Описание
  - Счётчик голосов
  - Кнопка голосования
  - Дата создания

**Responsive:**

- Mobile (< 768px): 1 колонка
- Tablet (768px - 1024px): 2 колонки
- Desktop (> 1024px): 3 колонки

---

### 4. Error State (Состояние ошибки)

**Когда показывается:**

- Ошибка сети (backend не доступен)
- HTTP ошибки (404, 500, и т.д.)
- Timeout запроса

**Компонент:** `ErrorMessage.tsx`

**Типы ошибок:**

#### 4.1 Network Error (Ошибка сети)

```tsx
{
  message: "Network error. Please check your connection.",
  statusCode: 0
}
```

**Внешний вид:**

- 🔴 Красный блок с иконкой предупреждения
- Заголовок: "Ошибка сети"
- Описание ошибки
- Дополнительная подсказка про backend
- Кнопка "Попробовать снова" с иконкой обновления

**Тестирование:**

```bash
# Остановить backend
# Перезагрузить страницу - увидите Network Error
```

#### 4.2 HTTP Error (HTTP ошибка)

```tsx
{
  message: "HTTP error! status: 500",
  statusCode: 500
}
```

**Внешний вид:**

- Заголовок: "Что-то пошло не так"
- Сообщение об ошибке
- Кнопка повтора

---

### 5. Voting States (Состояния голосования)

**Компонент:** `VoteButton.tsx`

#### 5.1 Not Voted (Не проголосовано)

```tsx
hasVoted: false
voting: false
```

- Синяя кнопка с иконкой 👍
- Hover эффект: темнее
- Active: scale анимация
- Текст: "Vote"

#### 5.2 Voting (Процесс голосования)

```tsx
hasVoted: false
voting: true
```

- Серая отключённая кнопка
- Курсор: not-allowed
- Текст: "Voting..."

#### 5.3 Voted (Уже проголосовано)

```tsx
hasVoted: true
```

- Зелёная кнопка с галочкой ✓
- Отключена (нельзя голосовать повторно)
- Текст: "Voted"

---

### 6. Vote Error States (Ошибки голосования)

#### 6.1 Duplicate Vote (Повторное голосование)

```tsx
{
  message: "You have already voted for this idea",
  statusCode: 409,
  type: "DUPLICATE_VOTE"
}
```

**Обработка:**

- Кнопка остаётся зелёной
- Console.error с сообщением
- Можно добавить toast notification

#### 6.2 Vote Limit Exceeded (Превышен лимит)

```tsx
{
  message: "Maximum votes per IP reached",
  statusCode: 409,
  type: "VOTE_LIMIT_EXCEEDED"
}
```

**Обработка:**

- Все кнопки становятся неактивными
- Показывается сообщение в консоли
- Можно добавить глобальное уведомление

---

## 🎨 Design System

### Цвета

**Primary (Blue):**

- Default: `bg-blue-600`
- Hover: `bg-blue-700`
- Light: `bg-blue-50`

**Success (Green):**

- Default: `bg-green-600`
- Hover: `bg-green-700`
- Text: `text-green-600`

**Error (Red):**

- Default: `bg-red-600`
- Hover: `bg-red-700`
- Background: `bg-red-50`
- Border: `border-red-200`
- Text: `text-red-600`

**Neutral (Gray):**

- Background: `bg-gray-50`
- Border: `border-gray-200`
- Text light: `text-gray-500`
- Text dark: `text-gray-900`

### Transitions

Все интерактивные элементы используют:

```css
transition-colors
transition-shadow
```

Длительность: 150ms (по умолчанию в Tailwind)

### Spacing

- Cards gap: `gap-6`
- Container padding: `px-4 py-8`
- Section margin: `mb-12`, `mt-16`

---

## 🧪 Тестирование состояний

### Тест 1: Loading State

```bash
# 1. Закрыть вкладку браузера
# 2. Открыть снова
# 3. Наблюдать спиннер на ~1 секунду
```

### Тест 2: Empty State

```bash
cd backend
npx prisma migrate reset --force --skip-seed
# Перезагрузить страницу
```

### Тест 3: Success State

```bash
cd backend
npm run prisma:seed
# Перезагрузить страницу
```

### Тест 4: Error State (Network)

```bash
# Остановить backend (Ctrl+C)
# Перезагрузить страницу
# Нажать "Попробовать снова"
# Запустить backend
# Нажать "Попробовать снова" снова
```

### Тест 5: Vote States

```bash
# 1. Нажать Vote на любой идее (синяя → зелёная)
# 2. Попробовать нажать снова (ничего не произойдёт)
# 3. Проголосовать за 10 идей (достичь лимита)
# 4. Попробовать проголосовать за 11-ю (ошибка в консоли)
```

---

## 📝 Улучшения (Future)

### Приоритет 1: Toast Notifications

```bash
npm install react-hot-toast
```

Показывать toast для:

- ✅ Успешное голосование: "Голос учтён!"
- ❌ Повторное голосование: "Вы уже голосовали за эту идею"
- ❌ Превышен лимит: "Достигнут лимит голосов (10)"

### Приоритет 2: Optimistic UI

Обновлять UI до получения ответа от сервера:

1. Увеличить счётчик голосов сразу
2. Сделать кнопку зелёной
3. При ошибке - откатить изменения

### Приоритет 3: Skeleton Loading

Вместо спиннера показывать skeleton карточек:

```tsx
<div className="animate-pulse">
  <div className="h-40 bg-gray-200 rounded-lg"></div>
</div>
```

### Приоритет 4: Infinite Scroll

Для большого количества идей:

- Загружать по 10 идей
- Автоматически подгружать при скролле
- Использовать `react-infinite-scroll-component`

---

## 🎯 Accessibility

Все состояния доступны для screen readers:

- **Loading**: `<div role="status" aria-label="Загрузка...">`
- **Empty**: Семантический текст с понятным описанием
- **Error**: `role="alert"` для важных ошибок
- **Buttons**: Правильные `aria-label` и `disabled` атрибуты

---

## 📱 Mobile Considerations

Все состояния адаптивны:

- Touch-friendly кнопки (min 44px)
- Responsive grid
- Читаемые шрифты (min 14px)
- Достаточные отступы для пальцев

---

Сделано с ❤️ и вниманием к деталям
