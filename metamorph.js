(function() {
    'use strict';

    var imidz = new Image(),
        defaultSaveAs = 'scaled.jpg',
        MAX_WIDTH = 600,
        MAX_HEIGHT = MAX_WIDTH;

    function dimensions(width, height) {
        var ratio = Math.min((width || MAX_WIDTH) / imidz.width, (height || MAX_HEIGHT) / imidz.height);

        return { width: imidz.width * ratio, height: imidz.height * ratio };
    }

    function paint(width, height) {
        var dims = dimensions(Math.min(width, MAX_WIDTH), Math.min(height, MAX_HEIGHT));

        var canvas = document.getElementById('canvas'),
            ctx = canvas.getContext('2d');

        ctx.clearRect(0, 0, MAX_WIDTH, MAX_HEIGHT);
        ctx.drawImage(imidz, (MAX_WIDTH - dims.width) / 2, (MAX_HEIGHT - dims.height) / 2, dims.width, dims.height);
    }

    imidz.onerror = function (evt) {
        setTimeout(function() { imidz.src = 'http://localhost:8000/warning.png'; }, 0);
    };
    imidz.onload = function (evt) {
        paint(MAX_WIDTH, MAX_HEIGHT);
    };
    imidz.crossOrigin = 'anonymous';
    imidz.src = 'http://localhost:8000/rambo.jpg';
    // imidz.src = 'https://0.gravatar.com/avatar/45baa47da1ff57963ad44b4410402f05?r=x&s=440';

    window.onload = function (evt) {
        var inputDiv = document.getElementById('input'),
            widthInput = document.getElementById('width'),
            heightInput = document.getElementById('height'),
            saveAsInput = document.getElementById('save-as'),
            imageUrlInput = document.getElementById('image-url'),
            scaleButton = document.getElementById('scale'),
            saveButton = document.getElementById('save'),
            fileDiv = document.getElementById('file'),
            fetchButton = document.getElementById('fetch');

        function scale() {
            var width = +(widthInput.value || MAX_WIDTH),
                height = +(heightInput.value || MAX_HEIGHT);

            paint(width, height);
        }

        function updateImage() {
            imidz.src = imageUrlInput.value;
        }

        function onEnter(action) {
            return function (evt) {
                if (evt.charCode !== 13) return;
                action(evt);
            };
        }

        widthInput.value = MAX_WIDTH;
        heightInput.value = MAX_HEIGHT;
        imageUrlInput.value = imidz.src;
        saveAsInput.value = defaultSaveAs;

        inputDiv.onkeypress = onEnter(scale);
        scaleButton.onclick = scale;
        fileDiv.onkeypress = onEnter(updateImage);
        fetchButton.onclick = updateImage;
        saveButton.onclick = function (evt) {
            var canvas = document.getElementById('canvas'),
                contentType = 'image/jpeg',
                url = '/images/' + (saveAsInput.value || defaultSaveAs),
                xhr = new XMLHttpRequest();
            xhr.open('POST', url);
            xhr.setRequestHeader('Content-Type', contentType);
            xhr.onreadystatechange = function() {
                if (xhr.readyState === 4) {
                    if (xhr.status === 201) {
                        alert('Saved');
                    } else {
                        alert('Shit happened: ' + xhr.status);
                    }
                }
            };
            xhr.send(canvas.toDataURL(contentType).substr(23));
        };
    };
})();
