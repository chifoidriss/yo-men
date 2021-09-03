/*jshint esversion: 6 */

var title = 'Bamendjo';
var currentDate = new Date();
var viewMonth = [];
var todayDay;
var findDay;

Router.route('/', 'home');
Router.route('/compte', 'compte');
Router.route('/aide', 'aide');
Router.route('/aide/[id]/[name]', 'aide');
Router.route('/connexion', 'login');

var text = [
    {
        fr: 'Veuillez choisir une date',
        en: 'Please choose any date',
    },
    {
        fr: 'Accueil',
        en: 'Home',
    },
    {
        fr: 'Aide',
        en: 'Help',
    },
    {
        fr: 'Langue',
        en: 'Language',
    },
    {
        fr: 'Calendrier',
        en: 'Calendar',
    },
    {
        fr: 'Enregistrer',
        en: 'Save',
    }
];

/*
|    Class Calendar Goba
*/

class CalendarGoba {
    constructor() {
        this.lang = localStorage.getItem('lang') || 'fr';
        this.calendar = localStorage.getItem('calendar') || 'bamendjo';
    }

    getDay(date) {
        const REF_DATE = new Date('1970-01-07');
        const nbJours = date.getTime() - REF_DATE.getTime();
        return Math.ceil(nbJours/(1000*60*60*24)) % 8;
    }

    jour(index) {
        const GOBA_JOURS = {
            bamendjo: [
                'Katꭏꭏ',
                'KapϽt',
                'Mɛtàgŋouɛ',
                'Tsuír',
                'PϽ`buoh',
                'MϽ`tà',
                'Chûgŋouɛh',
                'Djɛula`a'
            ]
        };

        return GOBA_JOURS[this.calendar][index];
    }

    semaine(index) {
        const _JOURS = {
            fr: [
                'Dimanche',
                'Lundi',
                'Mardi',
                'Mercredi',
                'Jeudi',
                'Vendredi',
                'Samedi'
            ],
            en: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ]
        };

        return _JOURS[this.lang][index];
    }

    mois(index) {
        const _MOIS = {
            fr: [
                'Janvier',
                'Février',
                'Mars',
                'Avril',
                'Mai',
                'Juin',
                'Juillet',
                'Août',
                'Septembre',
                'Octobre',
                'Novembre',
                'Décembre'
            ],
            en: [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ]
        };

        return _MOIS[this.lang][index];
    }

    nbJourMois(month, year) {
        return new Date(year, month+1, 0).getDate();
    }
}

const Goba = new CalendarGoba();


function getTodayDay(){
    var date = new Date();
    var tmp = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    const element = {
        id: date.getDate(),
        date: Goba.getDay(tmp),
        jour: Goba.jour(Goba.getDay(tmp)),
        semaine: Goba.semaine(tmp.getDay()),
        mois: Goba.mois(tmp.getMonth()),
        year: tmp.getFullYear()
    };
    return element;
}

function onChangeMonth(val) {
    var currentMonth = currentDate.getMonth();
    currentDate.setMonth(currentMonth+val);
    setViewMonth(currentDate);

    setState();
}

function onChangeYear(val) {
    var currentYear = currentDate.getFullYear();
    currentDate.setFullYear(currentYear+val);
    setViewMonth(currentDate);

    setState();
}

function setViewMonth(date) {
    viewMonth = [];
    title = Goba.mois(date.getMonth()) +' '+ date.getFullYear();
    const nb = Goba.nbJourMois(date.getMonth(), date.getFullYear());
    for (var i = 1; i <= nb; i++) {
        var tmp = new Date(date.getFullYear(),date.getMonth(),i);
        const element = {
            id: i,
            date: Goba.getDay(tmp),
            jour: Goba.jour(Goba.getDay(tmp)),
            semaineNum: tmp.getDay(),
            semaine: Goba.semaine(tmp.getDay()),
        };
        viewMonth.push(element);
    }
}

function findDate(value){
    var date = new Date(value);
    var tmp = new Date(date.getFullYear(),date.getMonth(),date.getDate());
    const element = {
        id: date.getDate(),
        date: Goba.getDay(tmp),
        jour: Goba.jour(Goba.getDay(tmp)),
        semaine: Goba.semaine(tmp.getDay()),
        mois: Goba.mois(tmp.getMonth()),
        year: tmp.getFullYear()
    };
    findDay = element;
    setState();
}

todayDay = getTodayDay();
findDay = getTodayDay();
setViewMonth(currentDate);


function updateApp() {
    const lang = document.querySelector('input[name=lang]:checked').value;
    const calendar = document.getElementById('calendar').value;

    localStorage.setItem('lang', lang);
    localStorage.setItem('calendar', calendar);
    window.location.reload();
}