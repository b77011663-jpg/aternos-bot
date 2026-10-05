const mineflayer = require('mineflayer');

const botArgs = {
    host: 'juperty.aternos.me', // Укажите IP вашего сервера
    port: 56092,
    username: 'Aternos_Active_Bot',     // Измените ник, если прошлый забанен
    version: false                       // Автоопределение версии игры
};

let bot;
let activityInterval;

function createBot() {
    console.log(`[Система] Подключение к ${botArgs.host}...`);
    bot = mineflayer.createBot(botArgs);

    bot.once('spawn', () => {
        console.log('[Система] Бот успешно зашел на сервер!');
        console.log('[Система] Запуск режима активного перемещения...');
        startUltraAntiAFK();
    });

    bot.on('end', (reason) => {
        console.log(`[Система] Бот отключен. Причина: ${reason}`);
        clearInterval(activityInterval);
        stopAllMovements();
        console.log('[Система] Перезапуск бота через 20 секунд...');
        setTimeout(createBot, 20000);
    });

    bot.on('error', (err) => {
        console.error('[Ошибка]:', err);
    });
}

// Сброс всех клавиш движения перед следующим действием
function stopAllMovements() {
    if (!bot) return;
    bot.setControlState('forward', false);
    bot.setControlState('back', false);
    bot.setControlState('left', false);
    bot.setControlState('right', false);
    bot.setControlState('jump', false);
    bot.setControlState('sprint', false);
}

// Режим сверхактивного Anti-AFK
function startUltraAntiAFK() {
    // Очищаем старые интервалы, если они были
    clearInterval(activityInterval);

    activityInterval = setInterval(() => {
        if (!bot || !bot.entity) return;

        // Сбрасываем старые движения
        stopAllMovements();

        // Случайный выбор комплексного действия (от 1 до 5)
        const choice = Math.floor(Math.random() * 5) + 1;

        // 1. Поворачиваем камеру в случайную сторону
        const yaw = Math.random() * Math.PI * 2;
        const pitch = (Math.random() - 0.5) * Math.PI / 2;
        bot.look(yaw, pitch, false);

        switch (choice) {
            case 1:
                console.log('[Действие] Бег вперед с прыжками (спринт)');
                bot.setControlState('forward', true);
                bot.setControlState('sprint', true);
                // Заставляем прыгать во время бега, чтобы преодолевать препятствия
                bot.setControlState('jump', true); 
                
                setTimeout(() => {
                    if (bot) {
                        bot.setControlState('jump', false);
                        bot.setControlState('sprint', false);
                        bot.setControlState('forward', false);
                    }
                }, 3000); // Бежит 3 секунды
                break;

            case 2:
                console.log('[Действие] Обход препятствия (движение вбок)');
                const side = Math.random() > 0.5 ? 'left' : 'right';
                bot.setControlState(side, true);
                setTimeout(() => { if (bot) bot.setControlState(side, false); }, 2000);
                break;

            case 3:
                console.log('[Действие] Имитация удара/копания (клики мышкой)');
                bot.swingArm('right'); // Бот машет рукой/оружием
                setTimeout(() => { if (bot) bot.swingArm('right'); }, 500);
                break;

            case 4:
                console.log('[Действие] Движение назад и осмотр');
                bot.setControlState('back', true);
                setTimeout(() => { if (bot) bot.setControlState('back', false); }, 1500);
                break;

            case 5:
                console.log('[Действие] Бот присел (Shift)');
                bot.setControlState('sneak', true);
                setTimeout(() => { if (bot) bot.setControlState('sneak', false); }, 2500);
                break;
        }

    }, 12000); // Каждые 12 секунд бот меняет паттерн поведения
}

// Старт
createBot();
