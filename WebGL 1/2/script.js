const canvas = document.getElementById("canvas");
        const gl = canvas.getContext("webgl");

        const vertexShaderSource = `
            attribute vec2 vertPosition;
            void main() {
                gl_Position = vec4(vertPosition, 0.0, 1.0);
            }
        `;

        const fragmentShaderSource = `
            precision mediump float;
            uniform vec4 fragColor;
            void main() {
                gl_FragColor = fragColor;
            }
        `;

        // Shader wierzcholkow
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexShaderSource);
        gl.compileShader(vertexShader);

        // Shader fragmentow
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentShaderSource);
        gl.compileShader(fragmentShader);

        // Tworzenie programu i dolaczanie shaderow
        const program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        gl.useProgram(program);

        // Definiowanie wierzcholkow
        const positions = [
            0.0, 0.5,
            -0.5, -0.5,
            0.5, -0.5
        ];
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

        // Ustawianie atrybutu pozycji
        const positionAttributeLocation = gl.getAttribLocation(program, "vertPosition");
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

        // Ustawianie uniforma koloru
        const colorUniformLocation = gl.getUniformLocation(program, "fragColor");

        // Rysowanie trójkąta
        function drawTriangle(color) {
            gl.clearColor(0.5, 0.5, 0.9, 1.0); // Czyszczenie tła na czarno
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.uniform4fv(colorUniformLocation, color);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        }

        // Inicjalizacja koloru
        let currentColor = [0.0, 0.0, 0.0, 1.0]; // Domyślny kolor (czarny)
        drawTriangle(currentColor);

        // Obsługa kliknięcia przycisku
        const colorButton = document.getElementById("colorButton");
    colorButton.addEventListener("click", changeColor);
    function changeColor() {
        // Generowanie losowego koloru RGB
        const red = Math.random();
        const green = Math.random();
        const blue = Math.random();
        const alpha = 1.0; // Niezmienne

        currentColor = [red, green, blue, alpha];
        drawTriangle(currentColor);
    }
