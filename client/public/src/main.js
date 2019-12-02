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
const app = { user: null, keys: [], salePetitions: [], buys: [] , buyPetitions: [], sales: []}


// Load Sales
app.refresh = function (){
  console.log(" -- App.refresh function) --")
  getState(
    ({ salePetitions, buys}) => {
      this.salePetitions = salePetitions;
      this.buys = buys;
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
                        '<td>'+salePetitions[i].sellerPubKey+'</td>'+
                    '</tr>');
        row.appendTo('#salesData')
      }

      console.log(this.salePetitions)
    }
  )
}
app.updateSalesTable = function(){
  console.log(" -- Ocultar Create, mostrar Sales --")
  //window.history.pushState('', '', '/ViewSales');
  $("#CreateSalePage").css("display", "none");
  $("#CreateBuyPage").css("display", "none");
  $("#ViewSalesPage").css("display", "block");

  $("#ViewSalesA").addClass("active");
  $("#CreateSaleA").removeClass("active");
  $("#CreateBuyA").removeClass("active");

  app.refresh();
}
app.updateCreateSale = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerprivatekey) {
    const operation = 'putOnSale'
    submitUpdate({ operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName },
      sellerprivatekey,
      success => success ? console.log("Transaction submited") : null,
      null
    )
}

app.updateBuyFromSale = function (kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, kwhAmountBuy, buyWritedate, buyName, buyerPrivKey) {
    const operation = 'buy'
    var newAmount =
    console.log("app.updateBuyFromSale -------------")
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
      $("#writedateBuyModal").val( moment().format('YYYY-MM-DD kk:mm:ss'));

  })();
  setInterval(update, 1000);
});

function pad(d) {
    return (d < 10) ? '0' + d.toString() : d.toString();
}


/* Jquery  that will deal with initialization of web page */
$(document).ready(function(){
  // Load sales when page loads
  app.refresh();

  // Update total cost when changing amount
  $('#amountBuyModal').on('keyup change',function(){
    var amount = $('#amountBuyModal').val();
    var price = $('#priceSelectedSaleBuy').text();
    $('#totalCostBuyModal').val(amount * price)
  })

  // Load options in selected

  // Minutes
  for(var i = 11; i>=0; i--){
    $('#validwritedateMin').append(`<option value="`+pad(i*5)+`">
                                       `+pad(i*5)+`
                                  </option>`)
  }
  // Hours
  for(var i = 23; i>=0; i--){
    $('#validwritedateHour').append(`<option value="`+pad(i)+`">
                                       `+pad(i)+`
                                  </option>`)
  }




  //Load today date on create sale date picker
  var now = new Date();
  var day = ("0" + now.getDate()).slice(-2);
  var month = ("0" + (now.getMonth() + 1)).slice(-2);
  var today = now.getFullYear()+"-"+(month)+"-"+(day) ;
  $('#validWritedateDate').val(today);

  //Load valid date in field from date, hour, min and seconds
  updateValidWritedate();


  // Update valid date field when changing date, hour, min or seconds
  $('#validWritedateDate, #validwritedateHour,#validwritedateMin, #validwritedateSec').on('change',updateValidWritedate);
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


  // X icon to close the result container
  $("#closeButton").click(function(){
		$("#resultContainer").css("visibility", "hidden");
	});
  // Close the result container by clicking anywhere in the message, might delete later
  $("#resultContainer").click(function(){
		$("#resultContainer").css("visibility", "hidden");
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

    $("#CreateSaleA").addClass("active");
    $("#ViewSalesA").removeClass("active");
    $("#CreateBuyA").removeClass("active");
	});

  // Actions to show and hide elements when Create Buy is clicked in the side bar
  $("#CreateBuySide").click(function(){
    //window.history.pushState('', '', '/CreateBuy');
		$("#ViewSalesPage").css("display", "none");
    $("#CreateSalePage").css("display", "none");
    $("#CreateBuyPage").css("display", "block");

    $("#CreateBuyA").addClass("active");
    $("#ViewSalesA").removeClass("active");
    $("#CreateSaleA").removeClass("active");
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


// Create Put on sale
$('#createSubmit').on('click', function () {
  console.log(" Creating sale petition ");
  const kwhAmountSell = $('#amount').val()
  const pricePerKwh = $('#price').val()
  const createWritedate = $('#writedate').val()
  const validWritedate = $('#validwritedate').val()
  const saleName = $('#saleID').val()
  const sellerprivatekey = $('#sellerprivatekey').val()
  console.log("SALE NAME ID ==================== "+saleName)
  console.log("abundle main");
  app.updateCreateSale(kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerprivatekey)
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


// Buy selected sale of Energy
$('#buyModal').modal({
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
  $(this).find('#saleDetails').html(
    $('<b> Amount to sell (KwH): </b> <label id="amountSelectedSaleBuy">' + amountToLoadModal + '</label><br>'+
      '<b>Price per KhW : </b> <label id="priceSelectedSaleBuy">' + app.salePetitions[getIdFromRow].pricePerKwh + '</label><br>'+
      '<b>Creation Date : </b> <label id="createWdSelectedSaleBuy">' + app.salePetitions[getIdFromRow].createWritedate + '</label><br>'+
      '<b>Validity Date : </b> <label id="validWdSelectedSaleBuy">' + app.salePetitions[getIdFromRow].validWritedate + '</label><br>'+
      '<b>Seller Public Key : </b> <label id="sellerSelectedSaleBuy">' + app.salePetitions[getIdFromRow].sellerPubKey + '</label><br>'+
      '<label id="idSelectedSaleBuy">' + app.salePetitions[getIdFromRow].saleName + '</label>'
    )
  )
  $('#amountBuyModal').val("");
  $('#totalCostBuyModal').val(0);

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
