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
let PREFIX = '/';
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

     
    if(message.content.toLowerCase().startsWith("/cheeto"))
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
    setColor("#FF0000")
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


            
        }
    
);
