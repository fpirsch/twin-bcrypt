/* jshint browser: true */
/* global TwinBcrypt */

var buttons = document.getElementsByTagName('button');
buttons[0].onclick = clickButton;
buttons[1].onclick = clickButton;
buttons[2].onclick = clickButton;

document.getElementById('version').textContent = 'v' + TwinBcrypt.version;

function clickButton(event) {
    var button = event.target,
        row = button.parentNode,
        action;

    if (row.hasAttribute('data-computing')) action = reset;
    else if (row.getElementsByTagName('select').length === 1) action = hash;
    else action = compare;

    action(row, button);
    event.preventDefault();
}


function reset(row, button) {
    button.textContent = button.getAttribute('data-label');
    row.removeAttribute('data-computing');
}


function hash(row, button) {
    var password = row.getElementsByTagName('input')[0].value,
        select = row.getElementsByTagName('select')[0],
        cost = +select.options[select.selectedIndex].text,
        progressBar = row.getElementsByTagName('progress')[0],
        resultContainer = row.getElementsByTagName('samp')[0];

    button.textContent = 'Stop it !';
    row.setAttribute('data-computing', 1);
    resultContainer.textContent = 'Click to hash.';

    TwinBcrypt.hash(
        password,
        cost,
        // Progress
        function(p) {
            // Check the stopping flag.
            if (!row.hasAttribute('data-computing')) {
                progressBar.value = 0;
                return false;
            }
            progressBar.value = p;
        },
        // End
        function(result) {
            resultContainer.textContent = result;
            reset(row, button);
        }
    );
}


function compare(row, button) {
    var password = row.getElementsByTagName('input')[0].value,
        hash = row.getElementsByTagName('input')[1].value,
        progressBar = row.getElementsByTagName('progress')[0],
        formGroup = row.getElementsByClassName('form-group')[0],
        icon = row.getElementsByClassName('glyphicon')[0];

    button.textContent = 'Stop it !';
    row.setAttribute('data-computing', 1);
    formGroup.classList.remove('has-error');
    formGroup.classList.remove('has-success');
    icon.classList.remove('glyphicon-remove');
    icon.classList.remove('glyphicon-ok');

    TwinBcrypt.compare(
        password,
        hash,
        // Progress
        function(p) {
            // Check the stopping flag.
            if (!row.hasAttribute('data-computing')) {
                progressBar.value = 0;
                return false;
            }
            progressBar.value = p;
        },
        // End
        function(result) {
            reset(row, button);
            if (result) {
                formGroup.classList.add('has-success');
                icon.classList.add('glyphicon-ok');
            }
            else {
                formGroup.classList.add('has-error');
                icon.classList.add('glyphicon-remove');
            }
        }
    );
}
