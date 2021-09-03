/*jshint esversion: 6 */

class MakeRequest {
    constructor() {
        this.xmlHTTP = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
    }

    doGet(url, callback) {
        this.xmlHTTP.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    callback(this.responseText, this.status, this.statusText);
                } else {
                    root.innerHTML = this.createErrorPage(this.status, this.statusText);
                }
            }
        };
        this.xmlHTTP.open("GET", url, true);
        this.xmlHTTP.send();
    }

    doPost(url, callback) {
        this.xmlHTTP.onreadystatechange = function() {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    callback(this.responseText, this.status, this.statusText);
                } else {
                    root.innerHTML = this.createErrorPage(this.status, this.statusText);
                }
            }
        };
        this.xmlHTTP.open("POST", url, true);
        this.xmlHTTP.send();
    }

    createErrorPage(status, statusText) {
        const rootDiv = document.createElement('div');
        const div = document.createElement('div');
        div.style.position = 'fixed';
        div.style.top = '50%';
        div.style.right = 0;
        div.style.bottom = 0;
        div.style.left = 0;
        div.style.transform = 'translateY(-50%)';
        div.style.display = 'flex';
        div.style.flexDirection = 'column';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
    
        const h1 = document.createElement('h1');
        const h4 = document.createElement('h4');
        h1.style.marginBottom = 0;
        h4.style.marginTop = 0;
        h1.innerHTML = '<b>'+status+'</b>';
        h4.innerHTML = '<b>'+statusText+'</b>.';
    
        div.appendChild(h1);
        div.appendChild(h4);
    
        rootDiv.appendChild(div);
    
        return rootDiv.innerHTML;
    }
}

class MakeRouting {
    constructor () {
        this.routes = [];
    }

    setRootPage() {
        var url = window.location.hash.slice(1) || "/";
        const tabItems = root.querySelectorAll('.tab-item');
        tabItems.forEach(elt => {
            const tab = elt.getAttribute(dTabRouting).trim();
            if (url == tab) {
                const elementActive = elt.parentElement.querySelector('.tab-item.active');
                if (elementActive) {
                    elementActive.classList.remove('active');
                }
                elt.classList.add('active');
            }
        });
        this.navigate(url, root);
    }

    route(url, template) {
        const route = {
            url: url,
            params: {},
            location: './views/' + template + '.html'
        };
        this.routes.push(route);
    }

    checkURL(path) {
        if (this.routes && this.routes instanceof Array) {
            const route = this.routes.find((elt) => {
                if (elt.url == path) {
                    return true;
                }
            });
            if (route) {
                return route;
            }
            throw new Error('This Route Is Not Defined In const Routes.');
        }
        throw new Error('Const Routes Not Defined Or Invalid Declaration.');
    }

    navigate(url) {
        const route = this.checkURL(url);
        window.history.pushState({}, 'newUrl', '#' + url);
    
        Req.doGet(route.location, (response) => {
            const responseDocument = document.createElement('div');
            responseDocument.innerHTML = response;
            const outlets = root.querySelectorAll('*['+outletName+']');
            for (let i = 0; i < outlets.length; i++) {
                const elt = outlets.item(i);
                const name = elt.getAttribute(outletName).trim();
                const newDocumentElement = responseDocument.querySelector('outlet[name="'+ name +'"]');
                if(newDocumentElement) {
                    elt.innerHTML = newDocumentElement.innerHTML;
                    superLoader(elt);
                } else {
                    elt.innerHTML = null;
                }
            }
        });
        return true;
    }
}

class MakeTranslation {
    constructor () {
        this.translates = [];
        this.default = localStorage.getItem('default') || 'en';
        this.locale = localStorage.getItem('locale') || 'fr';
    }

    translate(origin, source) {
        return this.translates.find(text => {
            if (text) {
                
            }
        });
    }
}
