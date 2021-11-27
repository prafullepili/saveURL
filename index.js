let myLeads = []
const inputEl = document.getElementById("input-el") //url input
const urlForm = document.getElementById("url-form") //url input
const ulEl = document.getElementById("ul-el") //url list

const inputBtn = document.getElementById("input-btn") // save from input
const tabBtn = document.getElementById("tab-btn") // save from current tab
const deleteBtn = document.getElementById("delete-btn") //delete all


const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads")) //Convert str to array

if (leadsFromLocalStorage) {
    myLeads = leadsFromLocalStorage
    render(myLeads)
}

//save from current tab
tabBtn.addEventListener("click", function(){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        myLeads.push(tabs[0].url);
        localStorage.setItem("myLeads", JSON.stringify(myLeads) );
        render(myLeads);
    })
})

//render all url from localStorage to ul
function render(leads) {
    let listItems = ""
    for (let i = 0; i < leads.length; i++) {
        listItems += `
            <li>
                <a target='_blank' href='${leads[i]}'>
                    ${leads[i]}
                </a>
            </li>
        `
    }
    ulEl.innerHTML = listItems
}
//delete all record
deleteBtn.addEventListener("click", function() {
    if (myLeads.length != 0){
        let Yes = confirm("Do you want to delete all?");
        if (Yes){
            localStorage.clear()
            myLeads = []
            render(myLeads)
        }
    }
})

//save from input box
urlForm.addEventListener("submit", function(e) {
    e.preventDefault();
    if (urlForm.value != ""){
        myLeads.push(inputEl.value)
        inputEl.value = ""
        localStorage.setItem("myLeads", JSON.stringify(myLeads) )
        render(myLeads)
    }
})