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
const PORT = process.env.PORT




client.login(process.env.TOKEN);

client.on('ready', () => {
    console.log("logged in as ", client.user.username + "#" + client.user.discriminator);
});

const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 0.2 };

var musicUrls = [];

client.on('message', message => {

     
    if(message.content.toLowerCase().startsWith("/music"))
    {
        let VoiceChannel = message.member.guild.channels.cache.find(channel => channel.id === '709029994264789035');
        if(VoiceChannel != null)
        {
            console.log(VoiceChannel.name + " was found and is a " + VoiceChannel.type + " channel.")
            VoiceChannel.join()
            .then(connection => {
                console.log("Bot joined the channel.");
                const stream = ytdl('https://www.youtube.com/watch?v=yGftw1ojNtc', { filter : 'audioonly'});
                const dispatcher = connection.play(stream, streamOptions);
            })
            .catch();
        }
        
    }
});

client.on('message', async message => {
    if(message.author.bot) return;

    if(message.content.toLowerCase() === '/play') {
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
