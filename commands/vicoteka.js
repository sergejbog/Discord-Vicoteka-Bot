const axios = require("axios");
const cheerio = require("cheerio");
const { Client, MessageAttachment } = require('discord.js');

module.exports = {
	name: 'vicoteka',
	description: 'Vicoj!',
	async execute(message, args) {

        let categories = ['glupi','erotski','zivotni','zlatna-riba','informaticki',
        'izreki','lichnosti','navredi','ludnica','obrazovanie','plavushi','politichki',
        'policajski','prashanje-odgovor','razno','rasistichki','si-bile','slicnosti-razliki','crn-humor','chak-noris','random'];

        if(categories.includes(args[0])) {
            let url;
            args[0] == 'random' ? url = `https://www.vicoteka.mk/vicovi/` : url = `https://www.vicoteka.mk/vicovi/${args[0]}`;
            let data = await axios.get(url);
            let $ = cheerio.load(data.data);

            let lastPage;

            $('.pagination .last').attr('href') != undefined ? lastPage = $('.pagination .last').attr('href').split('/') : lastPage = $('.pagination').children('a').last().attr('href').split('/');
            let randomPage = Math.floor(Math.random() * lastPage[lastPage.length-2]) + 1;

            url += `/page/${randomPage}/`;

            data = await axios.get(url);
            $ = cheerio.load(data.data);

            let jokes = $('article.item-list h2.post-box-title').children('a');
            let jokeList = [];

            for (joke in jokes) {
                if($(jokes[joke]).attr('href') === undefined) break;
                jokeList.push($(jokes[joke]).attr('href'));
            }

            let randomChance = Math.floor(Math.random() * (jokeList.length-1));

            url = jokeList[randomChance];

            data = await axios.get(url);
            $ = cheerio.load(data.data);

            let jokeRandom = $('article#the-post div.entry').children('p').text().trim();
            let jokeName = $('article#the-post h1.name').children('span').text().toUpperCase().trim();
            let jokeAuthor = $('article#the-post span.post-meta-author').children('a').text().trim();
            message.channel.send(`**${jokeName}**\n *Автор: ${jokeAuthor}*\n >>> ${jokeRandom}`);

        }   else{message.channel.send(`**Choose a category:**  ${categories.join(',  ')}`)} ;

	},
};