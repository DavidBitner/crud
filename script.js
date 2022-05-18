const overlay = document.querySelector(`.overlay`);
const modalCard = document.querySelector(`#modal-card`);
const modalNew = document.querySelector(`#modal-new`);
const modalNewBtn = document.querySelector(`#btn-add-card`);
const modalNewField = document.querySelector(`#btn-add-input`);

class Card {
  constructor(title, fields) {
    this.title = title;
    this.fields = fields;
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
}

//Listeners
//Update UI
//Add Card
//Remove Card
//Edit Card

/* CARD
<div class="card">
  <div class="card__front card__side">
    <div class="card__title">Card front title</div>
  </div>
  <div class="card__back card__side">
    <div class="card__title">Card back title</div>
    <div class="card__field">Card back field</div>
    <div class="card__field">Card back field</div>
    <div class="card__field">Card back field</div>
    <div class="card__field">Card back field</div>
  </div>
</div>
*/

document
  .querySelector(`#btn-add-card-modal`)
  .addEventListener("click", UI.showModalNew);

window.addEventListener("click", (e) => {
  const overlay = document.querySelector(`.overlay`);
  console.log(e.target.parentElement.classList);
  if (e.target == overlay) {
    UI.closeModal();
  }

  if (e.target.parentElement.classList.contains("card")) {
    UI.showModalCard();
  }
});
