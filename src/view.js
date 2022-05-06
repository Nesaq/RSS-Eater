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
      break;
    case 'sending':
      button.disabled = true;
      break;
    case 'good':
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
      break;
    default:
      throw new Error(`Wrong processState ${processState}`);
  }
};

const renderErrors = (error, state) => {
  if (error === 'MyValidationErrors') {
    urlInput.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t(`messages.${state.form.textStatus}`);
    //  i18nInstance.t(`messages.${state.form.textStatus}`)
  }
};

const feedsRender = (feeds) => {
  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');
  getElements.posts.prepend(feedsCard);

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
    liList.innerHTML = `
    <h3 class="h6 m-0">${feed.title}</h3>
    <p class="m-0 small text-black-50">${feed.description}</p>
    `;
    listUL.prepend(liList);
  });
  titleDiv.append(listUL);
};

const render = (state) => (path, value) => {
  console.log(`path: ${path}`);
  console.log(`state: ${state}`);
  console.log(`value: ${value}`);

  switch (path) {
    case 'form.processState':
      processStateHandler(value, state);
      break;
    case 'form.textStatus':
      renderErrors(value, state);
      break;
    case 'feeds':
      feedsRender(value, state);
      break;
    default:
      throw new Error(`Wrong path: ${path}`);
  }
};
const watchedState = (state) => onChange(state, render(state));

export default watchedState;

// https://ru.hexlet.io/courses/js-frontend-architecture/lessons/i18n/theory_unit
