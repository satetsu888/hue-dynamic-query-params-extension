function set(params){

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

function load(index){
    var saved_params = _load_saved_params();

    if(saved_params.length <= index){
        index = 0;
    }

    return jsyaml.dump(saved_params[index]);
}

function save(params){
    var saved_params = _load_saved_params();
    saved_params.push(params);
    localStorage['saved_params'] = JSON.stringify(saved_params);
}

function _load_saved_params(){
    var storage_data = localStorage['saved_params'];
    var saved_params;
    if(storage_data === undefined){
        saved_params = new Array();
    } else {
        saved_params = JSON.parse(storage_data);
    }
    return saved_params;
}

function parse_yaml(yaml){
    return jsyaml.load(yaml);
}

$("#set_button").click(
    function(){
        var params = parse_yaml($("#data")[0].value);
        set(params);
        save(params);
    }
);

$("#load_button").click(
    function(){
        $("#data")[0].value = load(0);
    }
);

