// //     }
// const render = (state) => ((path, value) => {
//   console.log(`value: ${value}`);
//   console.log(`state: ${state}`);
//   console.log(`path: ${path}`);

//   const getElements = {
//     form: document.querySelector('.rss-form'),
//     urlInput: document.getElementById('url-input'),
//     feedback: document.querySelector('.feedback'),
//  button: document.querySelector('button[aria-label=add]'),
//   };
//   const { form, urlInput, feedback } = getElements;

//   switch (state.form.processState) {
//     case 'successAddingRss':
//       urlInput.classList.remove('is-invalid');
//       feedback.classList.remove('text-danger');
//       feedback.textContent = i18nInstance.t(`messages.${value}`);
//       form.reset();
//       urlInput.focus();
//       break;

//     case 'validationErrors':
//       urlInput.classList.add('is-invalid');
//       feedback.classList.remove('text-success');
//       feedback.classList.add('text-danger');
//       feedback.textContent = i18nInstance.t(`messages.${value}`);
//       break;

//     case 'rssExistError':
//       urlInput.classList.add('is-invalid');
//       feedback.classList.remove('text-success');
//       feedback.classList.add('text-danger');
//       feedback.textContent = i18nInstance.t(`massages.${value}`);
//       break;

//     case 'urlRssCheck':
//       urlInput.classList.add('is-invalid');
//       feedback.classList.remove('text-success');
//       feedback.classList.add('text-danger');
//       feedback.textContent = i18nInstance.t(`messages.${value}`);
//       break;

//     default:
//       throw new Error();
//   }
// });

// export default render;
// const getElements = {
//   form: document.querySelector('.rss-form'),
//   urlInput: document.getElementById('url-input'),
//   feedback: document.querySelector('.feedback'),
//   button: document.querySelector('button[aria-label=add]'),
// };

// const {
//   form, urlInput, feedback, button,
// } = getElements;

// const processStateHandler = (processState, state) => {
//   switch (processState) {
//     case 'sending':
//       button.disabled = true;
//       break;
//     case 'finished':
//       button.disabled = false;
//       urlInput.classList.remove('is-invalid');
//       feedback.classList.remove('text-danger');
//       feedback.classList.add('text-success');
//       feedback.textContent = state.form.textStatus;
//       form.reset();
//       getElements.urlInput.focus();
//       break;
//     case 'error':
//       button.disabled = true;
//       break;
//     default:
//       throw new Error(`Wrong processState ${processState}`);
//   }
// };

// const renderErrors = (error, state) => {
//   if (error !== '') {
//     urlInput.classList.add('is-invalid');
//     feedback.classList.remove('text-success');
//     feedback.classList.add('text-danger');
//     feedback.textContent = state.form.textStatus;
//   }
// };

// const render = (state) => (path, value) => {
//   console.log(`path: ${path}`);
//   console.log(`state: ${state}`);
//   console.log(`value: ${value}`);

//   switch (path) {
//     case 'form.processState':
//       processStateHandler(value, state, getElements);
//       break;
//     case 'form.textStatus':
//       renderErrors(value, state, getElements);
//       break;
//     default:
//       throw new Error(`Wrong path: ${path}`);
//   }
// };
// const watchedState = (state) => onChange(state, render(state));

// export default watchedState;