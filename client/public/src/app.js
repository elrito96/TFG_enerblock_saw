'use strict'

const $ = require('jquery')

const {
  getState,
  submitUpdate
} = require('./state')


const concatNewOwners = (existing, ownerContainers) => {
  return existing.concat(ownerContainers
    .filter(({ owner }) => !existing.includes(owner))
    .map(({ owner }) => owner))
}

// Application Object
const app = { user: null, keys: [], assets: [], transfers: [] }

app.refresh = function () {
  getState(({ assets, transfers }) => {
    this.assets = assets
    this.transfers = transfers

    // Clear existing data views
    $('#assetList').empty()
    $('#transferList').empty()
    $('[name="assetSelect"]').children().slice(1).remove()
    $('[name="transferSelect"]').children().slice(1).remove()

    // Populate asset views
    assets.forEach(asset => {
      addRow('#assetList', asset.name, asset.owner)
      if (this.user && asset.owner === this.user.public) {
        addOption('[name="assetSelect"]', asset.name)
      }
    })

    // Populate transfer list for selected user
    transfers.filter(transfer => transfer.owner === this.user.public)
      .forEach(transfer => addAction('#transferList', transfer.asset, 'Accept'))

    // Populate transfer select with both local and blockchain keys
    let publicKeys = this.keys.map(pair => pair.public)
    publicKeys = concatNewOwners(publicKeys, assets)
    publicKeys = concatNewOwners(publicKeys, transfers)
    publicKeys.forEach(key => addOption('[name="transferSelect"]', key))
  })
}

app.update = function (action, amount, price, writedate, validwritedate, sellerpubkey, sellerprivatekey) {
    submitUpdate({ action, amount, price, writedate, validwritedate, sellerpubkey },
      sellerprivatekey,
      success => success ? this.refresh() : null
    )
}

// Select User
$('[name="keySelect"]').on('change', function () {
  if (this.value === 'new') {
    app.user = makeKeyPair()
    app.keys.push(app.user)
    saveKeys(app.keys)
    addOption(this, app.user.public, true)
    addOption('[name="transferSelect"]', app.user.public)
  } else if (this.value === 'none') {
    app.user = null
  } else {
    app.user = app.keys.find(key => key.public === this.value)
    app.refresh()
  }
})

// Create Asset
$('#createSubmit').on('click', function () {
  alert("function createSubmit");
  const amount = $('#amount').val()
  const price = $('#price').val()
  const writedate = $('#writedate').val()
  const validwritedate = $('#validwritedate').val()
  const sellerpubkey = $('#sellerpubkey').val()
  const sellerprivatekey = $('#sellerprivatekey').val()

  if (amout && price && writedate && validwritedate && sellerpubkey && sellerprivatekey)
    app.update('putOnSale', amount, price, writedate, validwritedate, sellerpubkey, sellerprivatekey)
})

// Transfer Asset
$('#transferSubmit').on('click', function () {
  const asset = $('[name="assetSelect"]').val()
  const owner = $('[name="transferSelect"]').val()
  if (asset && owner) app.update('transfer', asset, owner)
})

// Accept Asset
$('#transferList').on('click', '.accept', function () {
  const asset = $(this).prev().text()
  if (asset) app.update('accept', asset)
})

$('#transferList').on('click', '.reject', function () {
  const asset = $(this).prev().prev().text()
  if (asset) app.update('reject', asset)
})

// Initialize
app.keys = getKeys()
app.keys.forEach(pair => addOption('[name="keySelect"]', pair.public))
app.refresh()

$.getScript("https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js", function(){
  var update;
  (update = function() {
      document.getElementById("datetime")
      .innerHTML = moment().format('MMMM Do YYYY, h:mm:ss a');
  })();
  setInterval(update, 1000);
});


function myFunction() {
  var x = document.getElementById("keys");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}
