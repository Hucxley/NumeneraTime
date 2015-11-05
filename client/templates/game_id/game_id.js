Template.gameId.helpers({
  gameId: function() {
    var gameId;
    if (Session.get('gameId')) {
      gameId = Session.get('gameId');
    } else {
      gameId = uuid.tiny();
      Session.set('gameId', gameId);
    }
    console.log(gameId);
    var currentUserId = Meteor.userId();

    // TODO: fix this next session to return a game matching the player
    // and then change the return value to th esearchResult.

    var searchResult = GamesList.findOne({
      createdBy: currentUserId,
      gameId: gameId
    }, {
      fields: {
        gameId: 1
      }
    });
    //console.log(searchResult);
    return gameId;
  }
});
