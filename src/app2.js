// import onChange from 'on-change';
// import * as yup from 'yup';
// import i18next from 'i18next';
// import render from './view2.js';
// import ru from './locales/ru';

// yup.setLocale({
//   string: {
//     url: () => ({ key: 'invalidUrl' }),
//   },
//   mixed: {
//     notOneOf: () => ({ key: 'notUniqueUrl' }),
//   },
// });

// const app = (i18nIntance) => {
//   const elements = {
//     container: document.querySelector('.container-fluid'),
//     form: document.querySelector('.rss-form'),
//     urlInput: document.getElementById('url-input'),
//     submitButton: document.querySelector('input[type="submit"]'),
//     urlExample: document.querySelector('.text-muted'),
//     feedback: document.querySelector('.feedback'),
//   };
//   const state = {
//     locale: 'ru',
//     data: {
//       urls: [],
//       urlToAdd: '',
//     },
//     additionProcess: {
//       state: '', // sent, error, sending, filling
//       // formState: '', // sent, error, sending, filling
//       validationState: '', // valid / invalid
//       errorDescPath: '',
//     },
//   };

//   const watchedState = onChange(state, render(i18nIntance, state, elements));

//   yup.setLocale({
//     url: () => ({ key: 'invalidUrl' }),
//     notOneOf: () => ({ key: 'notUnique' }),
//   });

//   elements.form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     state.data.urlToAdd = formData.get('url');
//     yup.string()
//       .url()
//       .notOneOf(state.data.urls)
//       .validate(state.data.urlToAdd)
//       .then(() => {
//         state.data.urls.push(state.data.urlToAdd);
//         watchedState.additionProcess.validationState = 'valid';
//       })
//       .catch((err) => {
//         console.log('err.errors: ', err.errors);
//         console.log('keys:', Object.entries(err));
//         console.log('err.name: ', err.name);
//         console.log('err.message:', err.message);
//         const [{ key }] = err.errors;
//         state.additionProcess.errorDescPath = `addRssUrlForm.errors.${key}`;
//         watchedState.additionProcess.validationState = 'invalid';
//       });
//   });
// };
// const runApp = () => {
//   const i18nextIntance = i18next.createInstance();
//   i18nextIntance.init({
//     lng: 'ru',
//     debug: true,
//     resources: {
//       ru,
//     },
//   }).then(() => app(i18nextIntance));
// };
// export default runApp;

// // // //   getElements.form.addEventListener('submit', (e) => {
// // //     e.preventDefault();
// // //     watchedState.processState = 'successAddingRss';р
// // //     const formData = new FormData(e.target);
// // //     const url = formData.get('url');
// // //     const schema = yup.object().shape({
// // //       url: yup.string().url().notOneOf(watchedState.form.feeds),
// // //     });
// // //       schema.validate(url).then(() => {

// // //       })
// // //         if (!state.urls.includes(newUrls.url)) {
// // //           state.urls.push(newUrls.url);
// // //           state.form.url = '';
// // //           state.inputState.errorsMessage = '';
// // //           watchedState.inputState.state = 'successAddingRss';
// // //         } else {
// // //           state.inputState.errorsMessage = 'rssExistError';
// // //           watchedState.inputState.state = 'error';
// // //         }
// // //       })
// // //       .catch(() => {
// // //         state.inputState.errorsMessage = 'validationErrors';
// // //         watchedState.inputState.state = 'error';
// // //       });
// // //   });
// // // };
// // export default app;

// // // // import ru from './locales/ru.js';

// // // // const i18nInstance = i18next.createInstance();
// // // // i18nInstance.init({
// // // //   lng: 'ru',
// // // //   debug: false,
// // // //   resources: { ru },
// // // // }).then((t) => {
// // // //   return t
// // // //   // yup.setLocale({
// // // //   //   mixed: {
// // // //   //     notOneOf: i18nInstance.t('messages.rssExistError'),
// // // //   //   },
// // // //   //   string: {
// // // //   //     // url: i18nInstance.t('messages.validationErrors'),
// // // //   //     url: ({ url }) => ({ key: 'validationErrors', values: { url } }),

// // // //   //   },
// // // //   // });
// // // // });

// // // // yup.setLocale({
// // // //   mixed: {
// // // //     notOneOf: i18nInstance.t('messages.rssExistError'),
// // // //     default: 'hellothere'
// // // //   },
// // // //   string: {
// // // //     // url: i18nInstance.t('messages.validationErrors'),
// // // //     url: ({ url }) => ({ key: 'messages.validationErrors', values: { url } })
// // // //   },
// // // // });

// // // // yup.setLocale({
// // // //   string: {
// // // //     url: () => ({ key: 'validationErrors' }),
// // // //   },
// // // //   mixed: {
// // // //     notOneOf: () => ({ key: 'rssExistError' }),
// // // //   },
// // // // });

// // // // const schema = yup.object().shape({
// // // //   url: yup.string().url(),
// // // // });

// // // // const app = (t) => {
// // // // // посмотреть потом, где лучше извлекать элементы в app или во view
// // // //   const getElements = {
// // // //     form: document.querySelector('.rss-form'),
// // // //     urlInput: document.getElementById('url-input'),
// // // //     feedback: document.querySelector('.feedback'),
// // // //   };

// // // //   const state = {
// // // //     urls: [], // ulr , которые мы вставляем в поле вводе
// // // //     form: {
// // // //       url: '',
// // // //     },
// // // //     inputState: {
// // // //       errorMessages: '', // errors messages
// // // //       state: '', // valid invalid / error /
// // // //     },
// // // //   };

// // //       // const schema = yup
// // //       // .string()
// // //       // .url()
// // //       // .notOneOf(state.urls);

// // //   // const watchedState = onChange(state, render(state, getElements, i18nIntance));

// // //   // getElements.form.addEventListener('submit', (e) => {
// // //   //   e.preventDefault();
// // //   //   const formData = new FormData(e.target);
// // //   //   // const url = formData.get('url');
// // //   //   state.url = formData.get('url');
// // //   //   // console.log(state.ulr);
// // //   //   schema.validate({ url: state.urls })
// // //   //     .then((newUrl) => {
// // //   //       console.log(newUrl);
// // //   //       if (!state.urls.includes(newUrl.url)) {
// // //   //         state.urls.push(newUrl.url);
// // //   //         // state.form.url = '';
// // //   //         // state.form.textStatus = '';
// // //   //         // watchedState.inputState.state = 'valid';
// // //   //         state.data.urls.push(state.form.url);
// // //   //         watchedState.inputState.state = 'valid';
// // //   //       // } else {
// // //   //       //   state.inputState.errorsMessage = t.t('');
// // //   //       //   watchedState.inputState.state = 'error';
// // //   //       // }
// // //       // }
// // // //       .catch((err) => {
// // // //         const [{ key }] = err.errors;
// // // //         watchedState.inputState.state = 'invalid';
// // // //         // console.log(t('messages.validationErrors'))
// // // //         // err.errors.map((key) => {
// // // //         //  console.log(key.key)
// // // //         //  console.log(t.t(key.key))
// // // //         //  console.log(t.t('messages.validationErrors'))
// // // //         //  state.inputState.errorsMessage = key.key;

// // // //        })
// // // //         // state.inputState.errorsMessage = 'Ссылка должна быть валидным URL';
// // // //         watchedState.inputState.state = 'invalid';
// // // //       });
// // // //   });
// // // // };
// // // // export default app;
