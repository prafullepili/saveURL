Password = ()=> {
    let date = new Date();
    let hm = `${date.getHours() < 10 ?'0':''}${date.getHours()}${date.getMinutes()<10?'0':''}${date.getMinutes()}`
    return hm
}
let saveURLpublic = []
let saveURLprivate = []
let passCheck = false

const inputEl = document.getElementById("input-el") //url input
const urlForm = document.getElementById("url-form") //url input
const ulEl = document.getElementById("ul-el") //url list

const inputBtn = document.getElementById("input-btn") // save from input
const tabBtn = document.getElementById("tab-btn") // save from current tab
const deleteBtn = document.getElementById("delete-btn") //delete all
const privateCbox = document.getElementById("private") //private checkbox


function loadLocalStorage() {
    if (passCheck){
       saveURLprivate =  JSON.parse(localStorage.getItem("urlPrivate")) || []
       render(saveURLprivate)
    }
    else{
        saveURLpublic =  JSON.parse(localStorage.getItem("urlPublic")) || []
        render(saveURLpublic)
    }
}
loadLocalStorage()

//render all url from localStorage to ul
function render(urlsArray) {
    let listItems = ""
    for (let i = 0; i < urlsArray.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${urlsArray[i]}'>
                    ${urlsArray[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}

// If no url found
function noLeads(leads){
    if (leads){
        ulEl.innerHTML = "<li class='notFound'>No save URL</li>"
    }
}

// Delete All fucniotn 
function deleteAll(storageArray,key) {
    console.log(storageArray)
    if (storageArray.length != 0){
        let Yes = confirm(`Do you want to delete all ${passCheck ? 'Private' : 'Public'} urls?`);
        if (Yes){
            storageArray = []
            localStorage.removeItem(key);
            render(storageArray)
            noLeads(storageArray);
        }
    }
}

// save url from input box
function saveUrl(storageArray,key) {
    storageArray.push(inputEl.value)
    inputEl.value = ""
    localStorage.setItem(key, JSON.stringify(storageArray))
    render(storageArray)
}

//save form current tab
function saveUrlFromTab(storageArray,key) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        storageArray.push(tabs[0].url);
        localStorage.setItem(key, JSON.stringify(saveURLpublic) );
        render(storageArray);
    })
}

// On click private this will set password
function setPassword(pass){ 
    let password = CryptoJS.MD5(pass).toString();
    localStorage.setItem('upass',password);
}

// Check password
function checkPassword(pass){
    passFromLocalStorage = localStorage.getItem("upass")
    if (passFromLocalStorage === CryptoJS.MD5(pass).toString()){
        return true
    }
    else{
        return false
    }
}




//save from input box
urlForm.addEventListener("submit", function(e) {
    e.preventDefault();
    if (inputEl.value != ""){
        if (passCheck){
            saveUrl(saveURLprivate,"urlPrivate")
        }else{
            saveUrl(saveURLpublic,"urlPublic")
        }
    }
})

//save from current tab
tabBtn.addEventListener("click", function(){
    if (passCheck){
        saveUrlFromTab(saveURLprivate,"urlPrivate")
    }else{
        saveUrlFromTab(saveURLpublic,"urlPublic")
    }
})


//change mode public to private
privateCbox.addEventListener("change",()=>{
    if (privateCbox.checked){
        setPassword(Password());
        let getPass = prompt("Enter your password: ");
        if (!getPass){
            privateCbox.checked = false;
        }else{
            passCheck = checkPassword(getPass);
            if (passCheck){
                loadLocalStorage()
                render(saveURLprivate)
            }else{
                privateCbox.checked = false;
                alert("Your password is wrong!");
                passCheck = false;
                loadLocalStorage()
                render(saveURLpublic)
            }
        }
    }else { 
        passCheck = false;
        loadLocalStorage()
        render(saveURLpublic)
    }
})

//delete all record
deleteBtn.addEventListener("click", function() {
    if (passCheck){    
        loadLocalStorage()
        deleteAll(saveURLprivate,"urlPrivate")
    }else{
        loadLocalStorage()
        deleteAll(saveURLpublic,"urlPublic")
    }
})
