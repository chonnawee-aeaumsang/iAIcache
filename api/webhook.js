const TelegramBot = require("node-telegram-bot-api");

const TOKEN = "7498251188:AAEas9Aii-bsW5tljb_AIzrTAn0gVOaXRg8";
const gameName = "iAIRobotGame"; // Replace with your game's short name
const gameUrl = "https://i-ai-robot-build.vercel.app/"; // Your game URL

const bot = new TelegramBot(TOKEN, { polling: false });

module.exports = async (req, res) => {
    if (req.method === 'POST') {
        const update = req.body;

        try {
            // Detect when the bot is added or the user's first interaction
            if (update.my_chat_member) {
                const chatId = update.my_chat_member.chat.id;
                const firstName = update.my_chat_member.from.first_name;

                if (update.my_chat_member.new_chat_member.status === 'member') {
                    // Send a welcome message when the user adds the bot for the first time
                    await bot.sendMessage(chatId, `Welcome, ${firstName}! Let's play ${gameName}. You can type /game to start.`);
                }
            }
            
            //Handle /help command to provide a tutorial
            //if (update.message && update.message.text === '/help') {
                //const chatId = update.message.from.id;

                // Use the URL to the image hosted on Vercel
                //const helpImageUrl = "https://i-ai-robot-build.vercel.app/images/Tutorial1_converted.jpg";  // Replace with your actual Vercel URL
            
                // Send the image with a caption
                //await bot.sendPhoto(chatId, helpImageUrl, {
                    //caption: `*Here’s how to play ${gameName}:*\n\n*You can start the game by typing \\/game or \\/start\\.*`,
                    //parse_mode: 'MarkdownV2'  // Using MarkdownV2 with correct escaping
                //});
            //}
            

            // Handle /start or /game command
            if (update.message && (update.message.text === '/start' || update.message.text === '/game')) {
                const chatId = update.message.from.id;
                const firstName = update.message.from.first_name;
                
                await bot.sendMessage(chatId, `Welcome, ${firstName}! Let's play ${gameName}.`);
                await bot.sendGame(update.message.from.id, gameName);
            }

            // Handle callback query for the Play button
            if (update.callback_query) {
                if (update.callback_query.game_short_name.toLowerCase() !== gameName.toLowerCase()) {
                    await bot.answerCallbackQuery(update.callback_query.id, `Sorry, '${update.callback_query.game_short_name}' is not available.`);
                } else {
                    await bot.answerCallbackQuery({
                        callback_query_id: update.callback_query.id,
                        url: gameUrl,
                    });
                }
            }

            // Ensure response is sent only once
            res.status(200).send('OK');
        } catch (error) {
            console.error('Error in processing update:', error);
            res.status(500).send('Internal Server Error');
        }
    } else {
        res.status(405).send('Method Not Allowed');
    }
};

