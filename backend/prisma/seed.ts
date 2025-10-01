import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const sampleIdeas = [
  {
    title: "Добавить темную тему",
    description:
      "Было бы здорово иметь возможность переключаться между светлой и темной темой для комфортной работы в разное время суток.",
  },
  {
    title: "Мобильное приложение",
    description:
      "Разработать нативное мобильное приложение для iOS и Android для удобного доступа к платформе с мобильных устройств.",
  },
  {
    title: "Система уведомлений",
    description:
      "Внедрить систему уведомлений о новых идеях, комментариях и изменениях статуса предложений.",
  },
  {
    title: "Интеграция с Telegram",
    description:
      "Создать Telegram бота для быстрого просмотра идей и голосования прямо из мессенджера.",
  },
  {
    title: "Экспорт в PDF",
    description:
      "Возможность экспортировать список идей и статистику голосований в PDF формат для презентаций.",
  },
  {
    title: "Категории идей",
    description:
      "Добавить возможность группировать идеи по категориям (UI/UX, Backend, Mobile, etc.) для удобной навигации.",
  },
  {
    title: "Комментарии к идеям",
    description:
      "Разрешить пользователям оставлять комментарии к идеям для обсуждения деталей реализации.",
  },
  {
    title: "API для разработчиков",
    description:
      "Публичное API для интеграции платформы голосования с другими сервисами и создания сторонних клиентов.",
  },
  {
    title: "Система достижений",
    description:
      "Геймификация: значки и достижения за активное участие в голосовании и предложение идей.",
  },
  {
    title: "Фильтры и поиск",
    description:
      "Мощная система фильтрации и полнотекстового поиска для быстрого нахождения нужных идей.",
  },
  {
    title: "Roadmap визуализация",
    description:
      "Визуальный roadmap с отображением планируемых и реализованных идей на временной шкале.",
  },
  {
    title: "Авторизация через соцсети",
    description:
      "Возможность входа через Google, GitHub, VK для упрощения процесса регистрации.",
  },
  {
    title: "Аналитика и статистика",
    description:
      "Детальная аналитика по голосованиям: графики, тренды, демографические данные участников.",
  },
  {
    title: "Многоязычность",
    description:
      "Поддержка нескольких языков интерфейса (RU, EN, ES, CN) для международной аудитории.",
  },
  {
    title: "Приватные идеи",
    description:
      "Возможность создавать приватные идеи, видимые только определенной группе пользователей или команде.",
  },
]

async function main(): Promise<void> {
  console.log("🌱 Starting database seeding...")

  // Clear existing data
  await prisma.vote.deleteMany()
  await prisma.idea.deleteMany()
  console.log("✨ Cleared existing data")

  // Create ideas
  for (const ideaData of sampleIdeas) {
    const idea = await prisma.idea.create({
      data: ideaData,
    })
    console.log(`✅ Created idea: ${idea.title}`)
  }

  console.log("🎉 Seeding completed successfully!")
}

main()
  .catch((error: Error) => {
    console.error("❌ Seeding failed:", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
