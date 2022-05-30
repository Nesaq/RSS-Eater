const rssParser = (response, url) => {
  const parser = new DOMParser();
  const data = parser.parseFromString(response.data.contents, 'application/xml');
  const title = data.querySelector('title');
  const description = data.querySelector('description');
  const parseErr = data.querySelector('parsererror');

  if (parseErr) {
    throw new Error('TypeError').firstChild.textContent;
  }

  const feed = {
    url,
    feedTitle: title.textContent,
    feedDesc: description.textContent,
  };
  const items = data.querySelectorAll('item');
  const posts = Array.from(items).map((item) => {
    const itemTitle = item.querySelector('title');
    const itemDesc = item.querySelector('description');
    const itemLink = item.querySelector('link');
    return {
      itemTitle: itemTitle.textContent,
      itemDesc: itemDesc.textContent,
      itemLink: itemLink.textContent,
    };
  });
  return { feed, posts };
};

export default rssParser;
