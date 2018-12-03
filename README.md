# How to operate and customize your own chatbot!

## Setup
To begin: 
1. Create your own linux VM and clone this repository into your machine
2. Install the ibmcloud CLI 
  - [Instructions are found here](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use)
3. Login to your bluemix account
  - Type `bluemix login --sso` for a single sign on
  - Target cloud foundry with `bluemix target --cf`

## Changing the Front End
In order to add or change services, edit the manifest.yml file. This file has been commented for ease of use.

## Changing the Back End

## Update Cloud Foundry with this repository
1. `cd` to the directory of this repository
  - Note that this location on your local machine will be where you cloned this repository using the command `git clone ...efwoods/VTA`
2. Push the app to cloud foundry
  - The command is `bluemix cf push`
    - Note the cf must be targeted before a push
  - [Instructions for pushing this app can be found here](https://console.bluemix.net/docs/runtimes/nodejs/getting-started.html#getting-started)


