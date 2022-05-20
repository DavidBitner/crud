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
        fields.push(cardInputs[index]);
      } else {
        values.push(cardInputs[index]);
      }
    }

    Cards.addCard([title, fields, values]);
  }
}

console.log(Cards.getCards())

document
  .querySelector(`#btn-add-card-modal`)
  .addEventListener("click", UI.showModalNew);

window.addEventListener("click", (e) => {
  const overlay = document.querySelector(`.overlay`);
  if (e.target == overlay) {
    UI.closeModal();
    UI.resetModalNew();
  }

  if (e.target.parentElement.classList.contains("card")) {
    UI.showModalCard();
  }
});

document.querySelector(`#btn-add-input`).addEventListener("click", UI.addInput);

document.querySelector(`#btn-add-card`).addEventListener("click", UI.setCard);
