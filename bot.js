const mineflayer = require('mineflayer');
const express = require('express');

// 1. Создаем веб-сервер, чтобы облачный хостинг не отключал бота
const app = express();
const PORT_WEB = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Бот Атернос 24/7 активен!'));
app.listen(PORT_WEB, () => console.log(`[Веб-сервер] Запущен на порту ${PORT_WEB}`));

console.log('Запуск процесса бота...');

// Переменная для хранения экземпляра бота
let bot;

function createBot() {
    // 2. Настройки подключения к вашему серверу Aternos
    bot = mineflayer.createBot({
        host: "juperty.aternos.me", // IP вашего сервера
        port: 56092,                // Порт вашего сервера (БЕЗ кавычек)
        username: "24ATERNOSBOT",   // Никнейм бота в игре
        version: false              // Автоопределение версии игры
    });

    // Автоматическая авторизация при входе на сервер
    bot.on('login', () => {
        console.log('Бот отправил пакет авторизации на сервер.');
        bot.chat('/register 123123123 123123123');
        bot.chat('/login 123123123 123123123');
    });

    // Управление движениями анти-AFK через игровой чат
    bot.on('chat', (username, message) => {
        if (username === bot.username) return;
        
        switch (message) {
            case ';start':
                console.log('Получена команда ;start — включаю движения.');
                bot.setControlState('forward', true);
                bot.setControlState('jump', true);
                bot.setControlState('sprint', true);
                break;
            case ';stop':
                console.log('Получена команда ;stop — останавливаю движения.');
                bot.clearControlStates();
                break;
        }
    });

    // Успешный спавн бота на сервере
    bot.on('spawn', () => {
        console.log(`[${new Date().toLocaleTimeString()}] Бот успешно зашел в мир и готов к работе!`);
    });

    // Логирование ошибок и киков (сообщения выводятся ТОЛЬКО в консоль GitHub, чат игры чист)
    bot.on('kicked', (reason) => {
        console.log('Бот был кикнут с сервера по причине:', reason);
    });

    bot.on('error', (err) => {
        console.log('Произошла ошибка сети:', err.message);
    });

    // 3. Умный автоматический перезапуск при вылете (пауза 15 секунд защищает от бана за спам)
    bot.on('end', () => {
        console.log('Соединение разорвано. Ожидание 15 секунд перед повторным входом...');
        setTimeout(createBot, 15000);
    });
}

// Запускаем бота в первый раз
createBot();
