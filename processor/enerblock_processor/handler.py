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

from sawtooth_sdk.processor.handler import TransactionHandler
from sawtooth_sdk.processor.exceptions import InvalidTransaction

from enerblock_processor.enerblock_payload import EnerblockPayload
from enerblock_processor.enerblock_state import EnerblockState
from enerblock_processor.enerblock_state import ENERBLOCK_NAMESPACE


LOGGER = logging.getLogger(__name__)


class EnerblockTransactionHandler(TransactionHandler):

    @property
    def family_name(self):
        return 'enerblock'

    @property
    def family_versions(self):
        return ['1.0']

    @property
    def encodings(self):
        return ['application/json']

    @property
    def namespaces(self):
        return [ENERBLOCK_NAMESPACE]

    def apply(self, transaction, context):
        print("apply")
        header = transaction.header
        signer = header.signer_public_key
        payload = EnerblockPayload(transaction.payload, signer)
        state = EnerblockState(context)

        LOGGER.info('Handling transaction: Name: %s, Operation: %s , Amount: %s, Price %s',
                    payload.saleName,
                    payload.operation,
                    payload.kwhAmountSell,
                    payload.pricePerKwh)
        print("Handler after getting the payload and state, will create sale")
        if payload.operation == 'putOnSale':
            _create_sale(operation = payload.operation,
                         kwhAmountSell = payload.kwhAmountSell,
                         pricePerKwh = payload.pricePerKwh,
                         createWritedate = payload.createWritedate,
                         validWritedate = payload.validWritedate,
                         saleName = payload.saleName,
                         sellerPubKey = signer,
                         state=state)

        elif payload.operation == 'buy':
            _create_buy(operation = payload.operation,
                        kwhAmountSell = payload.kwhAmountSell,
                        pricePerKwh = payload.pricePerKwh,
                        createWritedate = payload.createWritedate,
                        validWritedate = payload.validWritedate,
                        saleName = payload.saleName,
                        sellerPubKey = payload.sellerPubKey,
                        kwhAmountBuy = payload.kwhAmountBuy,
                        buyWritedate = payload.buyWritedate,
                        buyName = payload.buyName,
                        buyerPubKey = signer,
                        state=state)

        else:
            raise InvalidTransaction('Unhandled action: {}'.format(
                payload.action))


def _create_sale(operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, state):
    if state.get_sale(saleName) is not None:
        raise InvalidTransaction(
            'Invalid action: This sell already exists: {}'.format(saleName))
    print("Set sale id: "+saleName)
    state.set_sale(operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey)


def _create_buy(operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, kwhAmountBuy, buyWritedate, buyName, buyerPubKey, state):
    if state.get_asset(saleName) is not None:
        raise InvalidTransaction(
            'Invalid action: This buy already exists: {}'.format(buyName))

    state.set_buy(operation, kwhAmountSell, pricePerKwh, createWritedate, validWritedate, saleName, sellerPubKey, kwhAmountBuy, buyWritedate, buyName, buyerPubKey)


'''
def _transfer_asset(asset, owner, signer, state):
    asset_data = state.get_asset(asset)
    if asset_data is None:
        raise InvalidTransaction('Asset does not exist')

    if signer != asset_data.get('owner'):
        raise InvalidTransaction('Only an Asset\'s owner may transfer it')

    state.set_transfer(asset, owner)


def _accept_transfer(asset, signer, state):
    transfer_data = state.get_transfer(asset)
    if transfer_data is None:
        raise InvalidTransaction('Asset is not being transfered')

    if signer != transfer_data.get('owner'):
        raise InvalidTransaction(
            'Transfers can only be accepted by the new owner')

    state.set_asset(asset, transfer_data.get('owner'))
    state.delete_transfer(asset)


def _reject_transfer(asset, signer, state):
    transfer_data = state.get_transfer(asset)
    if transfer_data is None:
        raise InvalidTransaction('Asset is not being transfered')

    if signer != transfer_data.get('owner'):
        raise InvalidTransaction(
            'Transfers can only be rejected by the potential new owner')

    state.delete_transfer(asset)
    '''
