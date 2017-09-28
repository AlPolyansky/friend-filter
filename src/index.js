import './sass/main.scss';
import template from './templates/index.hbs';
import usersTemplate from './templates/allFriend.hbs';
import base from '../webpack/_base.js';
import listener from './js/listener.js';
import checkParentData from './js/checkParentData.js';

const images = base.importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

const root = document.querySelector('#root');





function render(value) {
    root.innerHTML = template(value);
};

function isMatching(full, chunk) {
    full = '' + full;
    chunk = '' + chunk;

    let a = '' + full.toLowerCase();
    let b = '' + chunk.toLowerCase();

    return a.indexOf(b) < 0 ? false : true;
}


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
    users: [],
    usersAdd: [

    ],
    leftFilterValue: '',
    rightFilterValue: '',
}


function changeList(userId, action) {
    let listFirst = action == 'add-user' ? 'users' : 'usersAdd';
    let listSecond = action == 'add-user' ? 'usersAdd' : 'users';

    _data[listFirst] = _data[listFirst].filter(user => {
        if (user.id == userId) {
            _data[listSecond].unshift(user);
            return false;
        } else {
            return true;
        }
    });
    render(_data);
}


function setCookie(cookieName, cookieVal) {
    document.cookie = `${cookieName}=${cookieVal}`;
}



function api(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, data => {
            if (data.error) {
                reject(new Error(data.error.error_msg))
            } else {
                resolve(data.response);
            }
        });
    });
};

const promise = new Promise((resolve, reject) => {
    VK.init({
        apiId: 5267932
    });
    VK.Auth.login(function(response) {
        if (response.session) {
            resolve(response);
        } else {
            reject(new Error('Не удалось авторизоваться '));
        }
    }, 8);
});

promise
    .then(() => {
        return api('users.get', { v: 5.68, name_case: 'gen' });
    })
    .then(data => {


        return api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_100' })
    })
    .then(data => {
        let local = localStorage.getItem('vk-filter');
        if (local) {
            let parse = JSON.parse(local);
            _data.users = parse.users;
            _data.usersAdd = parse.usersAdd;
        } else {
            _data.users = data.items;
        }
        render(_data);
    })


// Слушатель клика
listener('click', e => {
    let userElementData = checkParentData(e);
    if (userElementData.id) {
        changeList(userElementData.id, userElementData.action);
    };

    if (e.target.classList.contains('button--save')) {
        let json = JSON.stringify(_data);

        localStorage.setItem('vk-filter', json);
    }
});


// Слушатель перетаскивания



listener('dragend', e => {
    let userElementData = checkParentData(e);
    let rightCol = document.querySelector('.right-col');

    if (e.x > offset(rightCol).left) {
        changeList(e.target.getAttribute('data-user-id'), 'add-user');
    } else {
        changeList(e.target.getAttribute('data-user-id'), 'remove-user');
    }
})


// Слушатель фильтра

listener('keyup', e => {

    if (e.target.classList.contains('field__input')) {
        if (e.target.classList.contains('filter-all-users')) {
            _data.leftFilterValue = e.target.value;
            let users;
            users = _data.users.filter(user => {
                let fullName = user.first_name + ' ' + user.last_name;

                return isMatching(fullName, e.target.value);
            });
            document.querySelector('.left-col .list').innerHTML = usersTemplate({
                users
            });
        }

        if (e.target.classList.contains('filter-add-users')) {
            _data.rightFilterValue = e.target.value;
            let users;
            users = _data.usersAdd.filter(user => {
                let fullName = user.first_name + ' ' + user.last_name;

                return isMatching(fullName, e.target.value);
            });
            document.querySelector('.right-col .list').innerHTML = usersTemplate({
                users
            });
        }
    }
});