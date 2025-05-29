import {
  ChatInputCommandInteraction,
  InteractionResponse,
  SlashCommandBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { SlashCommand } from '@/base';
import { BotClient } from '@/bot-client';

const IMAGE_CATEGORIES = ['kitsune', 'neko', 'husbando', 'waifu'] as const;
const GIF_CATEGORIES = [
  'baka', // оскорбление / раздражение
  'bite', // укусить
  'blush', // покраснеть
  'cry', // плакать
  'cuddle', // обниматься
  'dance', // танцевать
  'facepalm', // фейспалм
  'feed', // кормить
  'happy', // счастливый
  'highfive', // дать пять
  'hug', // обнять
  'kiss', // поцеловать
  'laugh', // смеяться
  'pat', // похлопать
  'shrug', // пожать плечами
  'slap', // шлёпнуть
  'smile', // улыбаться
  'smug', // самодовольный
  'think', // думать
  'thumbsup', // палец вверх
  'tickle', // щекотать
  'wave', // махать рукой
  'wink', // подмигнуть
  'nope', // нет
  'angry', // злой
] as const;

type ImageCategory = (typeof IMAGE_CATEGORIES)[number];
type GifCategory = (typeof GIF_CATEGORIES)[number];

type Category = GifCategory | ImageCategory;

export default class NekosCommand extends SlashCommand {
  public constructor() {
    super(
      new SlashCommandBuilder()
        .setName('nekos')
        .setDescription('Get a picture from nekos.best')
        .addSubcommand((sub) =>
          (sub as SlashCommandSubcommandBuilder)
            .setName('image')
            .setDescription('Get an image')
            .addStringOption((opt) =>
              opt
                .setName('category')
                .setDescription('Image category')
                .setRequired(true)
                .addChoices(
                  ...IMAGE_CATEGORIES.map((category) => ({
                    name: category,
                    value: category,
                  })),
                ),
            ),
        )
        .addSubcommand((sub) =>
          (sub as SlashCommandSubcommandBuilder)
            .setName('gif')
            .setDescription('Get a GIF')
            .addStringOption((opt) =>
              opt
                .setName('category')
                .setDescription('GIF category')
                .setRequired(true)
                .addChoices(
                  ...GIF_CATEGORIES.map((category) => ({
                    name: category,
                    value: category,
                  })),
                ),
            ),
        ) as SlashCommandBuilder,
    );
  }

  public async chatInput(
    botClient: BotClient,
    interaction: ChatInputCommandInteraction,
  ): Promise<InteractionResponse | void> {
    await interaction.deferReply();

    const subcommand = interaction.options.getSubcommand();
    let category = interaction.options.getString('category') as Category | null;

    if (!category) {
      const array = subcommand === 'image' ? IMAGE_CATEGORIES : GIF_CATEGORIES;
      category = array[Math.floor(Math.random() * array.length)];
    }

    const data = await botClient.nekosBest.fetch(category, 1);
    const url = data.results[0].url;

    await interaction.editReply(url);
  }
}
