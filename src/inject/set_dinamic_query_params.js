function set(yaml){
    var params = jsyaml.load(yaml);

    chrome.tabs.executeScript(null,{
        code:"var data =" + JSON.stringify(params),
    }, function(){
        chrome.tabs.executeScript(null,{
            file: "js/jquery.min.js"
        }, function(){
            chrome.tabs.executeScript(null,{
                code: "$('#execute-parameter-selection form fieldset .control-group').each(function(index, element){var param_name=element.children[0].innerText;var text_input=element.children[1].children[0]; text_input.value=data[param_name];var e=new KeyboardEvent('keydown'); text_input.dispatchEvent(e);})"
            });
        });
    });

}

$("#set_button").click(
    function(){
        set($("#data")[0].value)
    }
);

