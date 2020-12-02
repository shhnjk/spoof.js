// .scriptrun C:\windbg\spoof.js
host.diagnostics.debugLog("***> Starting spoof.js :) \n");

// Set these to an empty string if you don't want to modify the origin/URL.
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

	if (target_host != "") {
		var origin = returnAddress("dx @$scriptContents.host.currentThread.Stack.Frames[0].LocalVariables.this[0].security_context_.security_origin_.Ptr[0].host_.Impl", "AsciiText", ":", 2, 14);
		ctl.ExecuteCommand('ea ' + origin + ' "' + target_host + '"');
	}

	if (target_url != "") {
		var url = returnAddress("dx @$scriptContents.host.currentThread.Stack.Frames[0].LocalVariables.this[0].document_.Raw[0].url_.string_.Impl", "AsciiText", ":", 2, 14);
		ctl.ExecuteCommand('ea ' + url + ' "' + target_url + '"');
	}

	ctl.ExecuteCommand('g');
}

function invokeScript(){
	var ctl = host.namespace.Debugger.Utility.Control;
	ctl.ExecuteCommand('bp chrome!blink::DOMWindow::length "dx Debugger.State.Scripts.spoof.Contents.spoof()";g');
}
