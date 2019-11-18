# Version 1.1:

## Installation guide:

(Technical note: This guide will instruct you to install and deploy the project in a Linux based OS with command lines, but it might be possible to deploy in a Windows OS system of you have the technical knowledge)

In order to install and deploy this project you will need the following pre-requisites:
- Docker version 17.03.1-ce or greater
- Docker Compose version 1.9.0 or greater
- Git

(This guide will assume you are using a Linux based OS)

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
	│   &nbsp;&nbsp;&nbsp; │   ├── <a href=".//client/public/src/main.js">main.js</a><br>
	│   &nbsp;&nbsp;&nbsp; │   └── <a href=".//client/public/src/state.js">state.js</a><br>
    │   &nbsp;&nbsp;&nbsp; └──  <a href=".//client/public/node_modeules/">node_modules</a><br>
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
	│   └── <a href=".//processor/enerblock-tp">enerblock-tp</a><br>
	└── <a href=".//README.md">README.md</a><br>


8 directories, 21 files

(Note: I will not display the contents in the folder ./client/public/node_modules as it is a directory full of modules used for utility
and necessity, and will only matter if you want to add something to the project)

On the root folder we will have the 2 main folders in the project: The client and the transaction processor. There're also other files like this
README, a simple shell script to push the changes to the git and the docker-compose.yalm file. The purpose of this last file is to build
and deploy all of the project services in Docker containers. To be specific, it will deploy:

- A Sawtooth validator.
- The settings transaction processor.
- The Sawtooth API .
- A web client.
- Our transaction processor.

The first 2 elements are necessary in any Sawtooth node. The container for the Sawtooth API will allow us to add new transactions to the blockchain and to query the ledger. This element is optional in a Sawtooth node, but a node that only exists and validates would be too
boring. The container for the web client will also run a proxy server that will permit the client to access the API as it would
be in "localhost". This is necessary due to Sawtooth not supporting CORS. Finally, the last container will run our transaction processor service.

Before anything you must go to the client/proxy Dockerfile in /client/Dockerfile and change the ip in lines 6 and 7 so you have something like :

`ProxyPass /api http://localhost:8008\n\
ProxyPassReverse /api http://localhost:8008\n\`

Changing localhost for the ip of your pc in your local network.

After this, you are good to mount the containers using the following command in the same directory where is the .yalm file:

`docker-compose up`

The console will show some verbose information about the elements being created. If it's the first time this command is executed, Docker will create a new network and the validator
will create the genesis block of the blockchain with id:0. This block will contain some on-chain configuration settings. Later on you can make a
Propose action to change this configuration (Like PoET target wait time or max transactions per block), and the rest of the participants will
make a Vote action, accepting or rejecting the Propose. This allows some configuration over the blockchain without having to actually stop it.

At some point, a message similar to this will appear in the console:

`sawtooth-validator   | [2019-07-30 11:56:47.381 INFO     processor_handlers] registered transaction processor: connection_id=4fe3..., family=enerblock, version=1.0, namespaces=['5a45ce']`

This indicates that our transaction processor was correctly registered to our Sawtooth validator and is ready to work.

Having these 5 elements up and running, you just have to open your browser and write the address http://localhost:8000/ to use the application.

## Developer guide:

- If any change is made in the proyect, you will need to execute the gitpsush.sh with 1 argument that will be the comment of the commit.

- Any change in the javascript files of the client (main.js or state.js) will need you to execute the reloadbundle.sh in the client/public directory, which will read all the js used in the client and add them to the bundle.js in the /client/public/dist directory. These js files will be both the main.js and state.js written for this project, and the node modules. The browser will only load the bundle.js file (which contains everything).

- Any other type of change will only require you to reload the docker-compose file.

- If at any moment you wish to reset all the content in the blockchain, you only need to execute the <b>'docker-compose down'</b> command in the same directory as the .yaml file. This will delete the network and the containers.

- Python does not generate pycache folder due to permission problems.
