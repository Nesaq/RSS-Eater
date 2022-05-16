import onChange from 'on-change';
import i18next from 'i18next';
import ru from './locales/ru.js';

const i18nInstance = i18next.createInstance();
i18nInstance.init({
  lng: 'ru',
  debug: false,
  resources: {
    ru,
  },
});

// тут будут представления постов, фидов, ошибок
// создать для каждой задачи по "хэндлеру", который передадим в конечный рендер (watchedState?)
// состо\яния: finished, sending, failed, filling,
// попробовать обратиться напрямую к processState в switch
// проверить работает ли i18next , если передать инстанс в аргумент рендера - это неудобно

const getElements = {
  form: document.querySelector('.rss-form'),
  urlInput: document.getElementById('url-input'),
  feedback: document.querySelector('.feedback'),
  button: document.querySelector('button[aria-label=add]'),
  feeds: document.querySelector('.feeds'),
  posts: document.querySelector('.posts'),
};

const {
  form, urlInput, feedback, button,
} = getElements;

const processStateHandler = (processState) => {
  switch (processState) {
    case 'filling':
      button.disabled = false;
      break;
    case 'sending':
      button.disabled = true;
      break;
    case 'goodCase':
      button.disabled = false;
      urlInput.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18nInstance.t('messages.successAddingRss');
      // i18nInstance.t(`messages.${state.form.textStatus}`);
      form.reset();
      getElements.urlInput.focus();
      break;
    case 'error':
      button.disabled = false;
      // urlInput.classList.add('is-invalid');
      // feedback.classList.remove('text-success');
      // feedback.classList.add('text-danger');
      // feedback.textContent = i18nInstance.t('messages.MyValidationErrors');
      break;
    default:
      throw new Error(`Wrong processState ${processState}`);
  }
};

const renderErrors = (error) => { // 2 param could be state
  if (error === 'MyValidationErrors') {
    urlInput.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t('messages.MyValidationErrors');
    //  i18nInstance.t(`messages.${state.form.textStatus}`)
    // Любые тексты, которые выводятся в зависимости от
    //  действий пользователя, не должны храниться в состоянии приложения.
    // Эти тексты должны зависеть от состояния процессов:
  }
};

const feedsRender = (feeds) => {
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
    h3El.textContent = feed.description;
    liList.append(h3El);

    listUL.prepend(liList);
  });
  titleDiv.append(listUL);
};

const postsRender = (posts) => {
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
    const liList = document.createElement('li');
    liList.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    // a.classList.add('fw-bold');
    a.setAttribute('href', post.url);
    a.dataset.id = post.id;
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
    liList.append(a);

    const buttonEl = document.createElement('button');
    buttonEl.setAttribute('type', 'button');
    buttonEl.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    buttonEl.dataset.id = post.id;
    buttonEl.dataset.bsToggle = 'modal';
    buttonEl.dataset.bsTarget = '#modal';
    buttonEl.textContent = i18nInstance.t('messages.view');
    liList.append(buttonEl);
    ulList.append(liList);
  });
  postsDiv.append(ulList);
};

const render = (state) => (path, value) => {
  console.log(`path: ${path}`);
  console.log(`state: ${state}`);
  console.log(`value: ${value}`);

  switch (path) {
    case 'form.processState':
      processStateHandler(value);
      break;
    case 'form.textStatus':
      renderErrors(value);
      break;
    case 'feeds':
      feedsRender(value);
      break;
    case 'posts':
      postsRender(value);
      break;
    default:
      throw new Error(`Wrong path: ${path}`);
  }
};
const watchedState = (state) => onChange(state, render(state));

export default watchedState;

// // https://ru.hexlet.io/courses/js-frontend-architecture/lessons/i18n/theory_unit
