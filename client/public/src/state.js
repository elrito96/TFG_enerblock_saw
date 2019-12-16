// SPDX-License-Identifier: Apache-2.0

/*
This code was written by Zac Delventhal @delventhalz.
Original source code can be found here: https://github.com/delventhalz/transfer-chain-js/blob/master/client/src/state.js
 */

'use strict'

const $ = require('jquery')
const {createHash} = require('crypto')
const protobuf = require('sawtooth-sdk/protobuf')
const {
  createContext,
  Signer
} = require('sawtooth-sdk/signing')
const secp256k1 = require('sawtooth-sdk/signing/secp256k1')
const app = require('./main')

// Config variables
const KEY_NAME = 'transfer-chain.keys'
const API_URL = 'http://localhost:8000/api'

const FAMILY = 'enerblock'
const VERSION = '1.0'
const PREFIX = '5a45ce'

// Fetch key-pairs from localStorage
const getKeys = () => {
  const storedKeys = localStorage.getItem(KEY_NAME)
  if (!storedKeys) return []

  return storedKeys.split(';').map((pair) => {
    const separated = pair.split(',')
    return {
      public: separated[0],
      private: separated[1]
    }
  })
}

// Create new key-pair
const makeKeyPair = () => {
  const context = createContext('secp256k1')
  const privateKey = context.newRandomPrivateKey()
  return {
    public: context.getPublicKey(privateKey).asHex(),
    private: privateKey.asHex()
  }
}

// Save key-pairs to localStorage
const saveKeys = keys => {
  const paired = keys.map(pair => [pair.public, pair.private].join(','))
  localStorage.setItem(KEY_NAME, paired.join(';'))
}
// Fetch current Enerblock state from validator
const getState = cb => {
  $.get(`${API_URL}/state?address=${PREFIX}`, ({ data }) => {
    cb(data.reduce((processed, datum) => {
      if (datum.data !== '') {
        const parsed = JSON.parse(atob(datum.data))
        if (datum.address[7] === '0') processed.salePetitions.push(parsed)
        if (datum.address[7] === '1') processed.buysFromSales.push(parsed)
        if (datum.address[7] === '2') processed.buyPetitions.push(parsed)
        if (datum.address[7] === '3') processed.satisfiedBuyPetitions.push(parsed)
      }
      return processed
    }, {salePetitions: [], buysFromSales: [], buyPetitions: [], satisfiedBuyPetitions: []}))
  })
}

// Submit signed Transaction to validator
const submitUpdate = (payload, privateKeyHex, cb, saleId, newAmount) => {
  console.log(" ### PAYLOAD sent BELOW ### ");
  console.log(payload);
  // Create signer
  const context = createContext('secp256k1')
  const privateKey = secp256k1.Secp256k1PrivateKey.fromHex(privateKeyHex)
  const signer = new Signer(context, privateKey)

  // Create the TransactionHeader
  const payloadBytes = Buffer.from(JSON.stringify(payload))
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: FAMILY,
    familyVersion: VERSION,
    inputs: [PREFIX],
    outputs: [PREFIX],
    signerPublicKey: signer.getPublicKey().asHex(),
    batcherPublicKey: signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
  }).finish()
  // Create the Transaction
  const transactionHeaderSignature = signer.sign(transactionHeaderBytes)

  const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: transactionHeaderSignature,
    payload: payloadBytes
  })
  // Create the BatchHeader
  const batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: signer.getPublicKey().asHex(),
    transactionIds: [transaction.headerSignature]
  }).finish()

  // Create the Batch
  const batchHeaderSignature = signer.sign(batchHeaderBytes)

  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchHeaderSignature,
    transactions: [transaction]
  })
  // Encode the Batch in a BatchList
  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish()

  console.log(" ### Transaction created and sent to Validator ###");
  // Submit BatchList to Validator
  $.post({
    url: `${API_URL}/batches`,
    data: batchListBytes,
    headers: {'Content-Type': 'application/octet-stream'},
    processData: false,
    success: function( resp ) {
      console.log(resp);
      var id = resp.link.split('?')[1]
      $.get(`${API_URL}/batch_statuses?${id}&wait`, function(data){
        var msg = '';
        var transactionStatus = data.data[0];
        console.log(transactionStatus)
        console.log(transactionStatus.status)
        if(transactionStatus.status == "COMMITTED" && payload.operation == "putOnSale"){
          $('#resultContainer').css("visibility", "visible")
          msg = 'Sale posted successfully in Blockchain';
          $('#divResult').css("background-color","rgb(92,184,92)");
          $('#saleMsg').html(msg);
        }
        else if(transactionStatus.status == "COMMITTED" && payload.operation == "createBuyPetition"){
          $('#resultContainerBuyPetition').css("visibility", "visible")
          msg = 'Buy petition posted successfully in Blockchain';
          $('#divResultBuyPetition').css("background-color","rgb(92,184,92)");
          $('#msgBuyPetition').html(msg);
        }
        else if(transactionStatus.status == "COMMITTED" && payload.operation == "buy"){
          $('#resultBuyContainer').css("visibility", "visible")
          msg = 'Buy done correctly';
          $('#divResultBuy').css("background-color","rgb(92,184,92)");
          $('#buyMsg').html(msg);
          // Actualizar modal
          var amountBefore = +($('#amountSelectedSaleBuy').text());
          var amountBought = $('#amountBuyModal').val();
          var newAmout = amountBefore - amountBought;
          $('#amountSelectedSaleBuy').text(newAmout);
          //Actualizar tabla
          var id = $('#idSelectedSaleBuy').text();
          // Loop table, update the amount of the bought offer
          console.log(" UPDATING TABLE id == "+id)
          $('#ViewSalesTable > tbody  > tr').each(function(index, tr) {
            var count = 0
            var $tr = $(tr)
            console.log(index);
            console.log(tr);
            var rowId = $tr.find('td:eq(4)').text();
            if(rowId == $('#idSelectedSaleBuy').text()){
              console.log(" Esta es la fila a editar ")
              $tr.find('td:eq('+count+')').text(newAmout);
            }
            console.log(rowId);
            count=count+1
          });
        }else if(transactionStatus.status == "COMMITTED" && (payload.operation == "deleteSale" || payload.operation == "editSale")){
          // hide Modal
          $('#editDeleteModalSale').modal('hide');
          //trigger
          $('#ViewSalesSide').trigger("click");
        }else if(transactionStatus.status == "COMMITTED" && (payload.operation == "deleteBuyPetition" || payload.operation == "editBuyPetition")){
          // hide Modal
          $('#editDeleteModalBuyPetition').modal('hide');
          //trigger
          $('#ViewBuyPetitionsSide').trigger("click");
        }else if(transactionStatus.status == "COMMITTED" && payload.operation == "satisfyBuyPetition"){
          $('#resultBuyContainerSatisfyPetition').css("visibility", "visible")
          msg = 'Buy petition satisfied correctly';
          $('#divResultBuySatisfyPetition').css("background-color","rgb(92,184,92)");
          $('#buyMsgSatisfyPetition').html(msg);
          // Actualizar modal
          var amountBefore = +($('#amountSelectedSaleBuySatisfyPetition').text());
          var amountBought = $('#amountBuyModalSatisfyPetition').val();
          var newAmout = amountBefore - amountBought;
          $('#amountSelectedSaleBuySatisfyPetition').text(newAmout);
          //Actualizar tabla
          var id = $('#idSelectedSaleBuySatisfyPetition').text();
          // Loop table, update the amount of the bought offer
          console.log(" UPDATING TABLE id == "+id)
          $('#ViewBuyPetitionsTable > tbody  > tr').each(function(index, tr) {
            var count = 0
            var $tr = $(tr)
            console.log(index);
            console.log(tr);
            var rowId = $tr.find('td:eq(4)').text();
            if(rowId == $('#idSelectedSaleBuySatisfyPetition').text()){
              console.log(" Esta es la fila a editar ")
              $tr.find('td:eq('+count+')').text(newAmout);
            }
            console.log(rowId);
            count=count+1
          });
        }

        else if (transactionStatus.status == "INVALID" && payload.operation == "putOnSale"){
          $('#resultContainer').css("visibility", "visible")
          msg = transactionStatus.invalid_transactions[0].message;
          $('#divResult').css("background-color","rgba(238, 238, 0, 0.85)");
          $('#saleMsg').html(msg);
        }else if (transactionStatus.status == "INVALID" && payload.operation == "buy"){
          $('#resultBuyContainer').css("visibility", "visible")
          msg = transactionStatus.invalid_transactions[0].message;
          $('#divResultBuy').css("background-color","rgba(238, 238, 0, 0.85)");
          $('#buyMsg').html(msg);
        }else if (transactionStatus.status == "INVALID" && payload.operation == "createBuyPetition"){
          $('#resultContainerBuyPetition').css("visibility", "visible")
          msg = transactionStatus.invalid_transactions[0].message;
          $('#divResultBuyPetition').css("background-color","rgba(238, 238, 0, 0.85)");
          $('#msgBuyPetition').html(msg);
        }else if (transactionStatus.status == "INVALID" && payload.operation == "satisfyBuyPetition"){
            $('#resultBuyContainerSatisfyPetition').css("visibility", "visible")
            msg = transactionStatus.invalid_transactions[0].message;
            $('#divResultBuySatisfyPetition').css("background-color","rgba(238, 238, 0, 0.85)");
            $('#buyMsgSatisfyPetition').html(msg);
        }else if (transactionStatus.status == "INVALID" && (payload.operation == "deleteSale" || payload.operation == "editSale")){
            $('#resultBuyContainerED').css("visibility", "visible")
            msg = transactionStatus.invalid_transactions[0].message;
            $('#divResultBuyED').css("background-color","rgba(238, 238, 0, 0.85)");
            $('#buyMsgED').html(msg);
        }else if (transactionStatus.status == "INVALID" && (payload.operation == "deleteBuyPetition" || payload.operation == "editBuyPetition")){
            $('#resultBuyContainerEDBuyPetition').css("visibility", "visible")
            msg = transactionStatus.invalid_transactions[0].message;
            $('#divResultBuyEDBuyPetition').css("background-color","rgba(238, 238, 0, 0.85)");
            $('#buyMsgEDBuyPetition').html(msg);
        }
      });
    },
    error: function (errorResponse) { /*() => cb(false)*/
      $('#resultContainer').css("visibility", "visible")
      $('#resultBuyContainer').css("visibility", "visible")
      $('#divResult').css("background-color","rgba(243, 101, 101)");
      $('#divResultBuy').css("background-color","rgba(238, 238, 0, 0.85)");
      console.log(errorResponse)
      var msg = 'Error posting the sale, probably connection error';
      console.log(msg);
      $('#saleMsg').html(msg);
      $('#buyMsg').html(msg);
      $('#saleMsg').css("color","white");
      $('#buyMsg').css("color","white");
    }
  })
}

module.exports = {
  getKeys,
  makeKeyPair,
  saveKeys,
  getState,
  submitUpdate
}
