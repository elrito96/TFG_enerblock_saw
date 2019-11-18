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
  getState(
    ({ salePetitions, buys}) => {
      this.salePetitions = salePetitions;
      this.buys = buys;
      /* Clear table contents */
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

  // Update cost of buy when changing amount
  $('#amountBuyModal').on('keyup',function(){

    var amount = $('#amountBuyModal').val();

    var price = $('#costSelected').text();

    console.log(amount)
    console.log(price)
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



  // Actions to show and hide elements when View Sales is clicked in the side bar
  $("#ViewSalesSide").click(function(){

    //window.history.pushState('', '', '/ViewSales');
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

// Buy selected sale of Energy
$('#buyModal').modal({
        keyboarnd: true,
        backdrop: "static",
        show:false,

    }).on('show.bs.modal', function(){
        var getIdFromRow = $(event.target).closest('tr').data('id');

        // Ajax calls to populate modal
        $(this).find('#saleDetails').html(
          $('<b> Amount to sell: ' + app.salePetitions[getIdFromRow].kwhAmountSell + '<br>'+
            'Price per KhW : ' + app.salePetitions[getIdFromRow].pricePerKwh + '<br>'+
            'Creation Date : ' + app.salePetitions[getIdFromRow].createWritedate + '<br>'+
            'Validity Date : ' + app.salePetitions[getIdFromRow].validWritedate + '<br>'+
            'Seller Public Key : ' + app.salePetitions[getIdFromRow].sellerPubKey + '<br>'+
            '</b>' + '<label id="costSelected">'+ app.salePetitions[getIdFromRow].pricePerKwh + '</label>'
          )
        )


    });


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
