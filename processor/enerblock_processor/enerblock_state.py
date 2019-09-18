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

import hashlib
import json
import logging


LOGGER = logging.getLogger(__name__)

# In this cas it is 5a45ce
ENERBLOCK_NAMESPACE = hashlib.sha512(
    'enerblock'.encode('utf-8')).hexdigest()[0:6]


def _get_address(key):
    return hashlib.sha512(key.encode('utf-8')).hexdigest()[:62]

''' Addreses in our application will be generated as follows:
    - First 3 bytes will be the application namespace (ENERBLOCK_NAMEPSACE / 5a45ce)
    - Next byte will specify which resource is stored (00 for a sale, 01 for a buy)
    - Final 31 bytes are the first 62 characters of a SHA-512 hash of the asset UUID.

    For example, the address of a sale with the saleName = "d72c9225-630d-496b-8378-11bcc23f403c"
    will be:
    5a45ce + 00 + hashlib.sha512('d72c9225-630d-496b-8378-11bcc23f403c'.encode('utf-8')).hexdigest()[:62]
    Resulting in :
    5a45ce 00 78f560930f69a6a71a1ab812a8fa9e82eed9e46237523003848678a29bdebb
'''
def _get_sale_address(saleName):
    return ENERBLOCK_NAMESPACE + '00' + _get_address(saleName)

''' Example of a buy, similar to previous address but changing the byte after namespace to 01
    The address of a buy with the buyName = "c9fcffcf-4fec-49e6-b7dc-af9d3ee9d029"
    will be:
    5a45ce 01 7ac7f892633c5b59a7ceef056ba05823d920fe3ef172015670ccd8f3103b69
'''
def _get_buy_address(buyName):
    return ENERBLOCK_NAMESPACE + '01' + _get_address(buyName)


def _deserialize(data):
    return json.loads(data.decode('utf-8'))


def _serialize(data):
    return json.dumps(data, sort_keys=True).encode('utf-8')


class EnerblockState(object):

    TIMEOUT = 3

    def __init__(self, context):
        print("__init__ state ")
        self._context = context


    def get_sale(self, name):
        return self._get_state(_get_sale_address(name))

    def get_buy(self, name):
        return self._get_state(_get_buy_address(name))

    def set_sale(self, operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey):
        address = _get_sale_address(saleName)
        print("./state set_sale address = "+address)
        state_data = _serialize(
            {
                "operation": operation,
                "kwhAmountSell": kwhAmountSell,
                "pricePerKwh": pricePerKwh,
                "createWritedate": createWritedate,
                "validWritedate": validWritedate,
                "saleName": saleName,
                "sellerPubKey": sellerPubKey
            })
        return self._context.set_state(
            {address: state_data}, timeout=self.TIMEOUT)

    def set_buy(self, operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, kwhAmountBuy, buyWritedate, buyName, buyerPubKey):
        address = _get_transfer_address(name)
        state_data = _serialize(
            {
                "operation": operation,
                "kwhAmountSell": kwhAmountSell,
                "pricePerKwh": pricePerKwh,
                "createWritedate": createWritedate,
                "validWritedate": validWritedate,
                "saleName": saleName,
                "sellerPubKey": sellerPubKey,
                "kwhAmountBuy": kwhAmountBuy,
                "buyWritedate": buyWritedate,
                "buyName": buyName,
                "buyerPubKey": buyerPubKey
            })
        return self._context.set_state(
            {address: state_data}, timeout=self.TIMEOUT)



    ''' Maybe you can't delete your sale offers, or at least after someone has bought it
    TODO: Only permit delete when no one has bought (and maybe while it's still valid, as we would like keep a history of everything)
    '''

    '''Another option is to delete a sale ALWAYS after someone has bought it, which might make sense.
    TODO: Still need to implement the creation of a new sale when the buyer does not buy all of the energy.
	IMPORTANT FROM THIS TODO ^^^: When you buy from someone you have 2 possibilities:
	1- Buy all of the sale: You create a buy transaction, create a buy state (with the amount sold and bought being the same and 
		other fields, and finally you MODIFY the sale state, changing the amount to sell to 0.
	2- Buy some of the sale: You create a buy transaction, create a buy state (with the amount sold and bought and
		other fields, and finally you MODIFY the sale state, changing the amount to sell to the difference, so other
		participants can still buy it (The dates of creaton and validity stay the same, and all the transactions are recorded.
	Let's say for example, Prosumer A sells 100. Consumer B buys 10, so he creates a transaction of buy, sends to validator,
	transaction processor, this one makes a buy state, saying he had 100 and you bought 10, MODIFIES current sale state, changing
	the 100 to 90, end. Consumer C sees the system and 90 are on sale, decides to buy 50, same than with Consumer B, does
	the same and changes the sale state from 90 to 40 ...
    '''

    def delete_sell(self, saleName):
        return self._context.delete_state(
            [_get_transfer_address(salleName)],
            timeout=self.TIMEOUT)

    def _get_state(self, address):
        state_entries = self._context.get_state(
            [address], timeout=self.TIMEOUT)
        if state_entries:
            entry = _deserialize(data=state_entries[0].data)
        else:
            entry = None
        return entry

    ''' TODO: Modify sale, you can change the amount, price and valid writedate of your sale if:
    - It's still valid (Time is between original creation writedate and valid writedate)
    The creation writedate will be updated with the current time of the modification, up to the seller
    to update the valid writedate too '''
