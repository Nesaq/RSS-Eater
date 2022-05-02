import * as yup from 'yup';
// import i18next from 'i18next';
import watcher from './view.js';
// import ru from './locales/ru.js';

const app = (i18nInstance) => {
  const state = {
    form: {
      processState: 'filling',
      textStatus: '',
    },
    feeds: [],
  };

  // const i18nInstance = i18next.createInstance();
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

    console.log(url);
    const schema = yup
      .string()
      .url()
      .notOneOf(watchedState.feeds);

    schema.validate(url)
      .then(() => {
        watchedState.form.processState = 'finished';
        watchedState.form.textStatus = 'successAddingRss';
        watchedState.feeds.push(url);
      })
      .catch((err) => {
        console.log(i18nInstance);
        const [{ key }] = err.errors;
        watchedState.form.processState = 'error';
        watchedState.form.textStatus = key;
      });
  });
};

export default app;
