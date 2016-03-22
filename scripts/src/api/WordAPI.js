var WordAPI = {
  getWord: function(section) {
    return fetch(`api/v1/complete?query=${section}`)
    .then(function(resp) {
      return resp.json();
    });
  }
};

module.exports = WordAPI;
