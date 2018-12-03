# How to operate and customize your own chatbot

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

## Changing the Front End
In order to add or change services, edit the manifest.yml file. This file has been commented for ease of use.

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

