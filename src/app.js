import * as yup from 'yup';
// import i18next from 'i18next';
import axios from 'axios';
import watcher from './view.js';

// import ru from './locales/ru.js';
// const i18nInstance = i18next.createInstance();

const app = (i18nInstance) => {
  const state = {
    form: {
      processState: 'filling',
      textStatus: '',
    },
    feeds: [],
    posts: [],
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
    watchedState.form.processState = 'filling';
    const formData = new FormData(e.target);
    const url = formData.get('url');
    watchedState.feeds.push(url);

    // console.log(url);
    const schema = yup
      .string()
      .url()
      .notOneOf(watchedState.feeds);

    schema.validate(url)
      .then(() => {
        watchedState.form.processState = 'good';
        watchedState.form.textStatus = 'successAddingRss';
      })
      .catch((err) => {
        console.log(i18nInstance);
        const [{ key }] = err.errors;
        // console.log(key);
        watchedState.form.processState = 'error';
        watchedState.form.textStatus = key;
      });
  });
};

export default app;
