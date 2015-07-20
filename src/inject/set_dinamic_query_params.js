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

function set_param_skelton(element){

    chrome.tabs.executeScript(null,{
        file: "js/jquery.min.js"
    }, function(){
        chrome.tabs.executeScript(null,{
            code: "var param_names=new Array();$('#execute-parameter-selection form fieldset .control-group').each(function(index, element){var param_name=element.children[0].innerText;param_names.push(param_name);}); param_names;"
        }, function(result){
           element.value = _create_skelton_params(result[0]);
        });
    });
}

function load(index){
    var saved_params = _load_saved_params();

    if(index === undefined || saved_params.length <= index){
        index = saved_params.length - 1;
    }

    if(index >= 0){
        return jsyaml.dump(saved_params[index]);
    } else {
        return '';
    }
}

function _create_skelton_params(param_names){
    var obj = new Object();
    for(var name of param_names){
        obj[name] = '';
    };
    return jsyaml.dump(obj);
}

function save_temporary(params){
    var saved_params = _load_saved_params();
    saved_params[saved_params.length - 1] = params;
    localStorage['saved_params'] = JSON.stringify(saved_params);
}

function save_as_new(params){
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
        save_as_new(params);
    }
);

$("#data").keyup(
    function(e){
        var params = parse_yaml($("#data")[0].value);
        save_temporary(params);
    }
);

(function(){
    var default_data = load();
    if(default_data === ''){
        set_param_skelton($("#data")[0]);
    } else {
        $("#data")[0].value = load();
    }
})()

