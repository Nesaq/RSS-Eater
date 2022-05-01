import i18next from 'i18next';
import onChange from 'on-change';
import ru from './locales/ru.js';

// тут будут представления постов, фидов, ошибок
// создать для каждой задачи по "хэндлеру", который передадим в конечный рендер (watchedState?)
// состо\яния: finished, sending, failed, filling,
// попробовать обратиться напрямую к processState в switch
// понять когда блокируем кнопку
// ответить на вопрос нужно ли разблокировать кнопку после отправки данных во время валидации
// проверить работает ли i18next , если передать инстанс в аргумент рендера - это неудобно

const i18nInstance = i18next.createInstance();

i18nInstance.init({
  lng: 'ru',
  debug: false,
  resources: { ru },
});

const getElements = {
  form: document.querySelector('.rss-form'),
  urlInput: document.getElementById('url-input'),
  feedback: document.querySelector('.feedback'),
  button: document.querySelector('button[aria-label=add]'),
};

const {
  form, urlInput, feedback, button,
} = getElements;

const processStateHandler = (processState) => {
  switch (processState) {
    case 'sending':
      button.disabled = true;
      break;
    case 'finished':
      button.disabled = false;
      urlInput.classList.remove('is-invalid');
      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = i18nInstance.t('successAddingRss');
      form.reset();
      getElements.urlInput.focus();
      break;
    case 'error':
      button.disabled = true;
      break;
    default:
      throw new Error(`Wrong processState ${processState}`);
  }
};

const renderErrors = (error) => {
  if (error !== '') {
    urlInput.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t('validationErrors');
  }
};

const render = (state) => (path, value) => {
  console.log(`path: ${path}`);
  console.log(`state: ${state}`);
  console.log(`value: ${value}`);

  switch (path) {
    case 'form.processState':
      processStateHandler(value, state, getElements);
      break;
    case 'form.textStatus':
      renderErrors(value, state, getElements);
      break;
    default:
      throw new Error(`Wrong path: ${path}`);
  }
};
const watchedState = (state) => onChange(state, render(state));

export default watchedState;


// https://ru.hexlet.io/courses/js-frontend-architecture/lessons/i18n/theory_unit
