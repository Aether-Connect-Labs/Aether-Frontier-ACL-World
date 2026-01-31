require('dotenv').config();
const { Bot, InlineKeyboard } = require('grammy');

const bot = new Bot(process.env.BOT_TOKEN);

// URL del juego (debe ser HTTPS, proporcionada por Vercel)
// Si no está definida en .env, usa un placeholder
const GAME_URL = process.env.GAME_URL || 'https://tu-proyecto.vercel.app';

// Comando /start
bot.command('start', async (ctx) => {
    const keyboard = new InlineKeyboard()
        .webApp('🦆 JUGAR AHORA', GAME_URL)
        .row()
        .url('📢 Canal Oficial', 'https://t.me/AetherConnectLabs');

    await ctx.reply(
        `<b>¡Bienvenido a Aether Frontier! 🌌</b>\n\n` +
        `Eres un Arquitecto de Redes en la frontera digital. Tu misión:\n` +
        `🦆 Cazar patos glitch y anomalías\n` +
        `💰 Ganar tokens ACL\n` +
        `🏆 Subir en el ranking global\n\n` +
        `<i>¡Presiona el botón para comenzar tu misión!</i>`,
        {
            parse_mode: 'HTML',
            reply_markup: keyboard
        }
    );
});

// Comando de ayuda
bot.command('help', async (ctx) => {
    await ctx.reply(
        "Para jugar, simplemente usa el comando /start y presiona el botón 'JUGAR AHORA'.\n\n" +
        "Si tienes problemas, contacta al soporte en @AetherSupport."
    );
});

// Manejo de errores
bot.catch((err) => {
    console.error(`Error en el bot: ${err}`);
});

// Iniciar el bot
async function startBot() {
    try {
        await bot.api.setMyCommands([
            { command: 'start', description: '🎮 Jugar Aether Frontier' },
            { command: 'help', description: 'ℹ️ Ayuda y Soporte' }
        ]);
        console.log('✅ Comandos de menú configurados en Telegram');
        
        console.log('🤖 Bot de Aether Frontier iniciado...');
        await bot.start();
    } catch (error) {
        console.error('Error al iniciar el bot:', error);
    }
}

startBot();
