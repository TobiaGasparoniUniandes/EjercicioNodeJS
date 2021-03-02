const fs = require("fs");
const axios = require("axios");
const http = require("http");


const PORT = 8081;
const PROVEEDORES = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
const CLIENTES = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

//Leer archivos y extraer datos
const getFileContent = (callback) => {
    fs.readFile("index.html", (err, data) => {
        if(err) throw err;
        callback(data.toString());
    });
};

http.createServer((req, res) => {
    //Analizar la url sobre la cual se hacen peticiones
    console.log(req.url);
    /*
        Si la URL termina en "/api/proveedores"
    */
    if(req.url==="/api/proveedores") {
        console.log("prov");
        getFileContent((data) => {
            axios.get(PROVEEDORES)
                .then(function (response) {
                    let dataProveedores = response.data;
                    
                    data = data.replace("{{TitleTable}}", "Lista de proveedores");

                    const row = `<tr>
                        <th scope="row">{{PROV_ID}}</th>
                        <td>{{PROV_NOMBRE}}</td>
                        <td>{{PROV_COMPANIA}}</td>
                    </tr>`;

                    let entries = "";

                    for(let i = 0; i < dataProveedores.length; i++) {
                        let prov = dataProveedores[i];
                        let rowMod = row
                            .replace("{{PROV_ID}}", prov.idproveedor)
                            .replace("{{PROV_COMPANIA}}", prov.nombrecontacto)
                            .replace("{{PROV_NOMBRE}}", prov.nombrecompania);
                        entries += rowMod
                    }

                    data = data.replace("{{Entries}}", entries);

                    res.end(data);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        });
    }
    /*
        Si la URL termina en "/api/clientes"
    */
    else if(req.url==="/api/clientes") {
        console.log("cli");
        getFileContent((data) => {
            axios.get(CLIENTES)
                .then(function (response) {
                    let dataClientes = response.data;
                    
                    data = data.replace("{{TitleTable}}", "Lista de clientes");

                    const row = `<tr>
                        <th scope="row">{{CLI_ID}}</th>
                        <td>{{CLI_COMPANIA}}</td>
                        <td>{{CLI_NOMBRE}}</td>
                    </tr>`;

                    let entries = "";

                    for(let i = 0; i < dataClientes.length; i++) {
                        let cli = dataClientes[i];
                        let rowMod = row
                            .replace("{{CLI_ID}}", cli.idCliente)
                            .replace("{{CLI_NOMBRE}}", cli.NombreContacto)
                            .replace("{{CLI_COMPANIA}}", cli.NombreCompania);
                        entries += rowMod
                    }

                    data = data.replace("{{Entries}}", entries);

                    res.end(data);
                })
                .catch(function (error) {
                    // handle error
                    console.log(error);
                });
        });
    }
})
.listen(PORT);