import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import axios, { AxiosError } from 'axios';
import _ from 'lodash';
import parser from './rssParser.js';
import getUrlProxy from './getUrl.js';
import render from './view.js';
import ru from './locales/ru.js';

const app = (i18nInstance) => {
  const state = {
    form: {
      processState: 'filling',
      errors: '',
    },
    feeds: [],
    posts: [],
    readPostsId: [],
  };

  const elements = {
    form: document.querySelector('.rss-form'),
    urlInput: document.getElementById('url-input'),
    feedback: document.querySelector('.feedback'),
    button: document.querySelector('button[aria-label=add]'),
    feeds: document.querySelector('.feeds'),
    posts: document.querySelector('.posts'),
    modal: {
      modalTitle: document.querySelector('.modal-title'),
      modalBody: document.querySelector('.modal-body'),
      readButton: document.querySelector('.full-article'),
    },
  };

  const watchedState = onChange(state, render(state, i18nInstance, elements));
  const timerForUpdates = 5000;

  yup.setLocale({
    string: {
      url: 'notValidUrl',
    },
    mixed: {
      notOneOf: 'rssExistError',
      required: 'fieldRequired',
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    watchedState.form.processState = 'pending';

    const validateUrl = yup.object().shape({
      url: yup.string().url().notOneOf(watchedState.feeds.map((feed) => feed.url)).required(),
    });

    try {
      await validateUrl.validate({ url });
      const response = await axios.get(getUrlProxy(url));
      const { feed, posts } = parser(response, url);
      const postsWithId = posts.map((post) => ({ ...post, itemId: _.uniqueId('post_') }));
      watchedState.feeds.push(feed);
      watchedState.posts = [...postsWithId, ...state.posts];
      watchedState.form.processState = 'added';
    } catch (error) {
      watchedState.form.processState = 'error';
      watchedState.form.errors = error.errors;
      if (error instanceof TypeError) {
        elements.feedback.textContent = i18nInstance.t('messages.TypeError');
      } else if (error instanceof AxiosError) {
        elements.feedback.textContent = i18nInstance.t('messages.AxiosError');
      }
    }
  };

  elements.form.addEventListener('submit', handleSubmit);

  const contentUpdate = async () => {
    await Promise.all(state.feeds.map(async ({ url }) => {
      try {
        const response = await axios.get(getUrlProxy(url));
        const { posts } = parser(response, url);
        const addedPostLinks = state.posts.map(({ itemLink }) => itemLink);
        const addNewPosts = posts.filter(({ itemLink }) => !addedPostLinks.includes(itemLink))
          .map((post) => ({ ...post, itemId: _.uniqueId('post_') }));
        watchedState.posts = [...addNewPosts, ...state.posts];
      } catch (error) {
        console.error(error);
      }
    }));
    setTimeout(contentUpdate, timerForUpdates);
  };
  contentUpdate();

  elements.posts.addEventListener('click', ({ target }) => {
    const postID = target.dataset.id;
    watchedState.modalPostItemId = postID;
    watchedState.readPostsId.push(postID);
  });
};

const runApp = () => {
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  }).then(() => app(i18nInstance));
};

export default runApp;
