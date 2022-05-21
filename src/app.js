import * as yup from 'yup';
import axios from 'axios';
import parser from './rssParser.js';
import watcher from './view.js';

const validateUrl = (incomingUrl, urls) => yup
  .string()
  .url()
  .notOneOf(urls)
  .required()
  .validate(incomingUrl);

const app = () => {
  const state = {
    form: {
      processState: 'filling',
      textStatus: '',
      incomingUrl: '',
      urls: [],
    },
    feeds: [],
    posts: [],
    readedPostsId: [],
  };

  const watchedState = watcher(state);
  const timerForUpdates = 5000;

  yup.setLocale({
    string: {
      url: () => ({ key: 'notValidUrl' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'rssExistError' }),
      required: () => ({ key: 'fieldRequired' }),
    },
  });

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.form.incomingUrl = formData.get('url');
    watchedState.form.processState = 'pending';

    validateUrl(state.form.incomingUrl, state.form.urls)
      .then(() => {
        state.form.urls.push(state.form.incomingUrl);
        return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(state.form.incomingUrl)}`)
          .then((response) => {
            const { feed, posts } = parser(response);
            watchedState.posts = state.posts.concat(posts);
            watchedState.feeds = state.feeds.concat(feed);
            watchedState.form.processState = 'goodCase';
            watchedState.form.textStatus = '';
          })
          .catch((err) => {
            console.log(err);
            console.log(err.message);
            watchedState.form.processState = 'error';
            watchedState.form.textStatus = err.name;
          });
      })
      .catch((err) => {
        console.log(err);
        const [{ key }] = err.errors;
        console.log(key);
        watchedState.form.processState = 'error';
        watchedState.form.textStatus = key;
      });
  });
  const contentUpdate = () => {
    setTimeout(() => {
      state.feeds.forEach(({ url }) => {
        axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
          .then((response) => {
            const { posts } = parser(response);
            const addedPostLinks = state.posts.map(({ itemLink }) => itemLink);
            const newPosts = posts.filter(({ itemLink }) => !addedPostLinks.includes(itemLink));
            watchedState.posts = state.posts.concat(newPosts);
            console.log(watchedState.posts);
            contentUpdate();
          })
          .catch((err) => {
            console.log(err);
            // console.log(err.name);
            watchedState.form.processState = 'error';
            watchedState.form.textStatus = err.name;
            // TypeError:
            // Cannot read properties of null (reading 'textContent')
          });
      });
      // contentUpdate();
    }, timerForUpdates);
  };
  contentUpdate();

  const postEl = document.querySelector('.posts');
  postEl.addEventListener('click', (e) => {
    const readedLink = state.posts.filter(({ itemId }) => itemId === e.target.dataset.id);
    watchedState.modalPosts = readedLink;
    watchedState.readPostsId = state.readedPostsId.concat(e.target.dataset.id);
  });
};

export default app;
