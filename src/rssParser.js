import _ from 'lodash';

const rssParser = (response) => {
    console.log(`response: ${response}`)
    const parser = new DOMParser();
    const doc = parser.parseFromString();
    const title = doc.querySelector('title');
    const description = doc.querySelector('description');
    const feed = {
        feedTitle: title.textContent,
        feedDesc: description.textContent,
        feedId: _.uniqueId('feed_'),

    };
    const items = doc.querySelectorAll('item');
    const posts = Array.from(items).map((item) => {
      const itemTitle = item.querySelector('title');
      const itemDesc = item.querySelector('description');
      const itemLink = item.querySelector('link');
      return {
        itemTitle: itemTitle.textContent,
        itemDesc: itemDesc.textContent,
        itemLink: itemLink.textContent,
        itemId: _.uniqueId('post_'),
      };
    });
    return { feed, posts };
};


export default rssParser;
`https://allorigins.hexlet.app/get?url=${encodeURIComponent('https://wikipedia.org')}`)
`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;