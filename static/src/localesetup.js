export function getBrowserLanguage() {
    // detect browser language (compatible with Chrome, Firefox, Safari and IE10+)
    var userLang = window.navigator.languages ? window.navigator.languages[0] : null;
        userLang = userLang || window.navigator.language || window.navigator.browserLanguage || window.navigator.userLanguage;
    if (userLang.indexOf('-') !== -1)
        userLang = userLang.split('-')[0];
    
    if (userLang.indexOf('_') !== -1)
        userLang = userLang.split('_')[0];
    // url parameter for lang?
    // set language
    var re = new RegExp("^es.*");
    var userLocale = "es"
    if (re.test(userLang)) {
        userLocale = "es";
    } else if (userLang === "ca") {
        userLocale = "ca";
    } else {
        userLocale = "en";
    }

    console.log(userLocale);
    return userLocale;
}

export function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}
