/*jshint esversion: 6 */

const httpRequest = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
const root = document.body.querySelector('#root');
const z = root.getElementsByTagName("*");

const prefix = '#';
const dRepeat = prefix + 'repeat';
const dIf = prefix + 'if';
const dClass = prefix + 'class';
const dIfR = prefix + '*if';
const dClassR = prefix + '*class';
const dModel = prefix + 'model';
const dInclude = prefix + 'include';
const dRouting = prefix + 'link';
const dTabRouting = prefix + 'tab';
const outletName = '_outlet';
const DOpenDrawer = prefix + 'openDrawer';
const DCloseDrawer = prefix + 'closeDrawer';
const DOpenModal = prefix + 'openModal';
const DCloseModal = prefix + 'closeModal';

const extensionFile = '.html';
const viewsFolder = './';

const NODES = [];
const ROUTES = [];
const TRANSLATES = [];


function hIfRepeat(elementRef) {
    var elements = elementRef.getElementsByTagName("*");
    for (var i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.hasAttribute(dIfR)) {
            const attribute = element.getAttribute(dIfR);
            const varName = attribute.split('.').shift();
            var properties = attribute.split('.');
            properties.shift();
            properties = properties.join('.');

            const output = eval('try{JSON.parse('+varName+').'+properties+'}catch(e){'+varName+'.'+properties+'}');
            if (!output)
                element.remove();
            else
                element.removeAttribute(dIfR);
        }
    }
}

function repeatLoader(elementRef) {
    var elements = elementRef.getElementsByTagName("*");
    const element = elementRef;
    const regex = /\[\[[ ]*\$+([a-zA-Z_]+[\w$\.'"()]*)[ ]*\]\]/mg;

    element.innerHTML = element.innerHTML.replace(regex, function (match, $1) {
        return eval($1);
    });

    element.innerHTML = element.innerHTML.replace(/#\$if[ ]*\(([\w$\. '"()=-]+)\)(\s*.*)#end\$if/mg, function (match, $1, $2) {
        console.log(match);
        if (eval($1)) {
            return $2;
        } else {
            return '';
        }
    });

    for (var i = 0; i < elements.length; i++) {
        const element = elements[i];
        if (element.hasAttribute(dIfR)) {
            const attribute = element.getAttribute(dIfR);
            const varName = attribute.split('.').shift();
            var properties = attribute.split('.');
            properties.shift();
            properties = properties.join('.');

            const output = eval('try{JSON.parse('+varName+').'+properties+'}catch(e){'+varName+'.'+properties+'}');
            if (!output)
                element.remove();
            else
                element.removeAttribute(dIfR);
        }
    }
}

function hClassRepeat(elementRef) {
    var elements = elementRef.getElementsByTagName("*");

    for (var i = 0; i < elements.length; i++) {
        const element = elements[i];
        console.log(element);

        if (element.hasAttribute(dClassR)) {
            const attribute = element.getAttribute(dClassR);

            // const output = eval('' + attribute);
            // window['classes'] = attribute;
            // console.log(window['classes']);
            console.log(attribute);
        }
    }
}

function interpolationRepeat(elementRef) {
    const element = elementRef;
    const regex = /\[\[[ ]*\$+([a-zA-Z_]+[\w$\.'"()]*)[ ]*\]\]/mg;

    element.innerHTML = element.innerHTML.replace(regex, function (match, $1) {
        return eval($1);
    });
}


function superLoader(elementRef) {
    const htmlElement = elementRef || root;
    const htmlElements = htmlElement.getElementsByTagName('*');

    htmlElement.innerHTML = htmlElement.innerHTML.replace(/#if[ ]*\(([\w$\. '"()=-]+)\)(\s*.*)#endif/mg, function (match, $1, $2) {
        console.log(match);
        if (eval($1)) {
            return $2;
        } else {
            return '';
        }
    });

    // Remove comments elements
    htmlElement.innerHTML = htmlElement.innerHTML.replace(/<!--(.*)-->/mg, function (match) {
        return '';
    });

    // Interpolation variables
    const regex = /\[\[[ ]*([a-zA-Z_]+[\w$\.'"()]*)[ ]*\]\]/mg;
    htmlElement.innerHTML = htmlElement.innerHTML.replace(regex, function (match, $1) {
        addNode($1, match);
        return '<out _state="'+$1+'">'+eval($1)+'</out>';
        // return '<out _state="'+$1+'">'+window[$1]+'</out>';
    });

    for (var i = 0; i < htmlElements.length; i++) {
        const element = htmlElements[i];

        if (element.hasAttribute(dRepeat)) {
            const parent = element.parentElement;
            const attribut = element.getAttribute(dRepeat).trim();

            const locale = attribut.split('in',2)[0].trim();
            const objet = attribut.split('in',2)[1].trim();

            addNode(objet, parent.innerHTML);

            window[objet].forEach(elt => {
                window[locale] = elt;

                const enfant = element.cloneNode(true);
                enfant.removeAttribute(dRepeat);
                parent.insertBefore(enfant, element);
                // interpolationRepeat(enfant);
                // hIfRepeat(enfant);
                repeatLoader(enfant);
                delete window[locale];
            });
            parent.setAttribute('_state', objet);
            element.remove();
        }

        if (element.hasAttribute(dIf)) {
            const attribute = element.getAttribute(dIf).trim();
            if (!eval(attribute))
                element.remove();
            else
                element.removeAttribute(dIf);
        }

        if (element.hasAttribute(dClass)) {
            const attribute = element.getAttribute(dClass).trim();
            if (!eval(attribute))
                element.remove();
            else
                element.removeAttribute(dClass);
        }

        if (element.hasAttribute(dInclude)) {
            const file = element.getAttribute(dInclude).trim();

            doGet(file+extensionFile, response => {
                element.innerHTML = response;
                return superLoader(element);
            });
            element.removeAttribute(dInclude);
        }

        if (element.hasAttribute(dRouting)) {
            const attribute = element.getAttribute(dRouting).trim();
            const newUrl = window.location.host + '/#' + attribute;

            element.setAttribute('href', newUrl);

            element.addEventListener('click', event => {
                event.preventDefault();
                navigate(attribute);
            });
            element.removeAttribute(dRouting);
        }

        if (element.hasAttribute(dTabRouting)) {
            const attribute = element.getAttribute(dTabRouting).trim();

            element.addEventListener('click', function (event) {
                event.preventDefault();
                if (!element.classList.contains('active')) {
                    navigate(attribute, htmlElement);
                    const elementActive = element.parentElement.querySelector('.tab-item.active');
                    elementActive.classList.remove('active');
                    element.classList.add('active');
                }
            });
            element.removeAttribute(dTabRouting);
        }

        if (element.hasAttribute(dModel)) {
            const attribute = element.getAttribute(dModel).trim();
            element.value = eval(attribute);

            if (element.nodeName == 'select') {
                element.addEventListener('change', function (event) {
                    const stringVar = attribute+'="'+this.value+'"';
                    eval(stringVar);
                    
                    const allOccurrences = htmlElement.querySelectorAll('out[_state="'+attribute+'"]');
                    allOccurrences.forEach(elt => {
                        elt.innerHTML = eval(attribute);
                    });
                    element.removeAttribute(dModel);
                });
            } else {
                element.addEventListener('keyup', function (event) {
                    const stringVar = attribute+'="'+this.value+'"';
                    eval(stringVar);
                    
                    const allOccurrences = htmlElement.querySelectorAll('out[_state="'+attribute+'"]');
                    allOccurrences.forEach(elt => {
                        elt.innerHTML = eval(attribute);
                    });
                    element.removeAttribute(dModel);
                });
            }
        }
        
        if (element.hasAttribute(DOpenDrawer)) {
            const attribute = element.getAttribute(DOpenDrawer);
            element.addEventListener('click', (event) => {
                event.preventDefault();
                openDrawer(attribute);
            });
            element.removeAttribute(DOpenDrawer);
        }

        if (element.hasAttribute(DCloseDrawer)) {
            const attribute = element.getAttribute(DCloseDrawer);
            element.addEventListener('click', (event) => {
                event.preventDefault();
                closeDrawer(attribute);
            });
            element.removeAttribute(DCloseDrawer);
        }

        if (element.hasAttribute(DOpenModal)) {
            const attribute = element.getAttribute(DOpenModal);
            element.addEventListener('click', (event) => {
                event.preventDefault();
                openModal(attribute);
            });
            element.removeAttribute(DOpenModal);
        }

        if (element.hasAttribute(DCloseModal)) {
            const attribute = element.getAttribute(DCloseModal);
            element.addEventListener('click', (event) => {
                event.preventDefault();
                closeModal(attribute);
            });
            element.removeAttribute(DCloseModal);
        }
    }

    return htmlElement;
}

function createErrorPage(status, statusText) {
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

function route(url, template) {
    const route = {
        url: url,
        params: {},
        location: './views/' + template + '.html'
    };
    ROUTES.push(route);
}

function checkURL(path) {
    if (ROUTES && ROUTES instanceof Array) {
        const route = ROUTES.find((elt) => {
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

function setRootPage() {
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
    navigate(url, root);
}

function navigate(url) {
    const route = checkURL(url);
    history.pushState({}, 'newUrl', '#' + url);

    doGet(route.location, (response) => {
        const responseDocument = document.createElement('div');
        responseDocument.innerHTML = response;
        const outlets = root.querySelectorAll('*['+outletName+']');
        for (let i = 0; i < outlets.length; i++) {
            const elt = outlets.item(i);
            const name = elt.getAttribute(outletName).trim();
            const newDocumentElement = responseDocument.querySelector('outlet[name="'+ name +'"]');
            // nodes.fill(null);
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

function doGet(url, callback) {
    httpRequest.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                callback(this.responseText, this.status, this.statusText);
            } else {
                root.innerHTML = createErrorPage(this.status, this.statusText);
            }
        }
    };
    httpRequest.open("GET", url, true);
    httpRequest.send();
}


window.onload = () => {
    splashScreen();
    setRootPage();
    startApp();
    overlayEffect();
};

function splashScreen() {
    const splash = document.getElementById('splash-screen');
    if (splash) {   
        splash.remove();
    }
}

function overlayEffect() {
    var overlay = document.createElement('div');
    overlay.classList.add('app-overlay');
    overlay.addEventListener('click', (e) => {
        e.preventDefault();
        closeDrawer();
        closeModal();
    });
    root.prepend(overlay);
}

function openDrawer(drawer) {
    let appDrawer;
    let appOverlay = document.querySelector('.app-overlay');
    appOverlay.classList.add('visible');
    if (drawer) {
        appDrawer = document.querySelector('.app-drawer[_drawer="' + drawer + '"]');
    } else {
        appDrawer = document.querySelector('.app-drawer');
    }
    if (appDrawer) {
        appDrawer.classList.add('open');
    }
}
function closeDrawer(drawer) {
    let appDrawer;
    let appOverlay = document.querySelector('.app-overlay');
    appOverlay.classList.remove('visible');
    if (drawer) {
        appDrawer = document.querySelectorAll('.app-drawer[_drawer="' + drawer + '"]');
    } else {
        appDrawer = document.querySelectorAll('.app-drawer');
    }
    appDrawer.forEach(elt => {
        elt.classList.remove('open');
    });
}

function openModal(modal) {
    let appModal;
    let appOverlay = document.querySelector('.app-overlay');
    appOverlay.classList.add('visible');
    if (modal) {
        appModal = document.querySelector('.app-modal[_modal="' + modal + '"]');
    } else {
        appModal = document.querySelector('.app-modal');
    }
    if (appModal) {
        appModal.classList.add('open');
    }
}
function closeModal(modal) {
    let appModal;
    let appOverlay = document.querySelector('.app-overlay');
    appOverlay.classList.remove('visible');
    if (modal) {
        appModal = document.querySelectorAll('.app-modal[_modal="' + modal + '"]');
    } else {
        appModal = document.querySelectorAll('.app-modal');
    }
    appModal.forEach(elt => {
        elt.classList.remove('open');
    });
}

function startApp() {
    try {
        superLoader();
    } catch (error) {
        var errorOutput = error.stack.replace(/[\w]+:\/\/[\w$\.'":\/?#%&~!@^-_+*<>`]+/mg, function (match) {
            return '<a href="'+match+'">'+match+'</a>';
        });
        errorOutput = errorOutput.replace(/( at )([\w]*)/mg, function (match, $1, $2) {
            return '<br>'+ $1 + '<b>'+$2+'</b>';
        });
        const rootDiv = document.createElement('div');
        const doc = document.createElement('div');
        doc.style.position = "fixed";
        doc.style.left = 0;
        doc.style.right = 0;
        doc.style.top = 0;
        doc.style.padding = '10px';
        doc.innerHTML = '<h2>'+error.name+'</h2><h4>'+error.message+'</h4><hr><p>'+errorOutput+'</p>';
    
        rootDiv.appendChild(doc);
        root.innerHTML = rootDiv.innerHTML;
        console.error(error.stack);
    }
}

function addNode(varName, nodeElement) {
    const exist = NODES.findIndex(find => {
        if (find.varName == varName && nodeElement.length == find.node.length) {
            return true;
        }
    });
    if (exist == -1) {
        const objectNode = {
            varName: varName,
            node: nodeElement
        };
        NODES.push(objectNode);
    }
}
function getNode(varName) {
    return NODES.find(find => {
        if (find.varName == varName) {
            return true;
        }
    });
}

function setState() {
    console.log(NODES);
    const elements = document.querySelectorAll('*[_state]');
    elements.forEach(element => {
        var varName = element.getAttribute('_state');
        const node = getNode(varName);

        if (node) {
            const div = document.createElement('div');
            div.innerHTML = node.node;
            const output = superLoader(div);
            element.innerHTML = output.innerHTML;
        }
    });
}

function translate(origin, source) {
    
}
function __(text) {
    
}