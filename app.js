/**
 * Author : Loris Levêque
 * Date : 26.04.2022
 * Description : Bot who can play musics, simple as f***
 * 
 * *********************************************************/

const EnvVariables = require("./utils/envVariables.js");
const Music = require("./music/music.js");
const RegexMatch = require("./utils/regex.js");

const { Client, Intents, MessageEmbed } = require('discord.js');



let envVariables = new EnvVariables();
envVariables.load_tokens();

let music = new Music();

  
const client = new Client(
	{
		intents: [
			Intents.FLAGS.GUILDS,
			Intents.FLAGS.GUILD_MESSAGES,
			Intents.FLAGS.GUILD_VOICE_STATES
		]
	}
);


client.on('ready', () => {
	console.log(`Logged as ${client.user.tag}`);
});


client.on('messageCreate', async (message) => {
	if (!message.content.startsWith("-")) return;
	if (!message.guild) return;

	const command = message.content.split(' ')[0].toLowerCase();
	const args = message.content.split(' ').slice(1).join(' ');

	if (command === '-play') {
		const channel = message.member.voice.channel;

		if (channel) {
			try {
				if (!RegexMatch.matchYoutubeLink(args))
					return await message.reply("Wait.. that's not a youtube link :(");

				if (!music.isInVoiceChannel()) {
					await music.joinVoiceChannel(channel);
					message.channel.send(`Joined the channel '${channel.name}' !`);
				}
				
				await music.queue.add(args.split(' ')[0]);
				message.reply(`'${music.queue.last().title}' from '${music.queue.last().ownerName}' has been added to the end of the queue! `);

				if (music.currentPlaylistIndex !== null) {
					music.addMusicToPlaylist(music.queue.last());
				}

			} catch (error) {
				console.error(error);
			}
		} else {
			message.reply('Join a voice channel then try again!');
		}
	} else if (command === '-quit') {
		if (!music.isInVoiceChannel())
			return message.reply("I cannot quit anything °°'");
		music.quitVoiceChannel();
		message.reply("Voice channel exited");
	} else if (command === '-releaseplaylist') {
		music.currentPlaylistIndex = null;
	} else if (command === '-skip') {
		music.skip();
		message.react('👍');
	} else if (command === '-queue') {
		if (music.queue.count() === 0)
			message.reply("No music in queue ¯\\_(ツ)_/¯");
		
		let queueEmbed = new MessageEmbed()
			.setTitle('Content of the queue')
			.addField(
				'by order :', music.getQueueString(), false
			)
			.addField(
				'loop :', music.loopToString(), false
			);
		
		message.channel.send({ embeds: [queueEmbed] });
	} else if (command === '-createplaylist') {
		if (args == "")
			return message.reply("Please give a name to your playlist");
		const result = music.addPlaylist(args);
		if (!result)
			return message.reply("I cannot create an empty playlist :/");
		message.reply(`The playlist '${args}' is now registred and available :D`);
	} else if (command === '-listplaylists') {
		if (music.playlists.length === 0)
			message.reply("No playlists available/registred ¯\\_(ツ)_/¯");
		
		let playlistsEmbed = new MessageEmbed()
			.setTitle('All playlists')
			.addField(
				'by order :', music.getPlaylistsString(), true
			);
		
		message.channel.send({ embeds: [playlistsEmbed] });
	} else if (command === '-loadplaylist') {
		const channel = message.member.voice.channel;

		if (channel) {
			try {
				if (!music.isInVoiceChannel()) {
					await music.joinVoiceChannel(channel);
					message.channel.send(`Joined the channel '${channel.name}' !`);
				}
					
				const error = music.loadPlaylistToQueue(args);
				if (error)
					return message.reply(`There's no playlist assigned to '${args}' :/\ntry -listPlaylists to get all registred playlists`);
				message.reply(`Your playlist '${args}' has been loaded :D`);
			} catch (error) {
				console.error(error);
			}
		} else {
			message.reply('Join a voice channel then try again!');
		}
	} else if (command === '-loop') {
		music.switchLoop();
		message.react('👍');
	} else if (command === '-loopqueue') {
		music.switchLoopQueue();
		message.react('👍');
	}
});

client.login(envVariables.BOT_TOKEN);