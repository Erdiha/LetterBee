const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

axios
  .get('https://eslforums.com/5-letter-words/#5_Letter_Words')
  .then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    const words = [];
    $('li').each((i, element) => {
      const word = $(element).text().trim();
      if (word.length === 5) {
        words.push(word);
      }
    });

    console.table(words);
  })
  .catch((error) => {
    console.log(error);
  });
