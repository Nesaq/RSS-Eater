import _ from 'lodash';

const rssParser = (response) => {
  console.dir(`response: ${response}`);
  const parser = new DOMParser();
  const data = parser.parseFromString(response.data.contents, 'application/xml');
  const title = data.querySelector('title');
  const description = data.querySelector('description');
  const feed = {
    feedTitle: title.textContent,
    feedDesc: description.textContent,
    feedId: _.uniqueId('feed_'),

  };
  const items = data.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    console.log(item);
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
