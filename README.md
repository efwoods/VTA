# How to operate and customize your own chatbot

[Spark Presentation](https://spark.adobe.com/page/0rb3uasESYE0F/)

[VTA Accounting Demo](https://www.acct2020.com:8000)

I highly recommend cloning this repository to your own personal github account so that you can make changes to your own bot at will and save those changes!
  - Note: 
    - These chatbots can be modified simply for any purpose. To do so, create your own assistant dialogue and update the assistant service in the repository. Feel free to give the bot a new look by changing the front end! This is all that is required for the creation of a unique bot. 
     - It is anticipated that a new assistant service and dialogue tree will be created for a unique chatbot and that the front end will be modified to give the unique chatbot a unique look and feel
     
## Expected pipeline
### Initialization
1. Setup
2. Changing and Adding Services ( if creating new assistant, discovery, and NLU services) 
3. Changing the Assistant Dialogue Tree (to create a new chatbot dialogue)
4. Changing the Front End (to change the appearance of your chatbot)
5. Updating Cloud Foundry and Pushing the app (to host the bot on cloud foundry)

### After initialization
- Visit the chatbot at the website provided through the bluemix.net cloud foundry application
- run a cronjob to download log usage data
- (opt) parse usage data for usage visualization and user insight

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
You can change the look and feel of your chatbot on the website by making changes to `app.css` which is located in the folder `~/VTA/public/css`
  - Note `app.css` is commented for ease-of-use

## Changing the Back End
You can change the functionality of your chatbot by making changes to `app.js`. `app.js` is located in the folder `~/VTA`.
- Note the process of creating new functionality is optional and complex. By reading the following notes you can find a deeper understanding of how the services interface with the backend script, `app.js`
- `app.js` will first initialize all services based on the declaration of these services in the `.env` file.
- Beginning on line 123 the body of the input will be parsed for regular expressions
- The `payload` is the variable which holds the user input and returns output to the front end of the chatbot 
- The Backend works in tandem with the assistant service. 
  - To select a function inside of `app.js` such as listing topics when a user asks "What can I ask?" you must first set a context variable inside the assistant dialogue such that the variable `data.context.action.lookup` is set to a value that triggers the if-else statements beginning on line 271
   - action context variables can be set with the following in your assistant service inside a dialogue node: `variable: action value: {"lookup":"list_topics","append_response":true}
   - in the above example, changing "list_topics" to any constant located on line 64 to 66 will enter a new function inside the if statement on line 271.
   - You can add new else statements to the if statement on lin 271 to create your own functionality of the back end. This functionality is driven by the user input on the front end into the assistant dialogue tree which will map to an intent which sets a context variable. This context variable is added to the payload automatically and sent to the backend where the if statement on lin 271 is triggered which triggers the desired function.
   - The context actions are cleared on line 559 and the payload context action is cleared on line 562
   - It is critical when adding your own function to send the data back to the front end using `callback(null, data)`
- Logging is implemented beginning on line 186
- Note Spellchecking requires the following:
  1. uncommenting line 37 of `app.js`, 
  2. installing the proper node modules (using nodehun), 
  3. making the proper edits in `Analyze_Sentence_for_Errors.js`, 
  4. uncommenting the block comment from 216 to 228
  5. uncommenting line 240
  6. updating `package.json` to include nodehun.
  - This functionality when enabled will allow for spellchecking of user input and will display possible alternatives to misspelled words if any are detected. 
  - For simplicity, this functionality has been disabled.

## Changing the Assistant Dialogue Tree
Please view the Assistant Tutorial located here: [Assistant Tutorial](https://github.com/efwoods/Tutorials/blob/master/Assistant.md) 

## Changing the Discovery Service
Please view the Discovery Tutorial located here: [Discovery Tutorial](https://github.com/efwoods/Tutorials/blob/master/Watson-Discovery/Watson-Discovery-GUI(Tooling).md)

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

