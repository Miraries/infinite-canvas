const stage = new Konva.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight,
    draggable: true
});

const layer = new Konva.Layer();
stage.add(layer);

var scaleBy = 1.05;
window.addEventListener('wheel', (e) => {
    e.preventDefault();
    var oldScale = stage.scaleX();

    var mousePointTo = {
        x: stage.getPointerPosition().x / oldScale - stage.x() / oldScale,
        y: stage.getPointerPosition().y / oldScale - stage.y() / oldScale,
    };

    var newScale = e.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    stage.scale({ x: newScale, y: newScale });

    var newPos = {
        x: -(mousePointTo.x - stage.getPointerPosition().x / newScale) * newScale,
        y: -(mousePointTo.y - stage.getPointerPosition().y / newScale) * newScale
    };
    stage.position(newPos);
    stage.batchDraw();

    document.querySelector('#scale').innerText = `scale: ${stage.getScaleX().toFixed(2)}`;
});

/*let shapes = [];

function updateShapes() {
    shapes.map(shape => {
        shape.x += stage.x();
        shape.y += stage.y();
        layer.add(shape);
    });
}

updateShapes();
layer.draw();*/

/*stage.on('dragend', () => {
    layer.destroyChildren();
    updateShapes();
    layer.draw();
})*/

stage.on('dragmove', () => {
    document.querySelector('#stage').innerText = `stageX: ${Math.floor(stage.x())}, stageY: ${Math.floor(stage.y())}`;
})

stage.on('click', () => {
    var transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    var pos = stage.getPointerPosition();
    let { x, y } = realCoordinates(pos.x, pos.y);
    createTriangle(x, y);
});

stage.on('mousemove', () => {
    let p = stage.getPointerPosition();
    let { x, y } = realCoordinates(p.x, p.y);
    document.querySelector('#coord').innerText = `x: ${p.x}, y: ${p.y}
    											  rX: ${x}, rY: ${y}`;
});

function realCoordinates(x, y) {
    return {
        x: Math.floor((x - stage.x()) / stage.getScaleX()),
        y: Math.floor((y - stage.y()) / stage.getScaleY())
    }
}

function createTriangle(x, y) {
    const triangle = new Konva.RegularPolygon({
        x,
        y,
        sides: 3,
        radius: 80,
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 4,
        draggable: true
    });
    //shapes.push(triangle);
    layer.add(triangle);
    layer.draw();
}

function dodrop(event) {
    var files = event.dataTransfer.files
    console.log(event)
    let { x, y } = realCoordinates(event.x, event.y)

    for (file of files) {
        addFile(file, x, y)
    }
}

function addFile(file, x = 0, y = 0) {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        var image = new Konva.Image({
            draggable: true
        })
        imageObj = new Image()
        imageObj.src = reader.result //Switch to URL.createObjectURL ?
        imageObj.onload = function() {
            image.setImage(imageObj)
            console.log(image)
            image.setX(x - image.getImage().width/2)
            image.setY(y - image.getImage().height/2)
            //shapes.push(image)
            //updateShapes()
            layer.add(image)
            layer.draw()
        }
    }
}

function preventDefaults(e) {
    e.preventDefault()
    e.stopPropagation()
}

function attachEvents() {
    var el = document.getElementById("container");
    el.addEventListener('dragover', (e) => preventDefaults(e));
    el.addEventListener('dragenter', (e) => {
        preventDefaults(e);
        el.style.backgroundColor = 'lightblue'
    })
    el.addEventListener('dragleave', (e) => {
        preventDefaults(e);
        el.style.backgroundColor = '#F0F0F0'
    })
    el.addEventListener('drop', (e) => {
        preventDefaults(e);
        dodrop(event);
        el.style.backgroundColor = '#F0F0F0'
    });
}
attachEvents();