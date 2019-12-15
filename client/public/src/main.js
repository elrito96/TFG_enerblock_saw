// const $ = require('jquery');
// const bootstrap = require('bootstrap');

const $ = require("jquery");
require('bootstrap');
// require('materialize-css');



const {
  getState,
  submitUpdate
} = require('./state')

const uuidv4 = require('uuid/v4');

// Application Object
const app = { user: null, keys: [], salePetitions: [], buysFromSales: [] , buyPetitions: [], satisfiedBuyPetitions: []}

function shorten_text(text, maxLength) {
    var ret = text;
    if (ret.length > maxLength) {
        ret = ret.substr(0,maxLength-3) + "...";
    }
    return(ret);
}
// Load Sales
app.refreshSales = function (){
  console.log(" -- App.refreshSales function) --")
  getState(
    ({ salePetitions }) => {
      this.salePetitions = salePetitions;

      /* Clear table contents */
      console.log(" - Vaciar tabla de ventas y construir nueva tabla -")
      $('#salesData').empty();
      /* Construction of sales table*/
      for(i = 0; i<salePetitions.length; i++){
        var row = $('<tr data-toggle="modal" data-id="'+i+'" data-target="#buyModal">'+
                        '<td>'+salePetitions[i].kwhAmountSell+'</td>'+
                        '<td>'+salePetitions[i].pricePerKwh+'</td>'+
                        '<td>'+salePetitions[i].createWritedate+'</td>'+
                        '<td>'+salePetitions[i].validWritedate+'</td>'+
                        '<td>'+salePetitions[i].saleName+'</td>'+
                        '<td>'+shorten_text(salePetitions[i].sellerPubKey,20)+'</td>'+
                        '<td><button class="editDeleteSale btn border border-secondary" type="button">Edit / Delete</button></td>'+
                    '</tr>');
        row.appendTo('#salesData')
      }
      $('.editDeleteSale').on('click',function(e){
        e.stopPropagation();
        console.log(" Click al boton edit delete1");
        $('#editDeleteModalSale').modal('show');
      })
      console.log(this.salePetitions)
    }
  )
}
// Load buy petitions
app.refreshBuyPetitions = function (){
  console.log(" -- App.refreshBuypetitions function) --")
  getState(
    ({buyPetitions}) => {
      this.buyPetitions = buyPetitions;
      /* Clear table contents */
      console.log(" - Vaciar tabla de peticiones de compra y construir nueva tabla -")
      $('#buyPetitionsData').empty();
      /* Construction of sales table*/
      for(i = 0; i<buyPetitions.length; i++){
        var row = $('<tr data-toggle="modal" data-id="'+i+'" data-target="#buyModalSatisfyPetition">'+
                        '<td>'+buyPetitions[i].kwhAmountSell+'</td>'+
                        '<td>'+buyPetitions[i].pricePerKwh+'</td>'+
                        '<td>'+buyPetitions[i].createWritedate+'</td>'+
                        '<td>'+buyPetitions[i].validWritedate+'</td>'+
                        '<td>'+buyPetitions[i].saleName+'</td>'+
                        '<td>'+shorten_text(buyPetitions[i].sellerPubKey,20)+'</td>'+
                        '<td><button class="editDeleteBuy btn border border-secondary" type="button">Edit / Delete</button></td>'+
                    '</tr>');
        row.appendTo('#buyPetitionsData')
      }
      $('.editDeleteBuy').on('click',function(e){
        e.stopPropagation();
        console.log(" Click al boton edit delete1");
        $('#editDeleteModalBuy').modal('show');
      })
      console.log(this.buyPetitions)
    }
  )
}
// Load buys from sales
app.refreshBuysFromSales = function (){
  console.log(" -- App.refreshBuy from sales function) --")
  getState(
    ({buysFromSales}) => {
      this.buysFromSales = buysFromSales;
      /* Clear table contents */
      console.log(" - Vaciar tabla de peticiones de compra y construir nueva tabla -")
      $('#buysFromSalesData').empty();
      /* Construction of sales table*/
      for(i = 0; i<buysFromSales.length; i++){
        var totalPrice = buysFromSales[i].kwhAmountBuy * buysFromSales[i].pricePerKwh;
        var row = $('<tr data-id="'+i+'" >'+
                        '<td>'+shorten_text(buysFromSales[i].sellerPubKey,20)+'</td>'+
                        '<td>'+shorten_text(buysFromSales[i].buyerPubKey,20)+'</td>'+
                        '<td>'+buysFromSales[i].kwhAmountBuy+'</td>'+
                        '<td>'+buysFromSales[i].pricePerKwh+'</td>'+
                        '<td>'+totalPrice+'</td>'+
                        '<td>'+buysFromSales[i].buyWritedate+'</td>'+
                    '</tr>');
        row.appendTo('#buysFromSalesData')
      }

      console.log(this.buysFromSales)
    }
  )
}
// Load satyisfied buy petitions
app.refreshSatisfiedBuyPetitions = function (){
  console.log(" -- App.refreshBuy from sales function) --")
  getState(
    ({satisfiedBuyPetitions}) => {
      this.satisfiedBuyPetitions = satisfiedBuyPetitions;
      /* Clear table contents */
      console.log(" - Vaciar tabla de peticiones de compra y construir nueva tabla -")
      $('#satisfiedBuysData').empty();
      /* Construction of sales table*/
      for(i = 0; i<satisfiedBuyPetitions.length; i++){
        var totalPrice = satisfiedBuyPetitions[i].kwhAmountBuy * satisfiedBuyPetitions[i].pricePerKwh;
        var row = $('<tr data-toggle="modal" data-id="'+i+'" >'+
                        '<td>'+shorten_text(satisfiedBuyPetitions[i].sellerPubKey,20)+'</td>'+
                        '<td>'+shorten_text(satisfiedBuyPetitions[i].buyerPubKey,20)+'</td>'+
                        '<td>'+satisfiedBuyPetitions[i].kwhAmountBuy+'</td>'+
                        '<td>'+satisfiedBuyPetitions[i].pricePerKwh+'</td>'+
                        '<td>'+totalPrice+'</td>'+
                        '<td>'+satisfiedBuyPetitions[i].buyWritedate+'</td>'+
                    '</tr>');
        row.appendTo('#satisfiedBuysData')
      }

      console.log(this.satisfiedBuyPetitions)
    }
  )
}


app.updateSalesTable = function(){
  console.log(" -- Ocultar Create, mostrar Sales --")
  //window.history.pushState('', '', '/ViewSales');
  $("#CreateSalePage").css("display", "none");
  $("#CreateBuyPage").css("display", "none");
  $("#ViewSalesPage").css("display", "block");
  $("#ViewBuyPetitionsPage").css("display", "none");
  $("#BuysFromSalesPage").css("display", "none");
  $("#SatisfiedBuysPage").css("display", "none");


  $("#ViewSalesA").addClass("active");
  $("#CreateSaleA").removeClass("active");
  $("#CreateBuyA").removeClass("active");
  $("#ViewBuyPetitionsA").removeClass("active");
  $("#BuysFromSalesA").removeClass("active");
  $("#SatisfiedBuysA").removeClass("active");
  app.refreshSales();
}
app.updateBuyPetitionsTable = function(){
  console.log(" -- Ocultar Create, mostrar Buy petitions --")
  //window.history.pushState('', '', '/ViewSales');
  $("#ViewSalesPage").css("display", "none");
  $("#CreateSalePage").css("display", "none");
  $("#CreateBuyPage").css("display", "none");
  $("#ViewBuyPetitionsPage").css("display", "block");
  $("#BuysFromSalesPage").css("display", "none");
  $("#SatisfiedBuysPage").css("display", "none");

  $("#CreateBuyA").removeClass("active");
  $("#ViewSalesA").removeClass("active");
  $("#CreateSaleA").removeClass("active");
  $("#ViewBuyPetitionsA").addClass("active");
  $("#BuysFromSalesA").removeClass("active");
  $("#SatisfiedBuysA").removeClass("active");

  app.refreshBuyPetitions();
}

app.updateBuysFromSalesTable = function(){
  $("#ViewSalesPage").css("display", "none");
  $("#CreateSalePage").css("display", "none");
  $("#CreateBuyPage").css("display", "none");
  $("#ViewBuyPetitionsPage").css("display", "none");
  $("#BuysFromSalesPage").css("display", "block");
  $("#SatisfiedBuysPage").css("display", "none");

  $("#CreateBuyA").removeClass("active");
  $("#ViewSalesA").removeClass("active");
  $("#CreateSaleA").removeClass("active");
  $("#ViewBuyPetitionsA").removeClass("active");
  $("#BuysFromSalesA").addClass("active");
  $("#SatisfiedBuysA").removeClass("active");
  app.refreshBuysFromSales();
}

app.updateSatisfiedBuyPetitionsTable = function(){
  $("#ViewSalesPage").css("display", "none");
  $("#CreateSalePage").css("display", "none");
  $("#CreateBuyPage").css("display", "none");
  $("#ViewBuyPetitionsPage").css("display", "none");
  $("#BuysFromSalesPage").css("display", "none");
  $("#SatisfiedBuysPage").css("display", "block");

  $("#CreateBuyA").removeClass("active");
  $("#ViewSalesA").removeClass("active");
  $("#CreateSaleA").removeClass("active");
  $("#ViewBuyPetitionsA").removeClass("active");
  $("#BuysFromSalesA").removeClass("active");
  $("#SatisfiedBuysA").addClass("active");
  app.refreshSatisfiedBuyPetitions();
}

app.updateCreateSale = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerprivatekey) {
    const operation = 'putOnSale'
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName },
      sellerprivatekey,
      success => success ? console.log("Transaction submited") : null,
      null
    )
}

app.updateCreateBuyPetition = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerprivatekey) {
    const operation = 'createBuyPetition'
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName },
      sellerprivatekey,
      success => success ? console.log("Transaction submited") : null,
      null
    )
}

app.updateBuyFromSale = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, kwhAmountBuy, buyWritedate, buyName, buyerPrivKey) {
    const operation = 'buy'
    console.log("app.updateBuyFromSale -------------")
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, kwhAmountBuy, buyWritedate, buyName },
      buyerPrivKey,
      success => success ? console.log("Transaction submited") : null
    )
}
app.updateSatisfyBuyPetition = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, kwhAmountBuy, buyWritedate, buyName, buyerPrivKey) {
    const operation = 'satisfyBuyPetition'
    console.log("app.updateSatisfyBuyPetition -------------")
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, kwhAmountBuy, buyWritedate, buyName },
      buyerPrivKey,
      success => success ? console.log("Transaction submited") : null
    )
}
// function(){
//                   console.log(" Buy succesful transaction submited ");
//                   app.updateSalesTable();
//                   console.log(" Buy succesful after update table ");
//                 }
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
      $("#writedate").val( moment().format('YYYY-MM-DD kk:mm:ss'));
      $("#writedateBuyPetition").val( moment().format('YYYY-MM-DD kk:mm:ss'));
      $("#writedateBuyModal").val( moment().format('YYYY-MM-DD kk:mm:ss'));
      $("#writedateBuyModalSatisfyPetition").val( moment().format('YYYY-MM-DD kk:mm:ss'));
  })();
  setInterval(update, 1000);
});

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}


/* Jquery  that will deal with initialization of web page */
$(document).ready(function(){
  // Load sales when page loads
  app.refreshSales();

  // Update total cost when changing amount
  $('#amountBuyModal').on('keyup change',function(){
    var amount = $('#amountBuyModal').val();
    var price = $('#priceSelectedSaleBuy').text();
    $('#totalCostBuyModal').val(amount * price)
  })
  // Update total cost when changing amount
  $('#amountBuyModalSatisfyPetition').on('keyup change',function(){
    var amount = $('#amountBuyModalSatisfyPetition').val();
    var price = $('#priceSelectedSaleBuySatisfyPetition').text();
    $('#totalCostBuyModalSatisfyPetition').val(amount * price)
  })

  // Minutes
  for(var i = 11; i>=0; i--){
    $('#validwritedateMin').append(`<option value="`+pad(i*5)+`">
                                       `+pad(i*5)+`
                                  </option>`);
    $('#validwritedateMinBuyPetition').append(`<option value="`+pad(i*5)+`">
                                       `+pad(i*5)+`
                                  </option>`)
  }
  // Hours
  for(var i = 23; i>=0; i--){
    $('#validwritedateHour').append(`<option value="`+pad(i)+`">
                                       `+pad(i)+`
                                  </option>`)
    $('#validwritedateHourBuyPetition').append(`<option value="`+pad(i)+`">
                                       `+pad(i)+`
                                  </option>`)
  }




  //Load today date on create sale and buy petition date picker
  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  $('#validWritedateDate').val(today);
  $('#validWritedateDateBuyPetition').val(today);


  //Load valid date in field from date, hour, min and seconds
  updateValidWritedate();
  updateValidWritedateBuyPetition();


  // Update valid date field when changing date, hour, min or seconds
  $('#validWritedateDate, #validwritedateHour,#validwritedateMin').on('change',updateValidWritedate);
  $('#validWritedateDateBuyPetition, #validwritedateHourBuyPetition,#validwritedateMinBuyPetition').on('change',updateValidWritedateBuyPetition);

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

  // Buy id generator
  $("#genBuyId").click(function(){
		$("#buyIDBuyModal").val(uuidv4());
	});

  $("#genIdSatisfyPetition").click(function(){
    $("#buyIDBuyModalSatisfyPetition").val(uuidv4());
  });


  $("#genIdBuyPetition").click(function(){
    $("#buyPetitionID").val(uuidv4());
  });


  // X icon to close the result container
  $("#closeButton").click(function(){
		$("#resultContainer").css("visibility", "hidden");
	});
  // Close the result container by clicking anywhere in the message, might delete later
  $("#resultContainer").click(function(){
		$("#resultContainer").css("visibility", "hidden");
	});
  // X icon to close the result container
  $("#closeButtonBuyPetition").click(function(){
		$("#resultContainerBuyPetition").css("visibility", "hidden");
	});
  // Close the result container by clicking anywhere in the message, might delete later
  $("#resultContainerBuyPetition").click(function(){
		$("#resultContainerBuyPetition").css("visibility", "hidden");
	});

  $("#closeButtonBuy").click(function(){
    $("#resultBuyContainer").css("visibility", "hidden");
  });
  // Hide result container after closing modal, for it to not appear next modal open
  $("#buyModalCloseBtn").click(function(){
    $("#resultBuyContainer").css("visibility", "hidden");
  });
  // Close the result container by clicking anywhere in the message, might delete later
  $("#resultBuyContainer").click(function(){
    $("#resultBuyContainer").css("visibility", "hidden");
  });
  $("#closeButtonBuySatisfyPetition").click(function(){
    $("#resultBuyContainerSatisfyPetition").css("visibility", "hidden");
  });
  // Close the result container by clicking anywhere in the message, might delete later
  $("#resultBuyContainerSatisfyPetition").click(function(){
    $("#resultBuyContainerSatisfyPetition").css("visibility", "hidden");
  });







  // Actions to show and hide elements when View Sales is clicked in the side bar
  $("#ViewSalesSide").click(function(){
    app.updateSalesTable();
	});
  // Actions to show and hide elements when Create Sale is clicked in the side bar
  $("#CreateSaleSide").click(function(){
    //window.history.pushState('', '', '/CreateSale');

		$("#ViewSalesPage").css("display", "none");
    $("#CreateBuyPage").css("display", "none");
    $("#CreateSalePage").css("display", "block");
    $("#ViewBuyPetitionsPage").css("display", "none");
    $("#BuysFromSalesPage").css("display", "none");
    $("#SatisfiedBuysPage").css("display", "none");

    $("#CreateSaleA").addClass("active");
    $("#ViewSalesA").removeClass("active");
    $("#ViewBuyPetitionsA").removeClass("active");
    $("#CreateBuyA").removeClass("active");
    $("#BuysFromSalesA").removeClass("active");
    $("#SatisfiedBuysA").removeClass("active");
	});

  // Actions to show and hide elements when view buy petitions is clicked in the side bar
  $("#ViewBuyPetitionsSide").click(function(){
    app.updateBuyPetitionsTable();
  });
  // Actions to show and hide elements when Create Buy is clicked in the side bar
  $("#CreateBuySide").click(function(){
    //window.history.pushState('', '', '/CreateBuy');
		$("#ViewSalesPage").css("display", "none");
    $("#CreateSalePage").css("display", "none");
    $("#CreateBuyPage").css("display", "block");
    $("#ViewBuyPetitionsPage").css("display", "none");
    $("#BuysFromSalesPage").css("display", "none");
    $("#SatisfiedBuysPage").css("display", "none");

    $("#CreateBuyA").addClass("active");
    $("#ViewSalesA").removeClass("active");
    $("#CreateSaleA").removeClass("active");
    $("#ViewBuyPetitionsA").removeClass("active");
    $("#BuysFromSalesA").removeClass("active");
    $("#SatisfiedBuysA").removeClass("active");
  });
  // Actions to show and hide elements when history1 is clicked in the side bar

  $("#BuysFromSalesSide").click(function(){
    //window.history.pushState('', '', '/CreateBuy');
    app.updateBuysFromSalesTable();
  });
  // Actions to show and hide elements when history2 is clicked in the side bar

  $("#SatisfiedBuysSide").click(function(){
    //window.history.pushState('', '', '/CreateBuy');
    app.updateSatisfiedBuyPetitionsTable();
	});

});

// Function to update the valid writedate field to send in payload
function updateValidWritedate(){
  var dayPicked = document.getElementById("validWritedateDate")
  var hourPicked = document.getElementById("validwritedateHour")
  var minPicked = document.getElementById("validwritedateMin")
  var validWr = dayPicked.value.substring(0,4)+"-"+dayPicked.value.substring(5,7)+"-"+dayPicked.value.substring(8,10)+" "+hourPicked.value+":"+minPicked.value+":00";
  $('#validwritedate').val(validWr);
}

function updateValidWritedateBuyPetition(){
  var dayPicked = document.getElementById("validWritedateDateBuyPetition")
  var hourPicked = document.getElementById("validwritedateHourBuyPetition")
  var minPicked = document.getElementById("validwritedateMinBuyPetition")
  var validWr = dayPicked.value.substring(0,4)+"-"+dayPicked.value.substring(5,7)+"-"+dayPicked.value.substring(8,10)+" "+hourPicked.value+":"+minPicked.value+":00";
  $('#validwritedateBuyPetition').val(validWr);
}

// Create Put on sale
$('#createSubmit').on('click', function () {
  console.log(" Creating sale petition ");
  const kwhAmountSell = $('#amount').val()
  const pricePerKwh = $('#price').val()
  const createWritedate = $('#writedate').val()
  const validWritedate = $('#validwritedate').val()
  const saleName = $('#saleID').val()
  const sellerprivatekey = $("#sellerprivatekey").val();
  console.log("SALE NAME ID ==================== "+saleName)
  console.log("sellerprivatekey below ¨¨¨¨¨");
  console.log(sellerprivatekey)
  app.updateCreateSale(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerprivatekey)
})

$('#createSubmitBuyPetition').on('click', function () {
  console.log(" Creating buy petition petition ");
  const kwhAmountSell = $('#amountBuyPetition').val()
  const pricePerKwh = $('#priceBuyPetition').val()
  const createWritedate = $('#writedateBuyPetition').val()
  const validWritedate = $('#validwritedateBuyPetition').val()
  const saleName = $('#buyPetitionID').val()
  const sellerprivatekey = $("#sellerprivatekeyBuyPetition").val();
  console.log("SALE NAME ID ==================== "+saleName)
  console.log("sellerprivatekey below ¨¨¨¨¨");
  console.log(sellerprivatekey)
  app.updateCreateBuyPetition(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerprivatekey)
})


// Create buy sale
$('#createBuySubmit').on('click', function () {
  console.log("Buying from sale");
  // Info about sale
  const kwhAmountSell = $('#amountSelectedSaleBuy').text();
  const pricePerKwh = $('#priceSelectedSaleBuy').text();
  const createWritedate = $('#createWdSelectedSaleBuy').text();
  const validWritedate = $('#validWdSelectedSaleBuy').text();
  const saleName = $('#idSelectedSaleBuy').text();
  const sellerPubKey = $('#sellerSelectedSaleBuy').text();

  // Info about buy
  const kwhAmountBuy = $('#amountBuyModal').val()
  const buyWritedate = $('#writedateBuyModal').val()
  const buyName = $('#buyIDBuyModal').val()
  const buyerPrivKey = $('#buyerPrivateKeyBuyModal').val()
  app.updateBuyFromSale(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, kwhAmountBuy, buyWritedate, buyName, buyerPrivKey)
})

// Create satisfy buy petition
$('#createBuySubmitSatisfyPetition').on('click', function () {
  console.log("Staisfying buy petition");
  // Info about sale
  const kwhAmountSell = $('#amountSelectedSaleBuySatisfyPetition').text();
  const pricePerKwh = $('#priceSelectedSaleBuySatisfyPetition').text();
  const createWritedate = $('#priceSelectedSaleBuySatisfyPetition').text();
  const validWritedate = $('#validWdSelectedSaleBuySatisfyPetition').text();
  const saleName = $('#idSelectedSaleBuySatisfyPetition').text();
  const sellerPubKey = $('#sellerSelectedSaleBuySatisfyPetition').text();

  // Info about buy
  const kwhAmountBuy = $('#amountBuyModalSatisfyPetition').val()
  const buyWritedate = $('#writedateBuyModalSatisfyPetition').val()
  const buyName = $('#buyIDBuyModalSatisfyPetition').val()
  const buyerPrivKey = $('#buyerPrivateKeyBuyModalSatisfyPetition').val()
  app.updateSatisfyBuyPetition(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, kwhAmountBuy, buyWritedate, buyName, buyerPrivKey)
})


// Buy selected sale of Energy
$('#buyModal').modal({
  keyboarnd: true,
  backdrop: "static",
  show:false,
}).on('show.bs.modal', function(){
  var closestRow = $(event.target).closest('tr')
  var getIdFromRow = closestRow.data('id');
  $('#buyIDBuyModal').val("");
  console.log("G e t id from R o w")
  console.log(getIdFromRow)
  var amountToLoadModal = closestRow.find('td:eq(0)').text();
  console.log(amountToLoadModal)
  // Ajax calls to populate modal
  $('#resultBuyContainer').css("visibility", "hidden")
  $(this).find('#saleDetails').html(
    $('<b> Amount to sell (KwH): </b> <label id="amountSelectedSaleBuy">' + amountToLoadModal + '</label><br>'+
      '<b>Price per KhW : </b> <label id="priceSelectedSaleBuy">' + app.salePetitions[getIdFromRow].pricePerKwh + '</label><br>'+
      '<b>Creation Date : </b> <label id="createWdSelectedSaleBuy">' + app.salePetitions[getIdFromRow].createWritedate + '</label><br>'+
      '<b>Validity Date : </b> <label id="validWdSelectedSaleBuy">' + app.salePetitions[getIdFromRow].validWritedate + '</label><br>'+
      '<b style="display:none">Seller Public Key : </b> <label id="sellerSelectedSaleBuy" style="display:none">' + app.salePetitions[getIdFromRow].sellerPubKey + '</label><br>'+
      '<label id="idSelectedSaleBuy" style="display:none">' + app.salePetitions[getIdFromRow].saleName + '</label>'
    )
  )
  $('#amountBuyModal').val("");
  $('#totalCostBuyModal').val(0);

});

// Buy selected sale of Energy
$('#editDeleteModalSale').modal({
  keyboarnd: true,
  backdrop: "static",
  show:false,
}).on('show.bs.modal', function(){
  var closestRow = $(event.target).closest('tr')
  var getIdFromRow = closestRow.data('id');
  console.log("G e t id from R o w")
  console.log(getIdFromRow)
  var amountToLoadModal = closestRow.find('td:eq(0)').text();
  console.log(amountToLoadModal)
  // Ajax calls to populate modal
  $('#resultBuyContainer').css("visibility", "hidden")
  $(this).find('#editDeleteModalSaleDetails').html(
    $('<b> Amount to sell (KwH): </b> <input id="amountSelectedSaleBuy" class="form-control" type="number" ></input><br>'+
      '<b>Price per KhW :</b> <input id="priceSelectedSaleBuy" class="form-control" type="number"></input><br>'+
      '<b>Creation Date : </b> <label id="createWdSelectedSaleBuy">' + app.salePetitions[getIdFromRow].createWritedate + '</label><br>'+
      '<b>Validity Date : </b> <label id="validWdSelectedSaleBuy">' + app.salePetitions[getIdFromRow].validWritedate + '</label><br>'+
      '<b>Seller Public Key : </b> <label id="sellerSelectedSaleBuy" style=>' + app.salePetitions[getIdFromRow].sellerPubKey + '</label><br>'+
      '<b>Sale ID : </b><label id="idSelectedSaleBuy" >' + app.salePetitions[getIdFromRow].saleName + '</label>'
    )
  )
  $('#amountSelectedSaleBuy').val(amountToLoadModal);
  $('#priceSelectedSaleBuy').val(app.salePetitions[getIdFromRow].pricePerKwh);


});

// Buy selected sale of Energy
$('#buyModalSatisfyPetition').modal({
  keyboarnd: true,
  backdrop: "static",
  show:false,
}).on('show.bs.modal', function(){
  var closestRow = $(event.target).closest('tr')
  var getIdFromRow = closestRow.data('id');
  $('#buyIDBuyModalSatisfyPetition').val("");
  console.log("G e t id from R o w")
  console.log(getIdFromRow)
  var amountToLoadModal = closestRow.find('td:eq(0)').text();
  console.log(amountToLoadModal)
  // Ajax calls to populate modal
  $('#resultBuyContainerSatisfyPetition').css("visibility", "hidden")
  $(this).find('#BuyPetitionDetails').html(
    $('<b> Amount requested (KwH): </b> <label id="amountSelectedSaleBuySatisfyPetition">' + amountToLoadModal + '</label><br>'+
      '<b>Price per KhW : </b> <label id="priceSelectedSaleBuySatisfyPetition">' + app.buyPetitions[getIdFromRow].pricePerKwh + '</label><br>'+
      '<b>Creation Date : </b> <label id="createWdSelectedSaleBuySatisfyPetition">' + app.buyPetitions[getIdFromRow].createWritedate + '</label><br>'+
      '<b>Validity Date : </b> <label id="validWdSelectedSaleBuySatisfyPetition">' + app.buyPetitions[getIdFromRow].validWritedate + '</label><br>'+
      '<b style="display:none">Buy petition creator Public Key : </b> <label id="sellerSelectedSaleBuySatisfyPetition" style="display:none">' + app.buyPetitions[getIdFromRow].sellerPubKey + '</label><br>'+
      '<label id="idSelectedSaleBuySatisfyPetition" style="display:none">' + app.buyPetitions[getIdFromRow].saleName + '</label>'
    )
  )
  $('#amountBuyModalSatisfyPetition').val("");
  $('#totalCostBuyModalSatisfyPetition').val(0);

});
module.exports = {
  app
}

//
// $(function(){
//           $('#buyModal').modal({
//               keyboard : true,
//               backdrop : "static",
//               show     : false,
//           }).on('show.bs.modal', function(){
//               var getIdFromRow = $(this).data('id');
//               console.log("idFromRow");
//               console.log(getIdFromRow);
//
//               getIdFromRow = 0;
//               //make your ajax call populate items or what even you need
//               $(this).find('#saleDetails').html($('<b> Energy Id selected: ' + getIdFromRow  + '</b>'))
//               $(this).find('#saleDetails').append($('<b> Amount to sell: ' + app.salePetitions[getIdFromRow].kwhAmountSell  + '</b>'))
//
//           });
//
//           $(".table-striped").find('tr[data-target]').on('click', function(){
//              //or do your operations here instead of on show of modal to populate values to modal.
//               $('#buyModal').data('saleid',$(this).data('id'));
//           });
//       });
