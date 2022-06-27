# A budget manager web application made with the MEVN stack

## Prerequisites

* [Node.js](https://nodejs.org/en/) ( >=14.*)
* [npm](https://www.npmjs.com/get-npm) version 3+  
  and [Git](https://git-scm.com).

## Installation

git clone https://github.com/LeonardDeletre/budget-manager  
cd budget-manager/server  
sudo npm install  
cd ../client  
sudo npm install --legacy-peer-deps (unfortunately there are vulnerabilities that we don't know how to fix)

## Usage

Be in the server folder  
npm run dev (it will start both server and client)  
Go to http://localhost:8080

## Features 

Account creation and authentication  
Recording of cash inflows and outflows  
Visualize this data through graphs, tables and text  

## Security

Login's/register's forms are sanitized  
Users' passwords are encrypted in DB  

## Possible improvements

Using HTTPS to mitigate man-in-the-middle attack  
Transactions encryption in DB  
Transactions' forms checking alike login's/register's forms  
Solve dependencies vulnerabilities  
Be able to create incomplete transactions -> Modify transactions' informations later on  
Fill in savings objectives  
More charts  
 


## Credits

Thanks to Sai Deepesh for his MEVN stack tutorial (https://signoz.io/blog/mevn-stack-tutorial/)  

Thanks to Epicmax for their Vue Admin template (https://github.com/epicmaxco/vuestic-admin)
