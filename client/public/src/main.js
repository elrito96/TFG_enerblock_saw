const $ = require('jquery')

const {
  getState,
  submitUpdate
} = require('./state')

const uuidv4 = require('uuid/v4');

// Application Object
const app = { user: null, keys: [], salePetitions: [], buys: [] , buyPetitions: [], sales: []}

app.refresh = function (){
  getState(
    ({ salePetitions, buys}) => {
      this.salePetitions = salePetitions;
      this.buys = buys;
      console.log(this.salePetitions)
    }
  )
}

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

/* Jquery  that will deal with */
$(document).ready(function(){
  // Public and private keys table
	$("#hide").click(function(){
		$("#keys").hide();
	});
	$("#show").click(function(){
		$("#keys").show();
	});

  //Sale id generator
  $("#genSaleId").click(function(){
		$("#saleID").val(uuidv4());
	});

  // X icon to close the result container
  $("#closeButton").click(function(){
		$("#resultContainer").css("visibility", "hidden");
	});
  // Close the result container by clicking anywhere in the message, might delete later
  $("#resultContainer").click(function(){
		$("#resultContainer").css("visibility", "hidden");
	});

  // Actions to show and hide elements when View Sales is clicked in the side bar
  $("#ViewSalesSide").click(function(){
		$("#CreateSalePage").css("display", "none");
    $("#CreateBuyPage").css("display", "none");
    $("#ViewSalesPage").css("display", "block");

    $("#ViewSalesA").addClass("active");
    $("#CreateSaleA").removeClass("active");
    $("#CreateBuyA").removeClass("active");

    app.refresh();
	});

  // Actions to show and hide elements when Create Sale is clicked in the side bar
  $("#CreateSaleSide").click(function(){
		$("#ViewSalesPage").css("display", "none");
    $("#CreateBuyPage").css("display", "none");
    $("#CreateSalePage").css("display", "block");

    $("#CreateSaleA").addClass("active");
    $("#ViewSalesA").removeClass("active");
    $("#CreateBuyA").removeClass("active");
	});

  // Actions to show and hide elements when Create Buy is clicked in the side bar
  $("#CreateBuySide").click(function(){
		$("#ViewSalesPage").css("display", "none");
    $("#CreateSalePage").css("display", "none");
    $("#CreateBuyPage").css("display", "block");

    $("#CreateBuyA").addClass("active");
    $("#ViewSalesA").removeClass("active");
    $("#CreateSaleA").removeClass("active");
	});

});

// Load Sales


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
