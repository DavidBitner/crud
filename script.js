class Card {
  constructor(title, fields, values) {
    this.title = title;
    this.fields = fields;
    this.values = values;
  }
}

class Cards {
  static getCards() {
    let cards;
    if (localStorage.getItem("cards") === null) {
      cards = [];
    } else {
      cards = JSON.parse(localStorage.getItem("cards"));
    }
    return cards;
  }

  static addCard(card) {
    const cards = Cards.getCards();
    cards.push(card);
    localStorage.setItem("cards", JSON.stringify(cards));
  }

  static deleteCard(index) {
    const cards = Cards.getCards();
    cards.splice(index, 1);
    localStorage.setItem("cards", JSON.stringify(cards));
  }

  static updateCard(card, index) {
    const cards = Cards.getCards();
    cards.splice(index, 1, card);
    localStorage.setItem("cards", JSON.stringify(cards));
  }

  static resetCards() {
    let cards = [
      ["Card Example", ["Field 1", "Field 2"], ["Value 1", "Value 2"]],
    ];
    localStorage.setItem("cards", JSON.stringify(cards));
  }
}

class UI {
  constructor(currentCard) {
    this.currentCard = currentCard;
  }

  static populateModalCard(cardId) {
    UI.currentCard = cardId;
    const cards = Cards.getCards();
    const card = cards[cardId];
    const cardTitle = card[0];
    const cardFields = card[1];
    const cardValues = card[2];
    const cardFieldsValues = [];

    for (let index = 0; index < cardFields.length; index++) {
      cardFieldsValues.push(cardFields[index]);
      cardFieldsValues.push(cardValues[index]);
    }

    document.querySelector(`#modal-input-title`).value = cardTitle;

    for (let i = 0; i < cardFields.length; i++) {
      UI.addInput(document.querySelector(`#modal-edit-grid`));
    }

    const modalInputs = document.querySelectorAll(
      `#modal-edit-grid > .modal__input`
    );

    cardFieldsValues.forEach((value, index) => {
      modalInputs[index + 1].value = value;
    });
  }

  static showOverlay() {
    document.querySelector(`.overlay`).style.visibility = "visible";
  }

  static showModal(modal) {
    modal.style.visibility = "visible";
    modal.style.transform = "scale(1)";
  }

  static showModalNew() {
    UI.showOverlay();
    UI.showModal(document.querySelector(`#modal-new`));
  }

  static showModalCard() {
    UI.showOverlay();
    UI.showModal(document.querySelector(`#modal-card`));
  }

  static closeModal() {
    document.querySelector(`.overlay`).style.visibility = "hidden";
    document.querySelectorAll(".modal").forEach((modal) => {
      modal.style.visibility = "hidden";
      modal.style.transform = "scale(0)";
    });
  }

  static resetModalNew() {
    const html = `
      <input
        type="text"
        class="modal__input"
        placeholder="Title"
        id="modal-input-title"
      />
      <input type="text" class="modal__input" placeholder="Field" />
      <input type="text" class="modal__input" placeholder="Text" />
      <input type="text" class="modal__input" placeholder="Field" />
      <input type="text" class="modal__input" placeholder="Text" />
    `;
    document.querySelector(`#modal-new-grid`).innerHTML = html;
  }

  static resetModalEdit() {
    const html = `
      <input
        type="text"
        class="modal__input"
        placeholder="Title"
        id="modal-input-title"
      />
    `;
    document.querySelector(`#modal-edit-grid`).innerHTML = html;
  }

  static addInput(gridElement) {
    const inputField = document.createElement("input");
    const inputText = document.createElement("input");
    inputField.setAttribute("placeholder", "Field");
    inputField.classList.add("modal__input");
    inputText.setAttribute("placeholder", "Text");
    inputText.classList.add("modal__input");
    gridElement.appendChild(inputField);
    gridElement.appendChild(inputText);
  }

  static removeInput(gridElement) {
    const inputs = gridElement.querySelectorAll(".modal__input");

    if (inputs.length == 3) {
      alert(`Card need to have at least one field and value`);
      return;
    }

    inputs[inputs.length - 2].remove();
    inputs[inputs.length - 1].remove();
  }

  static setCard(option = 1) {
    let modalInputs = document.querySelectorAll(
      `#modal-new-grid > .modal__input`
    );

    if (option == 2) {
      modalInputs = document.querySelectorAll(
        `#modal-edit-grid > .modal__input`
      );
    }

    const cardInputs = [];
    const fields = [];
    const values = [];

    modalInputs.forEach((input) => {
      cardInputs.push(input.value);
    });

    const checkInputs = cardInputs.some((input) => input == "");

    if (checkInputs) {
      alert("ERROR! Fill all inputs first");
      return;
    }

    const title = cardInputs[0];

    for (let index = 1; index < cardInputs.length; index++) {
      if (index % 2 === 1) {
        fields.push(cardInputs[index]);
      } else {
        values.push(cardInputs[index]);
      }
    }

    if (option == 2) {
      Cards.updateCard([title, fields, values], UI.currentCard);
    } else {
      Cards.addCard([title, fields, values]);
    }

    UI.updateCards();
    UI.closeModal();
    UI.resetModalNew();
    UI.resetModalEdit();
  }

  static removeCard() {
    Cards.deleteCard(UI.currentCard);
    UI.updateCards();
    UI.closeModal();
    UI.resetModalEdit();
  }

  static updateCards() {
    const cards = Cards.getCards();
    const cardsContainer = document.querySelector(`.cards`);

    cardsContainer.innerHTML = "";

    cards.forEach((card, index) => {
      const cardElement = document.createElement("div");
      const cardFront = document.createElement("div");
      const cardBack = document.createElement("div");
      const cardTitleBack = document.createElement("div");
      const cardTitleFront = document.createElement("div");
      const cardGrid = document.createElement("div");
      const cardEditBtn = document.createElement("button");

      cardElement.classList.add("card");
      cardFront.classList.add("card__front", "card__side");
      cardBack.classList.add("card__back", "card__side");
      cardTitleBack.classList.add("card__title");
      cardTitleFront.classList.add("card__title");
      cardGrid.classList.add("card__grid");
      cardEditBtn.classList.add("btn");
      cardEditBtn.classList.add("btn-edit");

      cardEditBtn.setAttribute("id", `${index}`);

      cardTitleBack.innerText = card[0];
      cardTitleFront.innerText = card[0];
      cardEditBtn.innerText = "Edit";

      console.log(card);

      const fields = card[1];
      const values = card[2];

      for (let index = 0; index < fields.length; index++) {
        const cardField = document.createElement("div");
        const cardValue = document.createElement("div");

        cardField.classList.add("card__field");
        cardValue.classList.add("card__field");

        cardField.innerText = fields[index];
        cardValue.innerText = values[index];

        cardGrid.appendChild(cardField);
        cardGrid.appendChild(cardValue);
      }

      cardBack.appendChild(cardTitleBack);
      cardBack.appendChild(cardGrid);
      cardBack.appendChild(cardEditBtn);
      cardFront.appendChild(cardTitleFront);
      cardElement.appendChild(cardFront);
      cardElement.appendChild(cardBack);
      cardsContainer.appendChild(cardElement);
    });
  }
}

document.addEventListener("DOMContentLoaded", UI.updateCards);

document
  .querySelector(`#btn-add-card-modal`)
  .addEventListener("click", UI.showModalNew);

window.addEventListener("click", (e) => {
  if (e.target == document.querySelector(`.overlay`)) {
    UI.closeModal();
    UI.resetModalNew();
    UI.resetModalEdit();
  }

  if (e.target.classList.contains("btn-edit")) {
    UI.populateModalCard(e.target.id);
    UI.showModalCard();
  }
});

document
  .querySelector(`#btn-new-add-input`)
  .addEventListener(
    "click",
    UI.addInput.bind(0, document.querySelector(`#modal-new-grid`))
  );

document
  .querySelector(`#btn-card-add-input`)
  .addEventListener(
    "click",
    UI.addInput.bind(0, document.querySelector(`#modal-edit-grid`))
  );

document
  .querySelector(`#btn-new-remove-input`)
  .addEventListener(
    "click",
    UI.removeInput.bind(0, document.querySelector(`#modal-new-grid`))
  );

document
  .querySelector(`#btn-card-remove-input`)
  .addEventListener(
    "click",
    UI.removeInput.bind(0, document.querySelector(`#modal-edit-grid`))
  );

document.querySelector(`#btn-add-card`).addEventListener("click", UI.setCard);

document
  .querySelector(`#btn-delete-card`)
  .addEventListener("click", UI.removeCard);

document
  .querySelector(`#btn-save-card`)
  .addEventListener("click", UI.setCard.bind(0, 2));
