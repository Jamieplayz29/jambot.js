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
const { RichEmbed } = require("discord.js");
const fetch = require('node-fetch');
const { ErelaClient, Utils } = require("erela.js");
const { nodes } = require("./botconfig.json");





client.login(process.env.TOKEN);

client.on('ready', () => {
    console.log("logged in as ", client.user.username + "#" + client.user.discriminator);
    client.music = new ErelaClient(client, nodes)
        .on("nodeError", console.log)
        .on("nodeConnect", () => console.log("Succesfully created a new Node."))
        .on("queueEnd", player => {
            player.textChannel.send("Queue has ended.")
            return bot.music.players.destroy(player.guild.id)
        })
        .on("trackStart", ({textChannel}, {title, duration}) => textChannel.send(`Now playing: **${title}** \`${Utils.formatTime(duration, true)}\``))

    client.levels = new Map()
        .set("none", 0.0)
        .set("low", 0.10)
        .set("medium", 0.15)
        .set("high", 0.25);
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
                const stream = ytdl('https://www.youtube.com/watch?v=yGftw1ojNtc', { filter : 'audioonly'});
                const dispatcher = connection.play(stream, streamOptions);
            })
            .catch();
        }
        
    }
});


client.on('message', message => {

     
    if(message.content === "who has a dead yt channel") {
        message.channel.send("<@434372679668334602>");
    }

});

client.on('message', message => {

     
    if(message.content === "<@434372679668334602>") {
        message.channel.send("<@434372679668334602>");
    }

});
