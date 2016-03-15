
function myModule() {

  var user = {
    key: "",
    allowed_domain: "http://tarabayneadvocacia.com.br/",
    allowed_method: "POST",
    deliver_option: ""
  };

  this.process = function (err, form) {
    if (err) throw err;

    return "Hey bro!";
  }

};

module.exports = myModule;
