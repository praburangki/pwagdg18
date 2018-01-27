(function() {
  'use strict';

  var app = {
    isLoading: true,
    visibleCards: {},
    selectedTeams: [],
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    competitions: ['League', 'Cup', 'Champions', 'Europa', 'FIFA']
  };

  var injectedTeam = {
    key: 'barcelona',
    name: 'Barcelona, FCB',
    icon: 'barca',
    currently: {
      updatedAt: 1453489481,
      position: '1st',
      wins: 16,
      draws: 3,
      losses: 0,
      goaldiff: 43
    },
    histories: {
      data: [
        { icon: 'laliga', total: 24 },
        { icon: 'delrey', total: 29 },
        { icon: 'ucl', total: 5 },
        { icon: 'uefa', total: 0 },
        { icon: 'fifa', total: 3 },
      ]
    }
  }

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  app.updateTeamCard = function(data) {
    var card = app.visibleCards[data.key];

    if (!card) {
      card = app.cardTemplate.cloneNode(true);
      card.classList.remove('cardTemplate');
      card.querySelector('.name').textContent = data.name;
      card.removeAttribute('hidden');
      app.container.appendChild(card);
      app.visibleCards[data.key] = card;
    }

    card.querySelector('.updatedAt .value').textContent = new Date(data.currently.updatedAt * 1000);
    card.querySelector('.current .icon').classList.add(data.icon);
    card.querySelector('.current .position').textContent = data.currently.position;
    card.querySelector('.current .wins').textContent = data.currently.wins;
    card.querySelector('.current .draws').textContent = data.currently.draws;
    card.querySelector('.current .losses').textContent = data.currently.losses;
    card.querySelector('.current .goaldiff').textContent = data.currently.goaldiff;

    var histories = card.querySelectorAll('.history .competition');
    for (var i = 0; i < 5; i++) {
      var history = histories[i];
      var competition = data.histories.data[i];
      if (competition && history) {
        history.querySelector('.title').textContent = app.competitions[i];
        history.querySelector('.total').textContent = competition.total;
        history.querySelector('.icon').classList.add(competition.icon);
      }
    }
    if (app.isLoading) {
      app.spinner.setAttribute('hidden', true);
      app.isLoading = false;
    }
  }
  
  // app.updateTeamCard(injectedTeam);
})();


