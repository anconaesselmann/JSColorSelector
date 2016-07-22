

/***********************************************
	Resource: app/jsUiElements/ColorSelectorMain.js
***********************************************/



function createSandBox() {
    var main    = document.getElementById('main');
    var sandBox = document.createElement('div');
    sandBox.id  = "sandbox";
    main.appendChild(sandBox);
    return sandBox;
}

function uiColorSelectorMain() {
    var sandBox = createSandBox();
    var display = document.createElement('p');
    display.id  = "display";
    sandbox.appendChild(display);

    var onChangeCallback = function(r, g, b) {
        display.innerHTML = "red: " + r + ", green: " + g + ", blue: " + b;
    }

    var colorSelector = new RgbColorSelector(50,100,200, onChangeCallback);
    colorSelector.draw(sandBox);
}


window.onload = uiColorSelectorMain;
