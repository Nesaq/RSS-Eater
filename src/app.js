import * as yup from 'yup';
// import i18next from 'i18next';
import axios from 'axios';
import parser from './rssParser.js';
import watcher from './view.js';

// import ru from './locales/ru.js';

const validateUrl = (incomingUrl, urls) => yup
  .string()
  .url()
  .notOneOf(urls)
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
    readPostsId: [],
  };

  const watchedState = watcher(state);
  const timerForUpdates = 5000;

  // yup.setLocale({
  //   string: {
  //     url: () => ({ key: 'MyValidationErrors' }),
  //   },
  //   mixed: {
  //     notOneOf: () => ({ key: 'rssExistError' }),
  //   },
  // });
  yup.setLocale({
    mixed: {
      notOneOf: 'rssExistError',
    },
    string: {
      url: 'MyValidationErrors',
    },
  });

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.form.incomingUrl = formData.get('url');
    // const url = formData.get('url');
    // state.form.incomingUrl(url);
    // state.feeds = url;

    // const schema = yup
    //   .string()
    //   .url()
    //   .notOneOf();

    validateUrl(state.form.incomingUrl, state.form.urls)
      .then(() => {
        state.form.urls.push(state.form.incomingUrl);
        watchedState.form.processState = 'filling';
        return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(state.form.incomingUrl)}`)
          .then((response) => {
            // console.log(response);
            const { feed, posts } = parser(response);
            watchedState.feeds = state.feeds.concat(feed);
            watchedState.posts = state.posts.concat(posts);
            watchedState.form.processState = 'goodCase';
            watchedState.form.textStatus = '';
          })
          .catch((err) => {
            watchedState.form.processState = 'error';
            watchedState.form.textStatus = err.message;
          });
      })
      .catch((err) => {
        // const [{ key }] = err.name;
        // console.log(err.name);
        watchedState.form.textStatus = err.message;
        watchedState.form.processState = 'error';
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
          })
          .catch((err) => {
            // console.log(err.name);
            // console.log(err.message);
            watchedState.form.processState = 'error'; // error
            watchedState.form.textStatus = err.message;
          });
      });
      contentUpdate();
    }, timerForUpdates);
  };
  contentUpdate();
  const postEl = document.querySelector('.posts');
  postEl.addEventListener('click', (e) => {
    const readedLink = state.posts.filter(({ itemId }) => itemId === e.target.dataset.id);
    watchedState.modalPosts = readedLink;
    watchedState.readPostsId = state.readPostsId.concat(e.target.dataset.id);
  });
};

export default app;
