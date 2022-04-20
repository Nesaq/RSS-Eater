import onChange from 'on-change';
import * as yup from 'yup';
import render from './view.js';

const app = () => {
// посмотреть потом, где лучше извлекать элементы в app или во view
  const getElements = {
    form: document.querySelector('.rss-form'),
    urlInput: document.getElementById('url-input'),
    feedback: document.querySelector('.feedback'),
  };

  const state = {
    urls: [], // ulr , которые мы вставляем в поле вводе
    form: {
      url: '',
    },
    inputState: {
      errorsMessage: '', // errors messages
      state: '', // valid invalid / error /
    },
  };

  const schema = yup.object().shape({
    url: yup.string().url(),
  });

  const watchedState = onChange(state, render(state, getElements));

  getElements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    state.url = formData.get('url');
    // console.log(state.ulr);
    schema.validate({ url: state.url })
      .then((newUrl) => {
        if (!state.urls.includes(newUrl.url)) {
          state.urls.push(newUrl.url);
          state.form.url = '';
          state.inputState.errorsMessage = '';
          watchedState.inputState.state = 'valid';
        } else {
          state.inputState.errorsMessage = 'RSS уже существует';
          watchedState.inputState.state = 'error';
        }
      })
      .catch(() => {
        state.inputState.errorsMessage = 'Ссылка должна быть валидным URL';
        watchedState.inputState.state = 'error';
      });
  });
};
export default app;

//   const schema = yup
//     .string()
//     .trim()
//     .required('')
//     .url('');
