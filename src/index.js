import './sass/main.scss';
import template from './templates/index.hbs';
import base from '../webpack/_base.js';

const images = base.importAll(require.context('./img', false, /\.(png|jpe?g|svg)$/));

const root = document.querySelector('#root');
root.innerHTML = template({
    templateContent: {
    	filterPlaceholderLeft: 'Начните вводить имя друга',
    	filterPlaceholderRight: 'Название',
    }
});