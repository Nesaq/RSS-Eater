import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import parser from './rssParser.js';
import watcher from './view.js';

import ru from './locales/ru.js';

const app = (i18nInstance) => {
  const state = {
    form: {
      processState: 'filling',
      textStatus: '',
    },
    feeds: [],
    posts: [],
    uiState: {
      postsId: '',
      text2: '',
    },
  };

  const watchedState = watcher(state);

  yup.setLocale({
    string: {
      url: () => ({ key: 'MyValidationErrors' }),
    },
    mixed: {
      notOneOf: () => ({ key: 'rssExistError' }),
    },
  });

  const form = document.querySelector('.rss-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url');
    // state.feeds = url;

    const schema = yup
      .string()
      .url()
      .notOneOf(state.feeds);

    schema.validate(url)
      .then(() => {
        state.feeds.push(url);
        watchedState.form.processState = 'filling';
        return axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
          .then((response) => {
            console.log(response);
            const { feed, posts } = parser(response);
            watchedState.feeds = state.feeds.concat(feed);
            watchedState.posts = state.posts.concat(posts);
            watchedState.form.processState = 'goodCase';
          })
          .catch((err) => {
            watchedState.form.processState = 'error';
            watchedState.form.textStatus = err.name;
          });
      })
      .catch((err) => {
        console.log(i18nInstance);
        const [{ key }] = err.errors;
        console.log(err.errors);
        watchedState.form.processState = 'error';
        watchedState.form.textStatus = key;
      });
  });
};

const runApp = () => {
  const i18nextInstance = i18next.createInstance();
  i18nextInstance.init({
    lng: 'ru',
    debug: true,
    resources: ru,
  }).then(() => app(i18nextInstance));
};
export default runApp;
// export default app;
