export default function(e) {
    let className = e.target.classList;
    let action = '';
    let userId;

    if (className.contains('add-user')) {
        action = 'add-user';
    }

    if (className.contains('remove-user')) {
        action = 'remove-user';
    }

    return {
        id: e.target.parentNode.getAttribute('data-user-id'),
        action
    }
}