var calculateScores = function(grid) {
  var scores = {};

  var teamData = {};

  teams.forEach(function(team) {
    teamData[team.name] = team;
  });

  grid.forEach(function(row) {
    row.forEach(function(cell) {
      if (cell.owner.name === 'cpu') {
        return;
      }

      if (!scores[cell.owner.name]) {
        scores[cell.owner.name] = 0;
      }

      scores[cell.owner.name] += (1 * cell.bonus);
    });
  });

  var scoreArray = Object.keys(scores).map(function(name) {
    return {
      team: teamData[name],
      score: scores[name]
    };
  });

  scoreArray.sort(function(left, right) {
    return right.score - left.score;
  });

  return scoreArray;
};

var displayScores = function(scores) {
  var $teams = document.getElementById('teams');

  while ($teams.firstChild) {
    $teams.removeChild($teams.firstChild);
  }

  scores.forEach(function(score) {
    var $teamImage = document.createElement('img');

    $teamImage.src = score.team.gravatar;
    $teamImage.style.border = 'solid 10px ' + score.team.colour;
    $teamImage.style.borderRadius = '50%';
    $teamImage.style.margin = '5px 10px';
    $teamImage.height = 40;
    $teamImage.width = 40;

    $teams.appendChild($teamImage);
  });
};

var displayFinalScores = function(scores) {
  var createElement = function(tag, className) {
    var $element = document.createElement(tag);
    $element.className = className || '';
    return $element;
  };

  var createScore = function(gravatar, name, result, colour) {
    var $score = createElement('div', 'score');

    var $avatar = createElement('img');
    $avatar.src = gravatar;
    $avatar.style.border = 'solid 10px ' + colour;
    $score.appendChild($avatar);

    var $info = createElement('div', 'info');

    var $name = createElement('div', 'name');
    $name.innerText = name;
    $info.appendChild($name);

    var $result = createElement('div', 'result');
    $result.innerText = result;
    $info.appendChild($result);

    $score.appendChild($info);
    return $score;
  };

  var $scoresContainer = document.getElementById('scores-container');
  var $scores = document.getElementById('scores');

  scores.forEach(function(score) {
    var $score = createScore(score.team.gravatar, score.team.name, score.score, score.team.colour);
    $scores.appendChild($score);
  });

  $scoresContainer.style.display = 'block';
};

var replay = function(title, snapshots, period, skip) {
  var $title = document.getElementById('title');

  var setTitle = function(time) {
    $title.innerText = 'MancJS Code & Conquer: ' + title + ' | ' + time;
  };

  var turn = skip || 0;

  var interval = setInterval(function() {
    var snapshot = snapshots[turn];
    var scores = calculateScores(snapshot.grid);

    window.buildGrid(snapshot.grid);
    setTitle(snapshot.time);
    displayScores(scores);

    turn += 1;

    if (turn >= snapshots.length) {
      clearInterval(interval);
      displayFinalScores(scores);
    }
  }, period);
};