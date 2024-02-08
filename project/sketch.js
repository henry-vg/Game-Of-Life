let field;

function setup() {
    createCanvas(windowWidth, windowHeight);

    frameRate(5);

    field = new Field(
        createVector(20, 20),
        createVector(1024, 768)
    );
}

function draw() {
    background(20);

    field.render();
    field.setNextGeneration();
}