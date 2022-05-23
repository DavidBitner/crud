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

  static removeCard(title) {
    const cards = Cards.getCards();
    cards.forEach((card, index) => {
      if (card.title === title) {
        cards.splice(index, 1);
      }
    });
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

  static addInput() {
    const modalNewGrid = document.querySelector(`#modal-new-grid`);
    const inputField = document.createElement("input");
    const inputText = document.createElement("input");
    inputField.setAttribute("placeholder", "Field");
    inputField.classList.add("modal__input");
    inputText.setAttribute("placeholder", "Text");
    inputText.classList.add("modal__input");
    modalNewGrid.appendChild(inputField);
    modalNewGrid.appendChild(inputText);
  }

  static setCard() {
    const modalInputs = document.querySelectorAll(`.modal__input`);
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
        fields.push(`${cardInputs[index]}:`);
      } else {
        values.push(cardInputs[index]);
      }
    }

    Cards.addCard([title, fields, values]);
    UI.updateCards();
    UI.closeModal();
    UI.resetModalNew();
  }

  static updateCards() {
    const cards = Cards.getCards();
    const cardsContainer = document.querySelector(`.cards`);

    cardsContainer.innerHTML = "";

    cards.forEach((card) => {
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

      cardTitleBack.innerText = card[0];
      cardTitleFront.innerText = card[0];
      cardEditBtn.innerText = "Edit";

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

document
  .querySelector(`#btn-add-card-modal`)
  .addEventListener("click", UI.showModalNew);

window.addEventListener("click", (e) => {
  const overlay = document.querySelector(`.overlay`);
  if (e.target == overlay) {
    UI.closeModal();
    UI.resetModalNew();
  }

  if (e.target.classList.contains("btn-edit")) {
    UI.showModalCard();
  }
});

document.querySelector(`#btn-add-input`).addEventListener("click", UI.addInput);

document.querySelector(`#btn-add-card`).addEventListener("click", UI.setCard);

document.addEventListener("DOMContentLoaded", UI.updateCards);
