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
    key: 'barca',
    name: 'Barcelona, FCB',
    icon: 'barca',
    currently: {
      updatedAt: 1517059723,
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
        { icon: 'fifa', total: 3 }
      ]
    }
  };

  var apiBase =
    'https://raw.githubusercontent.com/praburangki/pwagdg18/master/data/';

  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  /* Event listener for refresh button */
  document.getElementById('btnRefresh').addEventListener('click', function() {
    app.updateTeams();
  });

  /* Event listener for add new team button */
  document.getElementById('btnAdd').addEventListener('click', function() {
    // Open/show the add new team dialog
    app.toggleAddDialog(true);
  });

  /* Event listener for add team button in add team dialog */
  document.getElementById('btnAddTeam').addEventListener('click', function() {
    var select = document.getElementById('selectTeamToAdd');
    var selected = select.options[select.selectedIndex];
    var key = selected.value;
    var name = selected.textContent;
    app.getTeam(key, name);
    app.selectedTeams.push({ key: key, name: name });
    app.saveSelectedTeams();
    app.toggleAddDialog(false);
  });

  /* Event listener for cancel button in add team dialog */
  document.getElementById('btnAddCancel').addEventListener('click', function() {
    app.toggleAddDialog(false);
  });

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new team dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

  /*****************************************************************************
   *
   * Methods for dealing with the model
   *
   ****************************************************************************/

  // Gets a team for a specific name and update the card with the data
  app.getTeam = function(key, name) {
    var url = apiBase + key + '.json';
    // Update Me
    if ('caches' in window) { // check if caches exists in browser
      caches.match(url).then(function(response) { // request data from cache
        if (response) { // update team with response
          response.json().then(function(json) {
            json.key = key;
            json.name = name;
            app.updateTeamCard(json);
          });
        }
      });
    }
    // Make the XHR to get the data, then update the card
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if (request.readyState === XMLHttpRequest.DONE) {
        if (request.status === 200) {
          var response = JSON.parse(request.response);
          response.key = key;
          response.name = name;
          app.updateTeamCard(response);
        }
      }
    };
    request.open('GET', url);
    request.send();
  };

  // Iterate all of the cards and attempt to get the latest team data
  app.updateTeams = function() {
    var keys = Object.keys(app.visibleCards);
    keys.forEach(function(key) {
      app.getTeam(key);
    });
  };

  app.saveSelectedTeams = function() {
    window.localforage.setItem('selectedTeams', app.selectedTeams);
  }

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

    // Update me
    // Verify data is newer than what we already have, if not, skip.
    var dateElem = card.querySelector('.updatedAt .value');
    if (dateElem.getAttribute('data-dt') >= data.currently.updatedAt) {
      return;
    }

    dateElem.setAttribute('data-dt', data.currently.updatedAt);
    dateElem.textContent = new Date(
      data.currently.updatedAt * 1000
    );
    card.querySelector('.current .icon').classList.add(data.icon);
    card.querySelector('.current .position').textContent =
      data.currently.position;
    card.querySelector('.current .wins').textContent = data.currently.wins;
    card.querySelector('.current .draws').textContent = data.currently.draws;
    card.querySelector('.current .losses').textContent = data.currently.losses;
    card.querySelector('.current .goaldiff').textContent =
      data.currently.goaldiff;

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
  };
  
  document.addEventListener('DOMContentLoaded', function() {
    window.localforage.getItem('selectedTeams', function(err, teamList) {
      if (teamList) {
        app.selectedTeams = teamList;
        app.selectedTeams.forEach(function(team) {
          app.getTeam(team.key, team.name);
        });
      } else {
        app.updateTeamCard(injectedTeam);
        app.selectedTeams = [
          { key: injectedTeam.key, name: injectedTeam.name }
        ];
        app.saveSelectedTeams();
      }
    });
  });

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js')
      .then(function() {
        console.log('Service Worker Registered');
      });
  }

})();
