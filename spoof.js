// .scriptrun C:\windbg\spoof.js
host.diagnostics.debugLog("***> Starting \spoof.js :) \n");

var target_url = "https://www.google.com";
var target_host = "www.google.com";

function returnAddress(command, include, search, padding, length){
	var ctl = host.namespace.Debugger.Utility.Control;
	var output = ctl.ExecuteCommand(command);
	for (var line of output){
        	//host.diagnostics.debugLog("***> " + line + "\n");
		if(line.includes(include)){
			host.diagnostics.debugLog("***> " + line + "\n");
			//host.diagnostics.debugLog("***> search: " + search + "\n");
			var n = line.search(search);
			return line.substr(n + padding, length);
		}
	}
}

function spoof(){
	host.diagnostics.debugLog("***> spoof!!! \n");
	
	var ctl = host.namespace.Debugger.Utility.Control;
	var origin = returnAddress("dx @$scriptContents.host.currentThread.Stack.Frames[0].LocalVariables.this[0].document_.Raw[0].security_origin_.Ptr[0].host_.Impl", "AsciiText", ":", 2, 14);
	var url = returnAddress("dx @$scriptContents.host.currentThread.Stack.Frames[0].LocalVariables.this[0].document_.Raw[0].url_.string_.Impl", "AsciiText", ":", 2, 14);

	ctl.ExecuteCommand('ea ' + origin + ' "' + target_host + '"');
	ctl.ExecuteCommand('ea ' + url + ' "' + target_url + '";g');
}

function invokeScript(){
	var ctl = host.namespace.Debugger.Utility.Control;
	ctl.ExecuteCommand('bp chrome_child!blink::DOMWindow::length "dx Debugger.State.Scripts.spoof.Contents.spoof()";g');
}
