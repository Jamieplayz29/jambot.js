require('dotenv').config();
var express = require('express');
var app = express();
const search = require('youtube-search');
const Discord = require('discord.js');
const client = new Discord.Client();
const opts = {
    maxResults: 50,
    key: process.env.YOUTUBE_API,
    type: "video"
};
const Util = require('discord.js');
const fs = require('fs');
const queue = new Map();
let active = new Map();
const PREFIX = '/';
const YouTube = require('simple-youtube-api');
const youtube = new YouTube(process.env.YOUTUBE_API)





client.login(process.env.TOKEN);

client.on('ready', () => {
    console.log("logged in as ", client.user.username + "#" + client.user.discriminator);
});



const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 0.2 };

var musicUrls = [];

client.on('message', message => {

     
    if(message.content.toLowerCase().startsWith("test"))
    {
        let VoiceChannel = message.member.guild.channels.cache.find(channel => channel.id === '710225788267397210');
        if(VoiceChannel != null)
        {
            console.log(VoiceChannel.name + " was found and is a " + VoiceChannel.type + " channel.")
            VoiceChannel.join()
            .then(connection => {
                console.log("Bot joined the channel.");
                const stream = ytdl('https://www.youtube.com/watch?v=khRlImMLoEw', { filter : 'audioonly'});
                const dispatcher = connection.play(stream, streamOptions);
            })
            .catch();
        }
        
    }
});

client.on('message', async message => {
    if(message.author.bot) return;

    if(message.content.toLowerCase() === 'Removedplay') {
        let embed = new Discord.MessageEmbed()
            .setColor("#FF0000")
            .setDescription("Please enter a song or YouTube video name. Be as specific as possible in order to get the song/vid u want :)")
            .setTitle("YouTube Search")
            let embedMsg = await message.channel.send(embed);
            let filter = m => m.author.id === message.author.id;
            let query = await message.channel.awaitMessages(filter, { max: 1 });
            let results = await search(query, opts).catch(err => console.log(err));
            if(results) {
                let youtubeResults = results.results;
                let i =0;
                let titles = youtubeResults.map(result => {
                    i++;
                    return i + ") " + result.title;
                });
                console.log(titles);
                
            }


    };
});

client.on('message', async message => {



    let novoice = new Discord.MessageEmbed()
    .setColor("#FF0000")
    .setDescription("Please enter a song or YouTube video name. Be as specific as possible in order to get the song/vid u want :)")
    .setTitle("You have to be in a voice channel to use this command :angie:.")
    let invalidPerms = new Discord.MessageEmbed()
    .setTitle("I cannot join your voice channel, make sure i have the right perms to join it! :deafen: ")
    .setColor("#FF0000")
    let invalidPerms2 = new Discord.MessageEmbed()
    .setTitle("I cannot speak in your voice channel, make sure i have the right perms to join it! :deafen: ")
    .setColor("#FF0000")
    let ended = new Discord.MessageEmbed()
    .setTitle("There is nothing playing that i could skip :jamiebot:.")
    .setColor("#FF0000")
    let ended2 = new Discord.MessageEmbed()
    .setTitle("There is nothing playing :jamiebot:! ")
    .setColor("#FF0000")

    if(message.author.bot) return;
    if(message.channel.type === 'dm') return;
    const args = message.content.split(' ');
    const searchString = args.slice(1).join(' '); // '/play + link or name of song'
    const serverQueue = queue.get(message.guild.id);
    if(message.content.startsWith(PREFIX)) return;

    //Play command
    if(message.content.toLowerCase() === '/play') {
        const url = args[1] ? args [1].replace(/<(.+)>/g, '$1') : '';
        const voiceChannel = message.member.voiceChannel
        if(!voiceChannel) return message.channel.send(novoice);
        const permission = voiceChannel.permissionsFor(message.client.user);
        if(!permission.has('CONNECT')) return message.channel.send(invalidPerms);
        if(!permission.has('SPEAK')) return message.channel.send(invalidPerms2);
        try {
            var videos = await youtube.searchVideos(searchString, 1);
            var video = await youtube.getVideoByID(videos[0].id);
        } catch(error) {
            try {
                var videos = await youtube.searchVideos(searchString, 1);
                var videos = await youtube.getVideosByID(videos[0].id);
            } catch (err) {
                let nosearch = new Discord.MessageEmbed()
                .setTitle("Soz i couldn't find anything on youtube for that :jamiebot:.")
                .setColor("#FF0000")
                console.log(err)
                return message.channel.send(nosearch);
            }
        }
        

        const song = {
            id:video.id,
            title: video.title,
            url: `https://www.youtube.com/watch?v=${video.id}`
        };
        if (!serverQueue) {
            const queueConstruct = {
                textChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            }
            queue.set(message.guild.id, queueConstruct)
            queueConstruct.songs.push(song)
            try {
                var connect = await voiceChannel.join()
                queueConstruct.connection = connection
                play(message.guild, queueConstruct.songs[0])
            } catch (error) {
                console.error(`i could not join the channel! ${error}`)
                queue.delete(message.guild.id)
                let error1 = new Discord.MessageEmbed()
                .setTitle("I couldn't join the Voice Channel :jamiebot:!")
                .setDescription(`${error}`)
                .setColor("#FF0000")
                return message.channel.send(error1)
            } 
        } else {
                serverQueue.songs.push(song)
                let newsong = new Discord.MessageEmbed()
                .setTitle(`**${song.title}** has been added to the queue!`)
                .setColor("#00ff7f")
                return message.channel.send(newsong);
            }
            return;

            //Skip Command
        } else if (message.content === `${PREFIX}skip`) {
            if (!message.member.voiceChannel) return message.channel.send(novoice)
            if (!serverQueue) return message.channel.send(ended1)
            serverQueue.connection.dispatcher.end();
            let skipped = new Discord.MessageEmbed()
            .setTitle(`I skipped the song! :jamiebot:`)
            .setColor("##00ff7f")
            return message.channel.send(skipped)

            //Leave Command (make the bot leave the channel)
        } else if (message.content === `${PREFIX}leave`) {
            if (!serverQueue) return message.channel.send(ended2)
            if (!message.member.voiceChannel) return message.channel.send(novoice)
            let stop = Discord.MessageEmbed()
            .setTitle("**I have left the voice channel! :jamiebot:**")
            .setColor("#00ff7f")
            message.channel.send(stop)
            serverQueue.songs = [];
            serverQueue.connection.dispatcher.end();
            return

            //volume command
       

            //Queue Command
        } else if (message.content === `${PREFIX}queue`) {
            let empty = new Discord.MessageEmbed()
            .setTitle("There is nothing in the queue. :jamiebot:")
            .setColor("FF0000")
            if (!serverQueue) return message.channel.send(empty)
            if (!message.member.voiceChannel) return message.channel.send(novoice)
            let queuelist = new Discord.MessageEmbed()
            .setTitle("__**Queue List:**__")
            .setDescription(`${serverQueue.songs.map(song => `**X** ${song.title}`).join(`\n`)}

        **Now Playing: ** ${serverQueue.songs[0].title}`)
            .setColor("1a8cff")
            return message.channel.send(queuelist)
        }
       
    function play(guild, song) {
        const serverQueue = queue.get(guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave()
            queue.delete(guild.id)
            return
        } 
    }

   
});
