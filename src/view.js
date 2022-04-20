const render = (state, getElements) => (path, value) => {
  console.log(`path: ${path}`);
  console.log(`value: ${value}`);
  const { feedback, urlInput, form } = getElements;

  switch (value) {
    case 'valid': {
      urlInput.classList.remove('is-invalid');
      feedback.textContent = '';
      form.reset();
      urlInput.focus();
      break;
    }
    case 'error': {
      urlInput.classList.add('is-invalid');
      feedback.textContent = state.inputState.errorsMessage;
      break;
    }

    default:
      throw new Error(`unknown state: ${value}`);
  }
};

export default render;

// inputState
// errorsMessage
