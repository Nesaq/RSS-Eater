import * as yup from 'yup';
import axios from 'axios';
import _ from 'lodash';
import parser from './rssParser.js';
import getUrlProxy from './getUrl.js';
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
      errors: '',
      incomingUrl: '',
      urls: [],
    },
    feeds: [],
    posts: [],
    readPostsId: [],
  };

  const watchedState = watcher(state);
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

  const form = document.querySelector('.rss-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.form.incomingUrl = formData.get('url');
    watchedState.form.processState = 'pending';

    validateUrl(state.form.incomingUrl, state.form.urls)
      .then(() => {
        state.form.urls.push(state.form.incomingUrl);
        return axios.get(getUrlProxy(state.form.incomingUrl))
          .then((response) => {
            const { feed, posts } = parser(response);
            const postsWithId = posts.map((post) => _.merge(post, { itemId: _.uniqueId('post_') }));
            watchedState.posts = state.posts.concat(postsWithId);
            watchedState.feeds = state.feeds.concat(feed);
            watchedState.form.processState = 'added';
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
      state.feeds.forEach(({ url }) => {
        axios.get(getUrlProxy(url))
          .then((response) => {
            const { posts } = parser(response);
            const addedPostLinks = state.posts.map(({ itemLink }) => itemLink);
            const newPosts = posts.filter(({ itemLink }) => !addedPostLinks.includes(itemLink));
            watchedState.posts = state.posts.concat(newPosts);
            contentUpdate();
          })
          .catch((err) => {
            watchedState.form.processState = 'error';
            watchedState.form.errors = err.name;
          });
      });
    }, timerForUpdates);
  };
  contentUpdate();

  const postEl = document.querySelector('.posts');
  postEl.addEventListener('click', (e) => {
    const readPostLink = state.posts.find((post) => post.itemId === e.target.dataset.id);
    watchedState.modalPostItemId = readPostLink.itemId;
    watchedState.readPostsId.push(e.target.dataset.id);
  });
};

export default app;
