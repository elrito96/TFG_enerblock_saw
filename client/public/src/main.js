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
                        '<td>'+salePetitions[i].elementID+'</td>'+
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
                        '<td>'+buyPetitions[i].elementID+'</td>'+
                        '<td>'+shorten_text(buyPetitions[i].sellerPubKey,20)+'</td>'+
                        '<td><button class="editDeleteBuyPetition btn border border-secondary" type="button">Edit / Delete</button></td>'+
                    '</tr>');
        row.appendTo('#buyPetitionsData')
      }
      $('.editDeleteBuyPetition').on('click',function(e){
        e.stopPropagation();
        console.log(" Click al boton edit delete1");
        $('#editDeleteModalBuyPetition').modal('show');
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

app.updateIds = function(){
  $("#saleID").val(uuidv4());
  $("#buyIDBuyModal").val(uuidv4());
  $("#buyIDBuyModalSatisfyPetition").val(uuidv4());
  $("#buyPetitionID").val(uuidv4());
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

app.updateCreateSale = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerprivatekey) {
    const operation = 'putOnSale'
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID },
      sellerprivatekey,
      success => success ? console.log("Transaction submited") : null,
      null
    )
}

app.updateCreateBuyPetition = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerprivatekey) {
    const operation = 'createBuyPetition'
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID },
      sellerprivatekey,
      success => success ? console.log("Transaction submited") : null,
      null
    )
}

app.updateBuyFromSale = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, kwhAmountBuy, buyWritedate, counterpartID, buyerPrivKey) {
    const operation = 'buy'
    console.log("app.updateBuyFromSale -------------")
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, kwhAmountBuy, buyWritedate, counterpartID },
      buyerPrivKey,
      success => success ? console.log("Transaction submited") : null
    )
}
app.updateEditSale = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, buyerPrivKey) {
    const operation = 'editSale'
    console.log("app.updateEditSale -------------")
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey },
      buyerPrivKey,
      success => success ? console.log("Transaction submited") : null
    )
}
app.updateDeleteSale = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, buyerPrivKey) {
    const operation = 'deleteSale'
    console.log("app.updateDeleteSale -------------")
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey },
      buyerPrivKey,
      success => success ? console.log("Transaction submited") : null
    )
}
app.updateEditBuyPetition = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, buyerPrivKey) {
    const operation = 'editBuyPetition'
    console.log("app.updateEditSale -------------")
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey },
      buyerPrivKey,
      success => success ? console.log("Transaction submited") : null
    )
}
app.updateDeleteBuyPetition = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, buyerPrivKey) {
    const operation = 'deleteBuyPetition'
    console.log("app.updateDeleteSale -------------")
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey },
      buyerPrivKey,
      success => success ? console.log("Transaction submited") : null
    )
}

app.updateSatisfyBuyPetition = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, kwhAmountBuy, buyWritedate, counterpartID, buyerPrivKey) {
    const operation = 'satisfyBuyPetition'
    console.log("app.updateSatisfyBuyPetition -------------")
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, kwhAmountBuy, buyWritedate, counterpartID },
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

  // modify date min
  $("#validWritedateDate").attr("min",today);
  $('#validWritedateDateBuyPetition').attr("min",today);


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

  $("#closeButtonBuyED").click(function(){
    $("#resultBuyContainerED").css("visibility", "hidden");
  });
  // Close the result container by clicking anywhere in the message, might delete later
  $("#resultBuyContainerED").click(function(){
    $("#resultBuyContainerED").css("visibility", "hidden");
  });
  $("#closeButtonBuyEDBuyPetition").click(function(){
    $("#resultBuyContainerEDBuyPetition").css("visibility", "hidden");
  });
  // Close the result container by clicking anywhere in the message, might delete later
  $("#resultBuyContainerEDBuyPetition").click(function(){
    $("#resultBuyContainerEDBuyPetition").css("visibility", "hidden");
  });

  // Actions to show and hide elements when View Sales is clicked in the side bar
  $("#ViewSalesSide").click(function(){
    app.updateSalesTable();
	});
  // Actions to show and hide elements when Create Sale is clicked in the side bar
  $("#CreateSaleSide").click(function(){
    //window.history.pushState('', '', '/CreateSale');

    $("#resultContainer").css("visibility", "hidden");

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
    app.updateIds();
	});

  // Actions to show and hide elements when view buy petitions is clicked in the side bar
  $("#ViewBuyPetitionsSide").click(function(){
    app.updateBuyPetitionsTable();
  });
  // Actions to show and hide elements when Create Buy is clicked in the side bar
  $("#CreateBuySide").click(function(){
    //window.history.pushState('', '', '/CreateBuy');
    $("#resultContainerBuyPetition").css("visibility", "hidden");

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
    app.updateIds();

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
   // hide sales with 0 amount of energy and unvalid dates
  $("#hideInvalidSales").click(function(){
    $('#ViewSalesTable > tbody  > tr').each(function(index, tr) {

      var $tr = $(tr)
      console.log(index);
      console.log(tr);
      var amountToSell = $tr.find('td:eq(0)').text();
      var validDateTable = $tr.find('td:eq(3)').text();
      console.log(validDateTable);
      var yearTable = validDateTable.substring(0,4);
      var monthTable = validDateTable.substring(5,7);
      var dayTable = validDateTable.substring(8,10);
      var validDate = new Date(yearTable,parseInt(monthTable)-1,parseInt(dayTable),validDateTable.substring(11,13), validDateTable.substring(14,16),validDateTable.substring(17,19),"00");
      var now = new Date();

      if(amountToSell == "0" || validDate < now){
        console.log(" Esta es la fila a eliminar")
        $tr.remove();
      }
    });
  })
  // hide buy petitions with 0 energy solicited and passed validity date
  $("#hideInvalidPetitions").click(function(){
    $('#ViewBuyPetitionsTable > tbody  > tr').each(function(index, tr) {

      var $tr = $(tr)
      console.log(index);
      console.log(tr);
      var amountToSell = $tr.find('td:eq(0)').text();
      var validDateTable = $tr.find('td:eq(3)').text();
      console.log(validDateTable);
      var yearTable = validDateTable.substring(0,4);
      var monthTable = validDateTable.substring(5,7);
      var dayTable = validDateTable.substring(8,10);
      var validDate = new Date(yearTable,parseInt(monthTable)-1,parseInt(dayTable),validDateTable.substring(11,13), validDateTable.substring(14,16),validDateTable.substring(17,19),"00");
      var now = new Date();

      if(amountToSell == "0" || validDate < now){
        console.log(" Esta es la fila a eliminar")
        $tr.remove();
      }


    });
  })

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
  const elementID = $('#saleID').val()
  const sellerprivatekey = $("#sellerprivatekey").val();
  console.log("SALE NAME ID ==================== "+elementID)
  console.log("sellerprivatekey below ¨¨¨¨¨");
  console.log(sellerprivatekey)
  app.updateCreateSale(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerprivatekey)
  app.updateIds();
})

$('#createSubmitBuyPetition').on('click', function () {
  console.log(" Creating buy petition petition ");
  const kwhAmountSell = $('#amountBuyPetition').val()
  const pricePerKwh = $('#priceBuyPetition').val()
  const createWritedate = $('#writedateBuyPetition').val()
  const validWritedate = $('#validwritedateBuyPetition').val()
  const elementID = $('#buyPetitionID').val()
  const sellerprivatekey = $("#sellerprivatekeyBuyPetition").val();
  console.log("SALE NAME ID ==================== "+elementID)
  console.log("sellerprivatekey below ¨¨¨¨¨");
  console.log(sellerprivatekey)
  app.updateCreateBuyPetition(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerprivatekey)
  app.updateIds();
})


// Create buy sale
$('#createBuySubmit').on('click', function () {
  console.log("Buying from sale");
  // Info about sale
  const kwhAmountSell = $('#amountSelectedSaleBuy').text();
  const pricePerKwh = $('#priceSelectedSaleBuy').text();
  const createWritedate = $('#createWdSelectedSaleBuy').text();
  const validWritedate = $('#validWdSelectedSaleBuy').text();
  const elementID = $('#idSelectedSaleBuy').text();
  const sellerPubKey = $('#sellerSelectedSaleBuy').text();

  // Info about buy
  const kwhAmountBuy = $('#amountBuyModal').val()
  const buyWritedate = $('#writedateBuyModal').val()
  const counterpartID = $('#buyIDBuyModal').val()
  const buyerPrivKey = $('#buyerPrivateKeyBuyModal').val()
  app.updateBuyFromSale(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, kwhAmountBuy, buyWritedate, counterpartID, buyerPrivKey)
  app.updateIds();
})


// Edit sale
$('#editSaleBut').on('click', function () {
  console.log("editing sale");
  // Info about sale
  const kwhAmountSell = $('#amountSelectedSaleBuyED').val();
  const pricePerKwh = $('#priceSelectedSaleBuyED').val();
  const createWritedate = $('#createWdSelectedSaleBuy').text();
  const validWritedate = $('#validWdSelectedSaleBuy').text();
  const elementID = $('#idSelectedSaleBuy').text();
  const sellerPubKey = $('#sellerSelectedSaleBuy').text();
  // User that tries to edit the sale, must be the one who created it
  const buyerPrivKey = $('#buyerPrivateKeyBuyModalEditDeleteSale').val();
  console.log("Owner pub key: "+sellerPubKey+ "\n editer priv key:"+buyerPrivKey);

  app.updateEditSale(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, buyerPrivKey)
})

// Delete sale
$('#deleteSaleBut').on('click', function () {
  console.log("Deleting sale");
  // Info about sale
  const kwhAmountSell = $('#amountSelectedSaleBuyED').val();
  const pricePerKwh = $('#priceSelectedSaleBuyED').val();
  const createWritedate = $('#createWdSelectedSaleBuy').text();
  const validWritedate = $('#validWdSelectedSaleBuy').text();
  const elementID = $('#idSelectedSaleBuy').text();
  const sellerPubKey = $('#sellerSelectedSaleBuy').text();
  // User that tries to delete the sale, must be the one who created it
  const buyerPrivKey = $('#buyerPrivateKeyBuyModalEditDeleteSale').val();

  console.log("Owner pub key: "+sellerPubKey+ "\n deleter priv key:"+buyerPrivKey);
  app.updateDeleteSale(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, buyerPrivKey)
})

// Create satisfy buy petition
$('#createBuySubmitSatisfyPetition').on('click', function () {
  console.log("Staisfying buy petition");
  // Info about sale
  const kwhAmountSell = $('#amountSelectedSaleBuySatisfyPetition').text();
  const pricePerKwh = $('#priceSelectedSaleBuySatisfyPetition').text();
  const createWritedate = $('#priceSelectedSaleBuySatisfyPetition').text();
  const validWritedate = $('#validWdSelectedSaleBuySatisfyPetition').text();
  const elementID = $('#idSelectedSaleBuySatisfyPetition').text();
  const sellerPubKey = $('#sellerSelectedSaleBuySatisfyPetition').text();

  // Info about buy
  const kwhAmountBuy = $('#amountBuyModalSatisfyPetition').val()
  const buyWritedate = $('#writedateBuyModalSatisfyPetition').val()
  const counterpartID = $('#buyIDBuyModalSatisfyPetition').val()
  const buyerPrivKey = $('#buyerPrivateKeyBuyModalSatisfyPetition').val()
  app.updateSatisfyBuyPetition(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, kwhAmountBuy, buyWritedate, counterpartID, buyerPrivKey)
  app.updateIds();
})

// Edit BuyPetition
$('#editBuyPetitionBut').on('click', function () {
  console.log("editing sale");
  // Info about sale
  const kwhAmountSell = $('#amountSelectedSaleBuyEDBuyPetition').val();
  const pricePerKwh = $('#priceSelectedSaleBuyEDBuyPetition').val();
  const createWritedate = $('#createWdSelectedSaleBuyEDBuyPetition').text();
  const validWritedate = $('#validWdSelectedSaleBuyEDBuyPetition').text();
  const elementID = $('#idSelectedSaleBuyEDBuyPetition').text();
  const sellerPubKey = $('#sellerSelectedSaleBuyEDBuyPetition').text();
  // User that tries to edit the sale, must be the one who created it
  const buyerPrivKey = $('#buyerPrivateKeyBuyModalEditDeleteBuyPetition').val();
  console.log("Owner pub key: "+sellerPubKey+ "\n editer priv key:"+buyerPrivKey);

  app.updateEditBuyPetition(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, buyerPrivKey)
})

// Delete BuyPetition
$('#deleteBuyPetitionBut').on('click', function () {
  console.log("Deleting sale");
  // Info about sale
  const kwhAmountSell = $('#amountSelectedSaleBuyEDBuyPetition').val();
  const pricePerKwh = $('#priceSelectedSaleBuyEDBuyPetition').val();
  const createWritedate = $('#createWdSelectedSaleBuyEDBuyPetition').text();
  const validWritedate = $('#validWdSelectedSaleBuyEDBuyPetition').text();
  const elementID = $('#idSelectedSaleBuyEDBuyPetition').text();
  const sellerPubKey = $('#sellerSelectedSaleBuyEDBuyPetition').text();
  // User that tries to delete the sale, must be the one who created it
  const buyerPrivKey = $('#buyerPrivateKeyBuyModalEditDeleteBuyPetition').val();

  console.log("Owner pub key: "+sellerPubKey+ "\n deleter priv key:"+buyerPrivKey);
  app.updateDeleteBuyPetition(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, elementID, sellerPubKey, buyerPrivKey)
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
  app.updateIds();
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
      '<label id="idSelectedSaleBuy" style="display:none">' + app.salePetitions[getIdFromRow].elementID + '</label>'
    )
  )
  $('#amountBuyModal').val("");
  $('#totalCostBuyModal').val(0);

});

// edit - delete sale of Energy
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
  $('#resultBuyContainerED').css("visibility", "hidden")
  $(this).find('#editDeleteModalSaleDetails').html(
    $('<b> Amount to sell (KwH): </b> <input id="amountSelectedSaleBuyED" class="form-control" type="number" ></input><br>'+
      '<b>Price per KhW :</b> <input id="priceSelectedSaleBuyED" class="form-control" type="number"></input><br>'+
      '<b>Creation Date : </b> <label id="createWdSelectedSaleBuy">' + app.salePetitions[getIdFromRow].createWritedate + '</label><br>'+
      '<b>Validity Date : </b> <label id="validWdSelectedSaleBuy">' + app.salePetitions[getIdFromRow].validWritedate + '</label><br>'+
      '<b>Seller Public Key : </b> <label id="sellerSelectedSaleBuy" style=>' + app.salePetitions[getIdFromRow].sellerPubKey + '</label><br>'+
      '<b>Sale ID : </b><label id="idSelectedSaleBuy" >' + app.salePetitions[getIdFromRow].elementID + '</label>'
    )
  )
  $('#amountSelectedSaleBuyED').val(amountToLoadModal);
  $('#priceSelectedSaleBuyED').val(app.salePetitions[getIdFromRow].pricePerKwh);


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
  app.updateIds();
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
      '<label id="idSelectedSaleBuySatisfyPetition" style="display:none">' + app.buyPetitions[getIdFromRow].elementID + '</label>'
    )
  )
  $('#amountBuyModalSatisfyPetition').val("");
  $('#totalCostBuyModalSatisfyPetition').val(0);

});


// edit - delete petition of Energy
$('#editDeleteModalBuyPetition').modal({
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
  $('#resultBuyContainerEDBuyPetition').css("visibility", "hidden")
  $(this).find('#editDeleteModalBuyPetitionDetails').html(
    $('<b> Amount to sell (KwH): </b> <input id="amountSelectedSaleBuyEDBuyPetition" class="form-control" type="number" ></input><br>'+
      '<b>Price per KhW :</b> <input id="priceSelectedSaleBuyEDBuyPetition" class="form-control" type="number"></input><br>'+
      '<b>Creation Date : </b> <label id="createWdSelectedSaleBuyEDBuyPetition">' + app.buyPetitions[getIdFromRow].createWritedate + '</label><br>'+
      '<b>Validity Date : </b> <label id="validWdSelectedSaleBuyEDBuyPetition">' + app.buyPetitions[getIdFromRow].validWritedate + '</label><br>'+
      '<b>Seller Public Key : </b> <label id="sellerSelectedSaleBuyEDBuyPetition" style=>' + app.buyPetitions[getIdFromRow].sellerPubKey + '</label><br>'+
      '<b>Sale ID : </b><label id="idSelectedSaleBuyEDBuyPetition" >' + app.buyPetitions[getIdFromRow].elementID + '</label>'
    )
  )
  $('#amountSelectedSaleBuyEDBuyPetition').val(amountToLoadModal);
  $('#priceSelectedSaleBuyEDBuyPetition').val(app.buyPetitions[getIdFromRow].pricePerKwh);


});

module.exports = {
  app
}
