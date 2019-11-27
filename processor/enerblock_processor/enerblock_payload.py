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
        if operation not in ('putOnSale', 'buy'):
            raise InvalidTransaction('Invalid operation: {}'.format(operation))

        #Common section
        kwhAmountSell = data.get('kwhAmountSell')
        pricePerKwh = data.get('pricePerKwh')
        createWritedate = data.get('createWritedate')
        validWritedate = data.get('validWritedate')
        saleName = data.get('saleName')

        # Sell section
        if operation == 'putOnSale':
            LOGGER.info('Entra if operation putonsale')
            sellerPubKey = transactionCreator

            if not sellerPubKey:
                raise InvalidTransaction('A seller is required to sell')

            self._sellerPubKey = sellerPubKey

            #Validate that the amount to sell is not null, or anything different from a positive int
            if not kwhAmountSell:
                raise InvalidTransaction('Amount to sell is required')
            if not kwhAmountSell.isdigit() or kwhAmountSell == "0":
                raise InvalidTransaction('Amount to sell must be a positive integer number')

            #Validate that the amount to sell is not null, or anything different from a positive decimal
            if not pricePerKwh:
                raise InvalidTransaction('Price per kwh is required')
            if not pricePerKwh.replace('.','',1).isdigit():
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

            if not saleName:
                raise InvalidTransaction('Sale id (saleName) is required')

            self._operation = operation
            self._kwhAmountSell = kwhAmountSell
            self._pricePerKwh = pricePerKwh
            self._createWritedate = createWritedate
            self._validWritedate = validWritedate
            self._saleName = saleName

        # Buy section
        elif operation == "buy":
            sellerPubKey = data.get('sellerPubKey')
            kwhAmountBuy = data.get('kwhAmountBuy')
            buyWritedate = data.get('buyWritedate')
            saleName = data.get('saleName')
            buyName = data.get('buyName')
            buyerPubKey = transactionCreator

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
            if not saleName:
                raise InvalidTransaction('Sale id (saleName) required to buy')
            if not buyName:
                raise InvalidTransaction('Buy id (buyName) required to buy')
            if not buyerPubKey:
                raise InvalidTransaction('A buyer is required to buy')

            self._operation = operation
            self._kwhAmountSell = kwhAmountSell
            self._pricePerKwh = pricePerKwh
            self._createWritedate = createWritedate
            self._validWritedate = validWritedate
            self._saleName = saleName
            self._sellerPubKey = sellerPubKey
            self._kwhAmountBuy = kwhAmountBuy
            self._buyWritedate = buyWritedate
            self._buyName = buyName
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
    def saleName(self):
        return self._saleName

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
    def buyName(self):
            return self._buyName

    @property
    def buyerPubKey(self):
            return self._buyerPubKey
