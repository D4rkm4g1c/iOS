if (ObjC.available) {
    // === JailMonkey methods ===
    var JailMonkey = ObjC.classes.JailMonkey;
    if (JailMonkey) {
        [
            'isJailBroken',
            'canViolateSandbox',
            'isDebugged',
            'canFork',
            'checkPaths',
            'checkDyLibs',
            'checkSymLinks',
            'checkPathsMessage',
            'checkDyLibsMessage',
            'checkSymLinksMessage',
            'jaiBrokenMessage'
        ].forEach(function(method) {
            if (JailMonkey[method]) {
                Interceptor.attach(JailMonkey[method].implementation, {
                    onLeave: function(retval) {
                        console.log('[Bypass] JailMonkey.' + method + '() -> false');
                        retval.replace(0); // false/NO
                    }
                });
            }
        });
    }

    // === DetectFrida methods ===
    var DetectFrida = ObjC.classes.DetectFrida;
    if (DetectFrida) {
        if (DetectFrida['isJailBroken']) {
            Interceptor.attach(DetectFrida['isJailBroken'].implementation, {
                onLeave: function(retval) {
                    console.log('[Bypass] DetectFrida.isJailBroken() -> false');
                    retval.replace(0);
                }
            });
        }
        // If there are other methods, add them here
    }

    // === JailBrokenHelper methods ===
    var JailBrokenHelper = ObjC.classes.JailBrokenHelper;
    if (JailBrokenHelper) {
        [
            'hasCydiaInstalled',
            'hasUndecimusInstalled',
            'hasSileoInstalled',
            'hasZbraInstalled',
            'isContainsSuspiciousApps',
            'isContainsSuspiciousSystemPathsExists',
            'canEditSystemFiles',
            'checkDYLD',
            'checkSuspiciousObjCClasses'
        ].forEach(function(method) {
            if (JailBrokenHelper[method]) {
                Interceptor.attach(JailBrokenHelper[method].implementation, {
                    onLeave: function(retval) {
                        console.log('[Bypass] JailBrokenHelper.' + method + '() -> false');
                        retval.replace(0);
                    }
                });
            }
        });
    }

    console.log("Jailbreak/Frida detection bypass hooks installed!");
} else {
    console.log("Objective-C runtime is not available!");
}
