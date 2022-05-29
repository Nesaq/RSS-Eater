const processStateHandler = (processState, i18nInstance, elements) => {
  const {
    button, form, feedback, urlInput,
  } = elements;

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
      elements.urlInput.focus();
      break;
    case 'error':
      button.disabled = false;
      urlInput.removeAttribute('readonly');
      break;
    default:
      throw new Error(`Wrong processState ${processState}`);
  }
};

const renderErrors = (error, i18nInstance, elements) => {
  const { urlInput, feedback } = elements;
  if (error !== '') {
    urlInput.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    feedback.textContent = i18nInstance.t(`messages.${error}`);
  }
};

const feedsRender = (feeds, i18nInstance, elements) => {
  const feedsEl = elements.feeds;

  feedsEl.innerHTML = '';
  const feedsCard = document.createElement('div');
  feedsCard.classList.add('card', 'border-0');
  elements.feeds.prepend(feedsCard);

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
    console.log(feed);
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

const postsRender = (posts, state, i18nInstance, elements) => {
  // console.log(posts);
  const postsEl = elements.posts;

  postsEl.innerHTML = '';
  const postsDiv = document.createElement('div');
  postsDiv.classList.add('card', 'border-0');
  elements.posts.prepend(postsDiv);

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

const renderModal = (itemId, state, elements) => {
  const openModal = state.posts.find((post) => post.itemId === itemId);

  const title = elements.modal.modalTitle;
  const body = elements.modal.modalBody;
  const fullPost = elements.modal.readButton;

  title.textContent = openModal.itemTitle;
  body.textContent = openModal.itemDesc;
  fullPost.href = openModal.itemLink;
};

const renderReadPostsId = (idList) => {
  idList.forEach((id) => {
    const post = document.querySelector(`a[data-id="${id}"]`);
    post.classList.remove('fw-bold');
    post.classList.add('fw-normal', 'link-secondary');
  });
};

const render = (state, i18nInstance, elements) => (path, value) => {
  switch (path) {
    case 'form.processState':
      processStateHandler(value, i18nInstance, elements);
      break;
    case 'form.errors':
      renderErrors(value, i18nInstance, elements);
      break;
    case 'feeds':
      feedsRender(value, i18nInstance, elements);
      break;
    case 'posts':
      postsRender(value, state, i18nInstance, elements);
      break;
    case 'modalPostItemId':
      renderModal(value, state, elements);
      break;
    case 'readPostsId':
      renderReadPostsId(value);
      break;
    default:
      throw new Error(`Wrong path: ${path}`);
  }
};

export default render;
