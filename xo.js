module.exports = (client, message, new_message, player1_id, player2_id, turn_id, symbol, symbols, grid_message) => {

  var score = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
  ];
  var will_end_game = false;

  client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.id == new_message.id && turn_id == user.id && !will_end_game) {

      let emoji;
      // Convert emoji identifier to :emoji: format
      switch(reaction.emoji.identifier) {
        case '1%E2%83%A3':
          emoji = ':one:';
          if (score[0][0] == null) score[0][0] = symbol;
          break;
        case '2%E2%83%A3':
          emoji = ':two:';
          if (score[0][1] == null) score[0][1] = symbol;
          break;
        case '3%E2%83%A3':
          emoji = ':three:';
          if (score[0][2] == null) score[0][2] = symbol;
          break;
        case '4%E2%83%A3':
          emoji = ':four:';
          if (score[1][0] == null) score[1][0] = symbol;
          break;
        case '5%E2%83%A3':
          emoji = ':five:';
          if (score[1][1] == null) score[1][1] = symbol;
          break;
        case '6%E2%83%A3':
          emoji = ':six:';
          if (score[1][2] == null) score[1][2] = symbol;
          break;
        case '7%E2%83%A3':
          emoji = ':seven:';
          if (score[2][0] == null) score[2][0] = symbol;
          break;
        case '8%E2%83%A3':
          emoji = ':eight:';
          if (score[2][1] == null) score[2][1] = symbol;
          break;
        case '9%E2%83%A3':
          emoji = ':nine:';
          if (score[2][2] == null) score[2][2] = symbol;
          break;
        default:
          break;
      }

      // Replace number tile with O or X (checks if it exists first)
      if (grid_message.content.indexOf(emoji) == -1) {
        return;
      }
      grid_message.edit(grid_message.content.replace(emoji, symbol))
      .then((new_mes) => {
        grid_message = new_mes;
        console.log("Successful # tile to symbol switch");
      })
      .catch(console.error);

      // Check if the game has concluded
      if (didPlayerWin(symbols[0], player1_id) || didPlayerWin(symbols[1], player2_id) || didItTie()) {
        will_end_game = true;
        return;
      }

      // Replace player with the next and symbol with the next
      let temp_message = new_message.content.replace(`<@${turn_id}>`, `<@${toggle_player(turn_id, player1_id, player2_id)}>`);
      temp_message = temp_message.replace(symbol, toggle_symbol(symbol));
      new_message.edit(temp_message)
      .then(console.log("Successful turn switch"))
      .catch(console.error);

      // Toggle symbols between O and X and players 1 and 2
      symbol = toggle_symbol(symbol);
      turn_id = toggle_player(turn_id, player1_id, player2_id);
    }
  })


  // Function for toggling players
  function toggle_player(turn_id, player1_id, player2_id) {
    let player_switched;
    if (turn_id == player1_id) {
      player_switched = player2_id;
    }
    else {
      player_switched = player1_id;
    }
    return player_switched;
  }

  // Function for toggling symbols
  function toggle_symbol(symbol) {
    return symbols[Math.abs(symbols.findIndex((sym) => {
      return sym == symbol;
    }) - 1)];
  }

  // Function for checking if a player won
  function didPlayerWin(sym, player) {
    for (let i = 0; i < score.length; i++) {
      // Horizontal checks
      if (score[i][0] == sym &&
          score[i][1] == sym &&
          score[i][2] == sym) {
            new_message.edit(`مبروك! <@${player}> فزت!`)
            .then(console.log('Successful win'))
            .catch(console.error);
            return true;
      }
      // Vertical checks
      else if (score[0][i] == sym &&
               score[1][i] == sym &&
               score[2][i] == sym) {
               new_message.edit(`مبروك! <@${player}> فزت!`)
               .then(console.log('Successful win'))
               .catch(console.error);
               return true;
      }
    }
    // Diagonal checks
    if (score[0][0] == sym &&
        score[1][1] == sym &&
        score[2][2] == sym) {
          new_message.edit(`مبروك! <@${player}> فزت!`)
          .then(console.log('Successful win'))
          .catch(console.error);
          return true;
    }
    else if (score[0][2] == sym &&
             score[1][1] == sym &&
             score[2][0] == sym) {
               new_message.edit(`مبروك! <@${player}> فزت!`)
               .then(console.log('Successful win'))
               .catch(console.error);
               return true;
    }

    return false;
  }

  // Function for checking if it's a tie
  function didItTie() {
    let null_counter = 0;
    for (let i = 0; i < score.length; i++) {
      for (let j = 0; j < score.length; j++) {
        if (score[i][j] == null) {
          null_counter++;
        }
      }
    }
    if (null_counter == 0) {
      new_message.edit('Boo! It\'s a tie!')
      .then(console.log('Successful tie'))
      .catch(console.error);
      return true;
    }
  }
}
