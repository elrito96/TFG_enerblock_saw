const $ = require('jquery')

const {
  getState,
  submitUpdate
} = require('./state')

const uuidv4 = require('uuid/v4');

// Application Object
const app = { user: null, keys: [], assets: [], transfers: [] }

app.update = function (operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, sellerprivatekey) {
	  console.log("main.js/update");
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey },
      sellerprivatekey,
      success => success ? console.log("Transaction submited") : null
    )
}

// $.getJSON("localhost:8000/api/state?address=5a45ce00f3ecb37267b0a881da01275e1afce861eca6055216afb126d7e3b361b5ba43", function(json){
// 	console.log(json.head);
// 	$(".mypanel").html(json.head);
// });


$.getScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js", function(){
  var update;
  (update = function() {
      document.getElementById("datehour")
      .innerHTML = moment().format('h:mm:ss a');
      document.getElementById("dateday")
      .innerHTML = moment().format('MMMM Do YYYY');
      $("#writedate").val( moment().format('MMMM Do YYYY, h:mm:ss a'));

  })();
  setInterval(update, 1000);
});

$(document).ready(function(){
	$("#hide").click(function(){
		$("#keys").hide();
	});
	$("#show").click(function(){
		$("#keys").show();
	});
  $("#genSaleId").click(function(){
		$("#saleID").val(uuidv4());
	});
  $("#closeButton").click(function(){
		$("#resultContainer").css("visibility", "hidden");
	});
  // This allows to close the result container by clicking anywhere in the message, might delete later
  $("#resultContainer").click(function(){
		$("#resultContainer").css("visibility", "hidden");
	});

});



// Create Asset
$('#createSubmit').on('click', function () {
  console.log("main.js/createSubmit");
  const kwhAmountSell = $('#amount').val()
  const pricePerKwh = $('#price').val()
  const createWritedate = $('#writedate').val()
  const validWritedate = $('#validwritedate').val()
  const saleName = $('#saleID').val()
  const sellerPubKey = $('#sellerpubkey').val()
  const sellerprivatekey = $('#sellerprivatekey').val()
  console.log("SALE NAME ID ==================== "+saleName)
  console.log("abundle main");
  if (amount && price && writedate && validwritedate && sellerpubkey && sellerprivatekey)
    app.update('putOnSale', kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, sellerprivatekey)
})
