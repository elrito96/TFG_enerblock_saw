# Copyright 2018 Intel Corporation
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# -----------------------------------------------------------------------------
import logging
import json
from datetime import datetime
'''import hashlib
import random'''

from sawtooth_sdk.processor.exceptions import InvalidTransaction
LOGGER = logging.getLogger(__name__)

'''def _hash(data):
    #Compute the SHA-512 hash and return the result as hex characters.
    return hashlib.sha1(data).hexdigest()'''

class EnerblockPayload(object):

    ''' Constructor of a payload

    Keyword arguments:
    payload -- content of the payload
    transactionCreator -- public key of the creator, will be the seller in a sell and buyer in a buy
    '''
    def __init__(self, payload, transactionCreator):
        print("__init__ payload")
        try:
            data = json.loads(payload.decode('utf-8'))
        except ValueError:
            raise InvalidTransaction("Invalid payload serialization")

        operation = data.get('operation')
        if not operation:
            raise InvalidTransaction('Not operation, operation is required')
        if operation not in ('putOnSale', 'buy', 'createBuyPetition', 'satisfyBuyPetition', 'editSale', 'deleteSale', 'editBuyPetition', 'deleteBuyPetition'):
            raise InvalidTransaction('Invalid operation: {}'.format(operation))

        #Common section
        kwhAmountSell = data.get('kwhAmountSell')
        pricePerKwh = data.get('pricePerKwh')
        createWritedate = data.get('createWritedate')
        validWritedate = data.get('validWritedate')
        elementID = data.get('elementID')

        # Sell section
        if operation == 'putOnSale' or operation == 'editSale' or operation == 'deleteSale' :

            sellerPubKey = transactionCreator

            if operation == 'putOnSale' or operation == 'editSale':
                #Validate that the amount to sell is not null, or anything different from a positive int
                if not kwhAmountSell:
                    raise InvalidTransaction('Amount to sell is required')
                if not kwhAmountSell.isdigit() or kwhAmountSell == "0":
                    raise InvalidTransaction('Amount to sell must be a positive integer number')
            if operation == 'editSale' or operation == 'deleteSale':
                sellerPubKey = data.get('sellerPubKey')



            if not sellerPubKey:
                raise InvalidTransaction('A seller is required to sell')

            self._sellerPubKey = sellerPubKey

            #Validate that the amount to sell is not null, or anything different from a positive decimal
            if not pricePerKwh:
                raise InvalidTransaction('Price per kwh is required')
            if not pricePerKwh.replace('.','',1).isdigit() or pricePerKwh =="0":
                raise InvalidTransaction('Price per kwh must be a positive number')

            #Validate creation date not null
            if not createWritedate:
                raise InvalidTransaction('Date of creation of sale is required')
            #Validate creation date format
            print(" Creation dat is === ",createWritedate)
            try:
                datetime.strptime(createWritedate, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                raise InvalidTransaction("Incorrect data format, creation Date should be YYYY-MM-DD hh:mm:ss")

            #Validate validity date not null
            if not validWritedate:
                raise InvalidTransaction('Date limit of sale is required')
            #Validate valid date format
            try:
                datetime.strptime(validWritedate, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                raise InvalidTransaction("Incorrect data format, validity Date should be YYYY-MM-DD hh:mm:ss")
            # Validate valid date after creation date
            createDate = datetime.strptime(createWritedate, '%Y-%m-%d %H:%M:%S')
            validDate = datetime.strptime(validWritedate, '%Y-%m-%d %H:%M:%S')
            if validDate < createDate:
                raise InvalidTransaction("Validity date can't be earlier than creation date")


            if not elementID:
                raise InvalidTransaction('Sale id (elementID) is required')

            self._operation = operation
            self._kwhAmountSell = kwhAmountSell
            self._pricePerKwh = pricePerKwh
            self._createWritedate = createWritedate
            self._validWritedate = validWritedate
            self._elementID = elementID

        # create Buy Petition section
        elif operation == 'createBuyPetition' or operation == 'editBuyPetition' or operation == 'deleteBuyPetition' :

            sellerPubKey = transactionCreator

            if operation == 'createBuyPetition' or operation == 'editBuyPetition':
                #Validate that the amount to sell is not null, or anything different from a positive int
                if not kwhAmountSell:
                    raise InvalidTransaction('Solicited amount is required')
                if not kwhAmountSell.isdigit() or kwhAmountSell == "0":
                    raise InvalidTransaction('Solicited amount must be a positive integer number')
            if operation == 'editBuyPetition' or operation == 'deleteBuyPetition':
                sellerPubKey = data.get('sellerPubKey')


            if not sellerPubKey:
                raise InvalidTransaction('A creator is required to create buy petition')

            self._sellerPubKey = sellerPubKey

            #Validate that the amount to sell is not null, or anything different from a positive decimal
            if not pricePerKwh:
                raise InvalidTransaction('Price per kwh is required')
            if not pricePerKwh.replace('.','',1).isdigit() or pricePerKwh =="0":
                raise InvalidTransaction('Price per kwh must be a positive number')

            #Validate creation date not null
            if not createWritedate:
                raise InvalidTransaction('Date of creation of petition is required')
            #Validate creation date format
            try:
                datetime.strptime(createWritedate, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                raise InvalidTransaction("Incorrect data format, creation Date should be YYYY-MM-DD hh:mm:ss")

            #Validate validity date not null
            if not validWritedate:
                raise InvalidTransaction('Date limit of petition is required')
            #Validate valid date format
            try:
                datetime.strptime(validWritedate, '%Y-%m-%d %H:%M:%S')
            except ValueError:
                raise InvalidTransaction("Incorrect data format, validity Date should be YYYY-MM-DD hh:mm:ss")
            # Validate valid date after creation date
            createDate = datetime.strptime(createWritedate, '%Y-%m-%d %H:%M:%S')
            validDate = datetime.strptime(validWritedate, '%Y-%m-%d %H:%M:%S')
            if validDate < createDate:
                raise InvalidTransaction("Validity date can't be earlier than creation date")
            if not elementID:
                raise InvalidTransaction('Petition ID is required')

            self._operation = operation
            self._kwhAmountSell = kwhAmountSell
            self._pricePerKwh = pricePerKwh
            self._createWritedate = createWritedate
            self._validWritedate = validWritedate
            self._elementID = elementID

        # Buy section
        elif operation == "buy":
            sellerPubKey = data.get('sellerPubKey')
            kwhAmountBuy = data.get('kwhAmountBuy')
            buyWritedate = data.get('buyWritedate')
            elementID = data.get('elementID')
            counterpartID = data.get('counterpartID')
            buyerPubKey = transactionCreator

            if not kwhAmountBuy:
                raise InvalidTransaction('Amount to buy is required')
            if kwhAmountSell == "0":
                raise InvalidTransaction("Can't buy when no energy is offered")
            if int(kwhAmountBuy) > int(kwhAmountSell):
                raise InvalidTransaction("Can't buy more than the offered amount")
            if not sellerPubKey:
                raise InvalidTransaction('There is no seller in this transaction')
            if not kwhAmountBuy:
                raise InvalidTransaction('Amount to buy is required to buy')
            if not buyWritedate:
                raise InvalidTransaction('Date of buy is required to buy')
            if not elementID:
                raise InvalidTransaction('Sale id (elementID) required to buy')
            if not counterpartID:
                raise InvalidTransaction('Buy id (counterpartID) required to buy')
            if not buyerPubKey:
                raise InvalidTransaction('A buyer is required to buy')

            limitDate = datetime.strptime(validWritedate, '%Y-%m-%d %H:%M:%S')
            buyDate = datetime.strptime(buyWritedate, '%Y-%m-%d %H:%M:%S')
            if limitDate < buyDate:
                raise InvalidTransaction("Can't buy after validity date")
            self._operation = operation
            self._kwhAmountSell = kwhAmountSell
            self._pricePerKwh = pricePerKwh
            self._createWritedate = createWritedate
            self._validWritedate = validWritedate
            self._elementID = elementID
            self._sellerPubKey = sellerPubKey
            self._kwhAmountBuy = kwhAmountBuy
            self._buyWritedate = buyWritedate
            self._counterpartID = counterpartID
            self._buyerPubKey = buyerPubKey

        # Buy section
        elif operation == "satisfyBuyPetition":
            sellerPubKey = data.get('sellerPubKey')
            kwhAmountBuy = data.get('kwhAmountBuy')
            buyWritedate = data.get('buyWritedate')
            elementID = data.get('elementID')
            counterpartID = data.get('counterpartID')
            buyerPubKey = transactionCreator

            if not kwhAmountBuy:
                raise InvalidTransaction('Amount requested is required')
            if kwhAmountSell == "0":
                raise InvalidTransaction("The petition is already satisfied")
            if int(kwhAmountBuy) > int(kwhAmountSell):
                raise InvalidTransaction("Can't offer more than the requested amount")
            if not sellerPubKey:
                raise InvalidTransaction('There is no creator of Buy Petition in this transaction')
            if not kwhAmountBuy:
                raise InvalidTransaction('Amount to offer is required')
            if not buyWritedate:
                raise InvalidTransaction('Date is required to buy')
            if not elementID:
                raise InvalidTransaction('Buy Petition id required')
            if not counterpartID:
                raise InvalidTransaction('Satisfy Buy Petition id is required ')
            if not buyerPubKey:
                raise InvalidTransaction('A key is required to satisfy a buy petition')
            limitDate = datetime.strptime(validWritedate, '%Y-%m-%d %H:%M:%S')
            buyDate = datetime.strptime(buyWritedate, '%Y-%m-%d %H:%M:%S')
            if limitDate < buyDate:
                raise InvalidTransaction("Can't satisfy buy petition after validity date")
            self._operation = operation
            self._kwhAmountSell = kwhAmountSell
            self._pricePerKwh = pricePerKwh
            self._createWritedate = createWritedate
            self._validWritedate = validWritedate
            self._elementID = elementID
            self._sellerPubKey = sellerPubKey
            self._kwhAmountBuy = kwhAmountBuy
            self._buyWritedate = buyWritedate
            self._counterpartID = counterpartID
            self._buyerPubKey = buyerPubKey

    @property
    def operation(self):
        return self._operation

    # Sell attributes

    @property
    def kwhAmountSell(self):
        return self._kwhAmountSell

    @property
    def pricePerKwh(self):
        return self._pricePerKwh

    @property
    def createWritedate(self):
        return self._createWritedate

    @property
    def validWritedate(self):
        return self._validWritedate

    @property
    def elementID(self):
        return self._elementID

    @property
    def sellerPubKey(self):
        return self._sellerPubKey

    # Buy attributes

    @property
    def kwhAmountBuy(self):
        return self._kwhAmountBuy

    @property
    def buyWritedate(self):
        return self._buyWritedate

    @property
    def counterpartID(self):
            return self._counterpartID

    @property
    def buyerPubKey(self):
            return self._buyerPubKey
