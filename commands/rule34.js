const axios = require("axios");
const cheerio = require("cheerio");
const { Client, MessageAttachment } = require('discord.js');

module.exports = {
	name: 'rule34',
	description: 'rule 34!',
	async execute(message, args) {
        let search = args[0];
        if(args.length > 1) {
            search = '';
             args.forEach(arg => {
                 search += arg + '_';
             })
             search = search.slice(0, search.length - 1);
        }
        let url = `https://rule34.xxx/index.php?page=post&s=list&tags=${search}`;

        let data = await axios.get(url);
        let $ = cheerio.load(data.data);

        if($('#paginator .pagination a').last().attr('href') != undefined) {
            let lastPage = $('#paginator .pagination a').last().attr('href').split('=');
            lastPage = (lastPage[lastPage.length - 1] / 42) + 1;
            let randomPage = Math.floor(Math.random() * lastPage) * 42;
    
            url = `https://rule34.xxx/index.php?page=post&s=list&tags=${search}&pid=${randomPage}`;
            data = await axios.get(url);
            $ = cheerio.load(data.data);
        }
        

        let imgs = $('#content .content div').find('img').parent();
        let imgLinks = [];

        for (img in imgs) {
            if($(imgs[img]).attr('href') == undefined) break;
            if($(imgs[img]).children().css('border') != undefined) continue;
            imgLinks.push($(imgs[img]).attr('href'));
        }

        imgLinks.pop();

        if(imgLinks != 0) {
            data = await axios.get(url + '/' + imgLinks[Math.floor(Math.random() * imgLinks.length)]);
            $ = cheerio.load(data.data);
            let src = $('#image').attr('src');
    
            const attachment = new MessageAttachment(src);
            message.channel.send(attachment);
        }
        
        else {
            message.channel.send('Nemit slika sinc.');
        }
	},
};