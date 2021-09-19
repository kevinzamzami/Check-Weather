const express = require("express")
const app = express();
const https = require("https");
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));


app.get("/", function(request,response){
    response.sendFile(__dirname + "/index.html");
});

app.post("/",function(request,response){
    let locName = request.body.locName ;
    let apiKey = "d3eb955b923603fd7fc18d08bb74afc6";
    let apiEndPoint = "https://api.openweathermap.org/data/2.5/weather";
    let apiParam = `?q=${locName}&appid=${apiKey}&units=metric`;
    let url = apiEndPoint + apiParam;
    https.get(url,function(res){
        statusCode = res.statusCode;
        res.on("data",function(data){
            var weatherData = JSON.parse(data);
            var locationName = `${weatherData.name} (${weatherData.sys.country})`;
            var desc = `The weather is currently ${weatherData.weather[0].description}`;
            var temperature = weatherData.main.temp;
            var humidity = weatherData.main.humidity;
            var pressure = weatherData.main.pressure;
            var objectData = {
                locName: locationName,
                desc: desc,
                temperature: temperature,
                humidity: humidity,
                pressure: pressure
            }
            var objectDataNull = {
                locName: "Unknown Location",
                desc: "unidentified",
                temperature: "unidentified",
                humidity: "unidentified",
                pressure: "unidentified"
            }
            if(statusCode == "404"){
                response.render('index.pug',objectDataNull);
            }
            else{
                response.render('index.pug',objectData);
            }
        });
        
    })
});


app.listen(port,function(){{
    console.log(`Server is up on port 3000`)
}})