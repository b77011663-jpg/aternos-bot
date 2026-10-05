const mineflayer = require('mineflayer');

// Конфигурация подключения
const botArgs = {
    host: 'juperty.aternos.me', // Замените на IP вашего сервера Aternos
    port: 56029,                         // Стандартный порт Minecraft
    username: 'Aternos_Guard_Bot',       // Никнейм бота
    version: false                       // false включает автоопределение версии сервера
};

let bot;

function createBot() {
    console.log(`[Бот] Подключение к ${botArgs.host}...`);
    bot = mineflayer.createBot(botArgs);

    // Событие: Бот успешно зашел на сервер
    bot.once('spawn', () => {
        console.log('[Бот] Успешно вошел в игру! Запуск симуляции активности...');
        startAntiAFK();
    });

    // Событие: Бота кикнули или сервер закрылся
    bot.on('end', (reason) => {
        console.log(`[Бот] Отключен от сервера. Причина: ${reason}`);
        console.log('[Бот] Переподключение через 20 секунд...');
        setTimeout(createBot, 20000); // Интервал увеличен до 20 сек, чтобы снизить спам-нагрузку
    });

    // Отлов критических ошибок, чтобы процесс не падал в GitHub Actions
    bot.on('error', (err) => {
        console.error('[Критическая ошибка]:', err);
    });
}

// Функция имитации активности (Anti-AFK)
function startAntiAFK() {
    setInterval(() => {
        if (!bot || !bot.entity) return;

        // Генерируем случайное число от 1 до 4 для выбора действия
        const action = Math.floor(Math.random() * 4) + 1;

        switch (action) {
            case 1:
                // Случайный взгляд в сторону (имитация осмотра)
                const yaw = Math.random() * Math.PI * 2;
                const pitch = (Math.random() - 0.5) * Math.PI / 2;
                bot.look(yaw, pitch, true);
                console.log('[Anti-AFK] Бот осмотрелся');
                break;

            case 2:
                // Одиночный прыжок
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
                console.log('[Anti-AFK] Бот подпрыгнул');
                break;

            case 3:
                // Короткий шаг вперед
                bot.setControlState('forward', true);
                setTimeout(() => bot.setControlState('forward', false), 400);
                console.log('[Anti-AFK] Бот сделал шаг вперед');
                break;

            case 4:
                // Короткий шаг назад
                bot.setControlState('back', true);
                setTimeout(() => bot.setControlState('back', false), 400);
                console.log('[Anti-AFK] Бот сделал шаг назад');
                break;
        }
    }, 15000); // Выполнять случайное действие каждые 15 секунд
}

// Запуск бота
createBot();
