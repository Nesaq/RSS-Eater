import onChange from 'on-change';
import i18next from 'i18next';
import ru from './locales/ru.js';

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

const {
  form, urlInput, feedback, button,
} = getElements;

const processStateHandler = (processState, i18nInstance) => {
  switch (processState) {
    case 'filling':
      button.disabled = false;
      break;
    case 'pending':
      button.disabled = true;
      urlInput.removeAttribute('readonly');
      urlInput.focus();
      break;
    case 'added':
      button.disabled = false;
      urlInput.removeAttribute('readonly');
      urlInput.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18nInstance.t('messages.successAddingRss');
      form.reset();
      getElements.urlInput.focus();
      break;
    case 'error':
      button.disabled = false;
      urlInput.removeAttribute('readonly');
      break;
    default:
      throw new Error(`Wrong processState ${processState}`);
  }
};

const renderErrors = (error, i18nInstance) => {
  if (error !== '') {
    urlInput.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t(`messages.${error}`);
  }
};

const feedsRender = (feeds, i18nInstance) => {
  getElements.feeds.innerHTML = '';
  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');
  getElements.feeds.prepend(feedsCard);

  const titleDiv = document.createElement('div');
  titleDiv.classList.add('card-body');
  feedsCard.append(titleDiv);

  const h2El = document.createElement('h2');
  h2El.classList.add('card-title', 'h4');
  h2El.textContent = i18nInstance.t('messages.feeds');
  titleDiv.append(h2El);

  const listUL = document.createElement('ul');
  listUL.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
    const liList = document.createElement('li');
    liList.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3El = document.createElement('h3');
    h3El.classList.add('h6', 'm-0');
    h3El.textContent = feed.feedTitle;
    liList.append(h3El);

    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.feedDesc;
    liList.append(p);

    listUL.prepend(liList);
  });
  titleDiv.append(listUL);
};

const postsRender = (posts, state, i18nInstance) => {
  getElements.posts.innerHTML = '';
  const postsDiv = document.createElement('div');
  postsDiv.classList.add('card', 'border-0');
  getElements.posts.prepend(postsDiv);

  const divTitle = document.createElement('div');
  divTitle.classList.add('card-body');
  postsDiv.append(divTitle);

  const h2El = document.createElement('h2');
  h2El.classList.add('card-title', 'h4');
  h2El.textContent = i18nInstance.t('messages.posts');
  divTitle.prepend(h2El);

  const ulList = document.createElement('ul');
  ulList.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    // console.log(post);
    const liList = document.createElement('li');
    liList.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    if (state.readPostsId.includes(post.itemId)) {
      a.classList.add('fw-normal', 'link-secondary');
    } else {
      a.classList.add('fw-bold');
    }

    a.href = post.itemLink;
    a.textContent = post.itemTitle;
    a.setAttribute('data-id', post.itemId);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    liList.append(a);

    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('type', 'button');
    buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonEl.dataset.id = post.itemId;
    buttonEl.dataset.bsToggle = 'modal';
    buttonEl.dataset.bsTarget = '#modal';
    buttonEl.textContent = i18nInstance.t('messages.view');
    liList.append(buttonEl);
    ulList.append(liList);
  });
  postsDiv.append(ulList);
};

const renderModal = (itemId, state) => {
  const itemIdPost = state.posts.find((post) => post.itemId === itemId);

  const title = getElements.modal.modalTitle;
  const body = getElements.modal.modalBody;
  const fullPost = getElements.modal.readButton;

  title.textContent = itemIdPost.itemTitle;
  body.textContent = itemIdPost.itemDesc;
  fullPost.href = itemIdPost.itemLink;
};

const renderReadPostsId = (posts) => {
  posts.forEach((postId) => {
    const post = document.querySelector(`a[data-id="${postId}"]`);
    post.classList.remove('fw-bold');
    post.classList.add('fw-normal', 'link-secondary');
  });
};

const render = (state) => (path, value) => {
  console.log(`PATH: ${path}`);
  const i18nInstance = i18next.createInstance();
  i18nInstance.init({
    lng: 'ru',
    debug: false,
    resources: {
      ru,
    },
  });

  switch (path) {
    case 'form.processState':
      processStateHandler(value, i18nInstance);
      break;
    case 'form.errors':
      renderErrors(value, i18nInstance);
      break;
    case 'feeds':
      feedsRender(value, i18nInstance);
      break;
    case 'posts':
      postsRender(value, state, i18nInstance);
      break;
    case 'modalPostItemId':
      renderModal(value, state);
      break;
    case 'readPostsId':
      renderReadPostsId(value);
      break;
    default:
      throw new Error(`Wrong path: ${path}`);
  }
};
const watchedState = (state) => onChange(state, render(state));

export default watchedState;
