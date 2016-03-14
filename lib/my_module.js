
function myModule() {
  var user = {
    uuid: "",
    allowed_domain: "",
    allowed_method: "",
    deliver_option: ""
  };

  this.process = function (err, form) {
    if (err) throw err;

    return "Hey bro!";
  }

};

module.exports = myModule;
