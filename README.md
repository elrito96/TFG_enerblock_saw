# Version 1.0:

## Installation guide:

(Technical note: This guide will instruct you to install and deploy the project in a Linux based OS with command lines, but it might be possible to deploy in a Windows OS system of you have the technical knowledge)

In order to install and deploy this project you will need the following pre-requisites:
- Linux based OS
- Docker version 17.03.1-ce or greater
- Docker Compose version 1.9.0 or greater
- Python 3
- Git

First you will need to pull the git repository into your local repository. 

<h3>Directory Tree</h3><p>
	<a href="./">./</a><br>
	├── <a href=".//client/">client</a><br>
	│   ├── <a href=".//client/Dockerfile">Dockerfile</a><br>
	│   └── <a href=".//client/public/">public</a><br>
	│   &nbsp;&nbsp;&nbsp; ├── <a href=".//client/public/dist/">dist</a><br>
	│   &nbsp;&nbsp;&nbsp; │   └── <a href=".//client/public/dist/bundle.js">bundle.js</a><br>
	│   &nbsp;&nbsp;&nbsp; ├── <a href=".//client/public/favicon.png">favicon.png</a><br>
	│   &nbsp;&nbsp;&nbsp; ├── <a href=".//client/public/index.html">index.html</a><br>
	│   &nbsp;&nbsp;&nbsp; ├── <a href=".//client/public/keys">keys</a><br>
	│   &nbsp;&nbsp;&nbsp; ├── <a href=".//client/public/reloadbundle.sh">reloadbundle.sh</a><br>
	│   &nbsp;&nbsp;&nbsp; ├── <a href=".//client/public/src/">src</a><br>
	│   &nbsp;&nbsp;&nbsp; │   ├── <a href=".//client/public/src/app.js">app.js</a><br>
	│   &nbsp;&nbsp;&nbsp; │   ├── <a href=".//client/public/src/main.js">main.js</a><br>
	│   &nbsp;&nbsp;&nbsp; │   └── <a href=".//client/public/src/state.js">state.js</a><br>
    │   &nbsp;&nbsp;&nbsp; ├── <a href=".//client/public/node_modeules/">node_modules</a><br>
	│   &nbsp;&nbsp;&nbsp; └── <a href=".//client/public/update_web.sh">update_web.sh</a><br>
	├── <a href=".//docker-compose.yaml">docker-compose.yaml</a><br>
	├── <a href=".//gitpush.sh">gitpush.sh</a><br>
	├── <a href=".//processor/">processor</a><br>
	│   ├── <a href=".//processor/Dockerfile">Dockerfile</a><br>
	│   ├── <a href=".//processor/enerblock_processor/">enerblock_processor</a><br>
	│   │   ├── <a href=".//processor/enerblock_processor/enerblock_payload.py">enerblock_payload.py</a><br>
	│   │   ├── <a href=".//processor/enerblock_processor/enerblock_state.py">enerblock_state.py</a><br>
	│   │   ├── <a href=".//processor/enerblock_processor/handler.py">handler.py</a><br>
	│   │   ├── <a href=".//processor/enerblock_processor/main.py">main.py</a><br>
	│   │   └── <a href=".//processor/enerblock_processor/__pycache__/">__pycache__</a><br>
	│   │   &nbsp;&nbsp;&nbsp; ├── <a href=".//processor/enerblock_processor/__pycache__/enerblock_payload.cpython-35.pyc">enerblock_payload.cpython-35.pyc</a><br>
	│   │   &nbsp;&nbsp;&nbsp; ├── <a href=".//processor/enerblock_processor/__pycache__/enerblock_state.cpython-35.pyc">enerblock_state.cpython-35.pyc</a><br>
	│   │   &nbsp;&nbsp;&nbsp; ├── <a href=".//processor/enerblock_processor/__pycache__/handler.cpython-35.pyc">handler.cpython-35.pyc</a><br>
	│   │   &nbsp;&nbsp;&nbsp; └── <a href=".//processor/enerblock_processor/__pycache__/main.cpython-35.pyc">main.cpython-35.pyc</a><br>
	│   ├── <a href=".//processor/enerblock-tp">enerblock-tp</a><br>
	│   └── <a href=".//processor/start_tp.sh">start_tp.sh</a><br>
	└── <a href=".//README.md">README.md</a><br>


8 directories, 26 files

(Note: I will not display the contents in the folder ./client/public/node_modules as it is a directory full of modules used for utility
and necessity, and will only matter if you want to add something to the project)

On the root folder we will have the 2 main folders in the project: The client and the transaction processor. There're also other files like this
README, a small shell script to push the changes to the git and the docker-compose.yalm file. The purpose of this last file is to build
and deploy the majority of the project services in Docker containers. To be specific, it will deploy a Sawtooth validator and the settings
transaction processor. These 2 elements are necessary in any Sawtooth node. It will also build a container for the Sawtooth API, that will allow us
to create new transactions and to query the ledger. This element is optional in a Sawtooth node, but a node that only exists would be too
boring. Finally, there will be a container for the web client plus a proxy server that will permit the client to access the API as it would
be in "localhost". (Might explain this later)

To mount these containers use the following command in the same directory where is the .yalm file:

`docker-compose up`

The console will show some verbose information about the elements being created. If it's the first time this command is executed, the validator
will create the genesis block of the blockchain with id:0. This block will contain some on-chain configuration settings. Later on you can make a
Propose action to change this configuration (Like PoET target wait time or max transactions per block), and the rest of the participants will
make a Vote action, accepting or rejecting the Propose. This allows some configuration over the blockchain without having to actually stop it.

Once this is done, you will have to start the enerblock transaction processor, made specifically for our application.

Open a new terminal, ove into the ./processor folder and execute:

`./start_tp.sh`

This bash shell will start the python transaction processor, that will be linked to the validator and will handle the transactions of our
application. Also, you should see a new message in the console where we executed the docker-compose comand similar to:

`sawtooth-validator   | [2019-07-30 11:56:47.381 INFO     processor_handlers] registered transaction processor: connection_id=4fe3..., family=enerblock, version=1.0, namespaces=['5a45ce']`

This indicates that our transaction processor was correctly registered to our Sawtooth validator and is ready to work.

Having these 2(5) elements up and running, you just have to open your browser and write the address http://localhost:8000/ to use the application.

## Developer guide:

¿?

