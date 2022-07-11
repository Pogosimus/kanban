const addList = document.querySelector('.add-list');
const board = document.querySelector('.board');
let lists = document.querySelectorAll('.list-wrapper');
let addCardBtns = document.querySelectorAll('.add-card-btn');
let cancelBtns = document.querySelectorAll('.cancel-btn');
let textAreas = document.querySelectorAll('.list-add-card-input');
let listAddCardBtns = document.querySelectorAll('#list-add-card-btn');
let removeIcons = document.querySelectorAll('.remove-list');
let cards = document.querySelectorAll('.card');

addList.addEventListener('click', createList);

const mutationObserver = new MutationObserver((entries) => {
  console.log('Mutation Observer called');
  createCardProcess();
  removeList();
  dragAndDrop();
});
mutationObserver.observe(board, { childList: true });

function createList() {
  // Create new list
  const newList = document.createElement('div');
  newList.classList.add('list-wrapper');

  // Create header for new list
  const newHeaderContent = document.createElement('div');
  newHeaderContent.classList.add('list-header-content');
  const newHeader = document.createElement('div');
  newHeader.classList.add('list-header');
  newHeader.contentEditable = 'true';
  newHeader.innerText = 'Header';
  // Create remove icon
  const newRemoveIconDiv = document.createElement('div');
  newRemoveIconDiv.classList.add('remove-list');
  const newRemoveIcon = document.createElement('i');
  newRemoveIcon.innerHTML = `<i class="fa fa-remove"></i>`;
  newRemoveIconDiv.append(newRemoveIcon);
  // Grab them together
  newHeaderContent.append(newHeader, newRemoveIconDiv);

  // Create card section for new list
  const newCardList = document.createElement('div');
  newCardList.classList.add('list-cards');

  // Create card adding section for new list
  const newAddCardDiv = document.createElement('div');
  newAddCardDiv.classList.add('list-add-card');
  const newAddCardBtn = document.createElement('button');
  newAddCardBtn.id = 'list-add-card-btn';
  newAddCardBtn.innerHTML = `<span class="plus">+</span> Add a new card`;
  // Create textarea
  const newTextArea = document.createElement('textarea');
  newTextArea.classList.add('list-add-card-input');
  newTextArea.placeholder = 'Enter card title...';
  // Create div with buttons
  const newAddCardBtns = document.createElement('div');
  newAddCardBtns.classList.add('card-btns');
  const newAddBtn = document.createElement('button');
  newAddBtn.classList.add('add-card-btn');
  newAddBtn.innerText = 'Add card';
  const newCancelBtn = document.createElement('button');
  newCancelBtn.classList.add('cancel-btn');
  newCancelBtn.innerText = 'Cancel';
  newAddCardBtns.append(newAddBtn, newCancelBtn);

  newAddCardDiv.append(newAddCardBtn, newTextArea, newAddCardBtns);

  // Grab all together
  newList.append(newHeaderContent, newCardList, newAddCardDiv);

  // Insert to page
  board.insertBefore(newList, addList);
  changeListTitle();
  // createCard();
  updateContent();
  dragAndDrop();
}

function removeList() {
  removeIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      icon.closest('.list-wrapper').remove();
    });
  });
  updateContent();
  dragAndDrop();
}
removeList();

function createCardProcess() {
  window.onclick = function (e) {
    if (e.target.id === 'list-add-card-btn') {
      createCard(e);
    } else if (e.target.className === 'card') {
    }
  };
}
createCardProcess();

function createCard(e) {
  let cardTitle;
  console.log(true);
  // Init buttons on this list
  const list = e.target.closest('.list-wrapper');
  const cancelBtn = list.querySelector('.cancel-btn');
  const addCardBtn = list.querySelector('.add-card-btn');
  const textArea = list.querySelector('.list-add-card-input');
  // Display textarea and cancel button
  e.target.style.display = 'none';
  // console.log('list add card button hidden');
  cancelBtn.style.display = 'block';
  // console.log('cancel button show');
  textArea.style.display = 'block';
  // console.log('textarea show');

  // Cancel button logic
  cancelBtn.onclick = function () {
    // console.log('cancel button clicked');
    textArea.value = '';
    textArea.style.display = 'none';
    e.target.style.display = 'block';
    cancelBtn.style.display = 'none';
    addCardBtn.style.display = 'none';
  };
  // Textarea logic
  textArea.addEventListener('input', (e) => {
    cardTitle = e.target.value;
    if (cardTitle) {
      addCardBtn.style.display = 'block';
    } else {
      addCardBtn.style.display = 'none';
    }
  });

  // Add new card
  addCardBtn.onclick = function () {
    // Get cardlist section
    const cardList = list.querySelector('.list-cards');
    // Create new card
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    newCard.draggable = 'true';
    newCard.textContent = cardTitle;
    // Put new card to the cardlist
    cardList.appendChild(newCard);
    // Clear card adding section
    cancelBtn.style.display = 'none';
    textArea.value = '';
    console.log('textArea value -', textArea.value);
    textArea.style.display = 'none';
    addCardBtn.style.display = 'none';
    e.target.style.display = 'block';
    updateContent();
    dragAndDrop();
  };
}

function removeCard() {
  window.ondblclick = function (e) {
    if (e.target.className === 'card') {
      e.target.remove();
    }
  };
  dragAndDrop();
}
removeCard();

// Drag and Drop
let draggedCard;
function dragAndDrop() {
  updateContent();
  console.log('drog and drop function called');
  let cardLists = document.querySelectorAll('.list-cards');

  for (let i = 0; i < cards.length; i++) {
    let card = cards[i];

    card.ondragstart = function () {
      draggedCard = card;
      setTimeout(() => {
        card.classList = 'card dragged';
      }, 0);
    };

    card.addEventListener('dragend', () => {
      setTimeout(() => {
        card.classList = 'card';
      }, 0);
    });
    for (let j = 0; j < cardLists.length; j++) {
      let cardList = cardLists[j];

      cardList.addEventListener('dragover', (e) => e.preventDefault());

      cardList.addEventListener('dragenter', function (e) {
        e.preventDefault();
        this.style.backgroungColor = 'rgba(0,0,0,0.3)';
      });

      cardList.addEventListener('dragleave', function (e) {
        this.style.backgroungColor = 'rgba(0,0,0,0)';
      });

      cardList.addEventListener('drop', function (e) {
        this.style.backgroungColor = 'rgba(0,0,0,0)';
        this.append(draggedCard);
      });
    }
  }
  updateContent();
}
dragAndDrop();

// Utilities
function updateContent() {
  lists = document.querySelectorAll('.list-wrapper');
  addCardBtns = document.querySelectorAll('.add-card-btn');
  cancelBtns = document.querySelectorAll('.cancel-btn');
  textAreas = document.querySelectorAll('.list-add-card-input');
  listAddCardBtns = document.querySelectorAll('#list-add-card-btn');
  removeIcons = document.querySelectorAll('.remove-list');
  cards = document.querySelectorAll('.card');
}

// Select all text when click at the title
function changeListTitle() {
  const titles = document.querySelectorAll('.list-header');

  titles.forEach((title) => {
    title.addEventListener('click', () => {
      window.getSelection().selectAllChildren(title);
    });
  });
}
changeListTitle();
