import * as yup from 'yup';
import i18next from 'i18next';
import onChange from 'on-change';
import axios from 'axios';
import _ from 'lodash';
import parser from './rssParser.js';
import getUrlProxy from './getUrl.js';
import render from './view.js';
import ru from './locales/ru.js';

const validateUrl = (incomingUrl, urls) => yup
  .string()
  .url()
  .notOneOf(urls)
  .required()
  .validate(incomingUrl);

const app = (i18nInstance) => {
  const state = {
    form: {
      processState: 'filling',
      errors: '',
      incomingUrl: '',
      urls: [],
    },
    feeds: [],
    posts: [],
    readPostsId: [],
  };

  const getElements = {
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

  const watchedState = onChange(state, render(state, i18nInstance, getElements));
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

  getElements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.form.incomingUrl = formData.get('url');
    watchedState.form.processState = 'pending';

    validateUrl(state.form.incomingUrl, state.form.urls)
      .then(() => {
        axios.get(getUrlProxy(state.form.incomingUrl))
          .then((response) => {
            const { feed, posts } = parser(response);
            feed.urlInput = state.form.incomingUrl;
            const postsWithId = posts.map((post) => _.merge(post, { itemId: _.uniqueId('post_') }));
            watchedState.feeds = state.feeds.concat(feed);
            watchedState.posts = state.posts.concat(postsWithId);
            watchedState.form.processState = 'added';
            state.form.urls.push(state.form.incomingUrl);
          })
          .catch((err) => {
            watchedState.form.processState = 'error';
            watchedState.form.errors = err.name;
          });
      })
      .catch((err) => {
        watchedState.form.processState = 'error';
        watchedState.form.errors = err.errors;
      });
  });
  const contentUpdate = () => {
    setTimeout(() => {
      state.feeds.forEach(({ urlInput }) => {
        axios.get(getUrlProxy(urlInput))
          .then((response) => {
            const { posts } = parser(response);
            const addedPostLinks = state.posts.map(({ itemLink }) => itemLink);
            const addNewPosts = posts.filter(({ itemLink }) => !addedPostLinks.includes(itemLink))
              .map((post) => _.merge(post, { itemId: _.uniqueId('post_') }));
            watchedState.posts = state.posts.concat(addNewPosts);
            console.log(addNewPosts);
          })
          .catch((err) => {
            watchedState.form.processState = 'error';
            watchedState.form.errors = err.name;
          });
      });
      contentUpdate();
    }, timerForUpdates);
  };
  contentUpdate();

  getElements.posts.addEventListener('click', (e) => {
    e.preventDefault();
    const readPostLink = state.posts.find((post) => post.itemId === e.target.dataset.id);
    console.log(readPostLink);
    watchedState.modalPostItemId = readPostLink.itemId;
    watchedState.readPostsId.push(e.target.dataset.id);
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
