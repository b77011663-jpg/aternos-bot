const mineflayer = require('mineflayer');
const express = require('express');

// Создаем веб-сервер, чтобы хостинг не отключал бота
const app = express();
const PORT_WEB = process.env.PORT || 3000;
app.get('/', (req, res) => res.send('Бот Атернос 24/7 активен!'));
app.listen(PORT_WEB, () => console.log(`Веб-сервер запущен на порту ${PORT_WEB}`));

console.log('Starting...')

function createBot () {
    const bot = mineflayer.createBot({
    host: "juperty.aternos.me",
    port: 56092,
    username: "24ATERNOSBOT",
    version: false
    })
    bot.on('login', function() {
      bot.chat('/register 123123123 123123123')
      bot.chat('/login 123123123 123123123')
    })
    bot.on('chat', (username, message) => {
      if (username === bot.username) return
      switch (message) {
        case ';start':
          bot.chat('24 ATERNOS > Bot started! - Made By Fortcote')
          bot.setControlState('forward', true)
          bot.setControlState('jump', true)
          bot.setControlState('sprint', true)
          break
          case ';stop':
            bot.chat('24 ATERNOS > Bot stoped! - Made By Fortcote')
            bot.clearControlStates()
            break
          }
        })
        bot.on('spawn', function() {
          bot.chat('Bot > Spawned')
          console.log('Бот успешно зашел на сервер!')
        })
        bot.on('death', function() {
          bot.chat('Bot > I died, respawn')
        })
        bot.on('kicked', (reason, loggedIn) => console.log('Бот кикнут:', reason))
        bot.on('error', err => console.log('Ошибка:', err))
        
        // Автоматический перезаход, если бот вылетит
        bot.on('end', () => {
          console.log('Бот отключился. Переподключение через 15 секунд...');
          setTimeout(createBot, 15000);
        });
}

createBot();
