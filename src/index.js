import './sass/main.scss';
import template from './templates/index.hbs';
import base from '../webpack/_base.js';
import listener from './js/listener.js';
import checkParentData from './js/checkParentData.js';

const images = base.importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

const root = document.querySelector('#root');


function render(value) {
    root.innerHTML = template(value);
};


function offset(elt) {
    var rect = elt.getBoundingClientRect(),
        bodyElt = document.body;

    return {
        top: rect.top + bodyElt.scrollTop,
        left: rect.left + bodyElt.scrollLeft
    }
}


let _data = {
    templateContent: {
        filterPlaceholderLeft: 'Начните вводить имя друга',
        filterPlaceholderRight: 'Название',
    },
    users: [{
            name: 'Виктор',
            id: 0
        },
        {
            name: 'Павел',
            id: 1
        },
        {
            name: 'Гриша',
            id: 2
        }
    ],
    usersAdd: [

    ]
}


function changeList(userId, action) {
    let listFirst = action == 'add-user' ? 'users' : 'usersAdd';
    let listSecond = action == 'add-user' ? 'usersAdd' : 'users';

    _data[listFirst] = _data[listFirst].filter(user => {
        if (user.id == userId) {
            _data[listSecond].push(user);
            return false;
        } else {
            return true;
        }
    });
    render(_data);
}


// Слушатель клика
listener('click', e => {
    let userElementData = checkParentData(e);
    if (userElementData.id) {
        changeList(userElementData.id, userElementData.action);
    };
});


// Слушатель перетаскивания
// listener('dragend', e => {
//     console.log(e.dataTransfer);
// })

listener('dragend', e => {
    let userElementData = checkParentData(e);
    let rightCol = document.querySelector('.right-col');

    if (e.x > offset(rightCol).left) {
        changeList(e.target.getAttribute('data-user-id'), 'add-user');
    } else {
        changeList(e.target.getAttribute('data-user-id'), 'remove-user');
    }
})



render(_data);