# How to operate and customize your own chatbot
I highly recommend cloning this repository to your own personal github account so that you can make changes to your own bot at will and save those changes!

## Setup
To begin: 
1. Create your own linux VM and clone this repository into your machine
  - You can download a free VMWare Workstation player from here: [VMware Workstation 15.0.2 Player for Windows 64-bit Operating Systems.](https://my.vmware.com/en/web/vmware/free#desktop_end_user_computing/vmware_workstation_player/15_0)
  - You can download a free linux operating system from Ubuntu's Desktop link found on there website and provided here: [Ubuntu Desktop version 18.04 LTS](https://www.ubuntu.com/download/desktop/thank-you?version=18.04.1&architecture=amd64)
  - The command to clone this repo is `git clone https://github.com/efwoods/VTA.git`
2. Install the ibmcloud CLI 
  - [Instructions are found here](https://console.bluemix.net/docs/cli/reference/ibmcloud/download_cli.html#install_use)
3. Login to your bluemix account
  - Type `bluemix login --sso` for a single sign on
  - Target cloud foundry with `bluemix target --cf`

## Adding & Changing Services
To add new services or change existing services
1. Create the service through bluemix.net
2. Identify the Service credtials from bluemix.net : these are either the service apikey or the username and password for the service
3. Add these service credentials appropriately into the .env file using the .env file as a template
  - Note the .env file is hidden on your linux local machine after cloning, but you can still edit this file by using `your_favorite_editor .env`
 4. Declare these services in manifest.yml  under the `declared-services` and `applications` fields
   - Note you can use the current declaration of services in `manifest.yml` as a template for adding new services
   - Note `manifest.yml` is commented for your ease of use
 5. If you are adding a service that is not listed as a Cloud Foundry service on bluemix.net then you will need to create a connection to this service by clicking on `create connection` in bluemix.net after selecting your cloud foundry app
  - Note you will need to create the cloud foundry app first then connect new services which are not cloud foundry services afterward 
 6. If you are adding new functionality to your app in the back end with new services, make sure to add these services in `app.js`

## Changing the Front End


## Changing the Back End

## Update Cloud Foundry with this repository
1. `cd` to the directory of this repository
  - Note that this location on your local machine will be where you cloned this repository using the command `git clone https://github.com/efwoods/VTA.git`
2. Push the app to cloud foundry
  - The command is `bluemix cf push`
    - Note the cf must be targeted before a push
  - [Instructions for pushing this app can be found here](https://console.bluemix.net/docs/runtimes/nodejs/getting-started.html#getting-started)

## How SSH into to cf app
You can SSH into the cf app with the command `bluemix cf ssh NAME_OF_APP`
  - If you are working with this VTA, the NAME_OF_APP is VTA
  - Note if a user is idling or actively using on the website, you will not be able to ssh or download log files
  - Note if you SSH before a user idles or actively uses the website, then you can leave your SSH session running idle without interfering with the user's activity

## How to download log usage data 
You can download log usage data to your local machine by using `bluemix cf ssh NAME_OF_APP -c "cat app/log_file_name" >> your_local_log_file.txt` from your local machine
  - Note you can run this command periodically with a cronjob and new data will be appended to the log file
  - The format of the log is as follows:
    - Time since UNIX epoch 
    - a blank line
    - The JSON output of the VTA usage for that time
    - a blank line

## How to view the size of files in MB
You can view file sizes in linux using `ls -l --block-size=M`

